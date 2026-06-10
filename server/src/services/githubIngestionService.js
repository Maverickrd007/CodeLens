import { Octokit } from 'octokit';
import path from 'node:path';

import {
  MAX_SINGLE_SOURCE_FILE_BYTES,
  MAX_TOTAL_SOURCE_BYTES,
  MAX_TOTAL_SOURCE_FILES,
  isSupportedSourcePath,
} from '../config/ingestion.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { parseBufferEntries } from './fileTreeService.js';

const octokit = new Octokit({
  ...(env.githubToken ? { auth: env.githubToken } : {}),
  userAgent: 'codelens-api/0.1.0',
});

function parseRepositoryUrl(repositoryUrl) {
  let url;

  try {
    url = new URL(repositoryUrl);
  } catch {
    throw new ApiError(400, 'invalid_github_url', 'GitHub repository URL is invalid.');
  }

  if (url.hostname !== 'github.com') {
    throw new ApiError(400, 'invalid_github_url', 'Only github.com repository URLs are supported.');
  }

  const [owner, rawRepo, mode, ...rest] = url.pathname.split('/').filter(Boolean);

  if (!owner || !rawRepo) {
    throw new ApiError(
      400,
      'invalid_github_url',
      'GitHub repository URL must include owner and repo.'
    );
  }

  return {
    owner,
    repo: rawRepo.replace(/\.git$/, ''),
    mode,
    rest,
  };
}

function normalizePrefix(prefix) {
  return prefix.replace(/^\/+|\/+$/g, '');
}

async function getRepository(owner, repo) {
  try {
    const { data } = await octokit.rest.repos.get({ owner, repo });
    return data;
  } catch (error) {
    if (error.status === 404) {
      throw new ApiError(404, 'github_repo_not_found', 'GitHub repository was not found.');
    }

    throw error;
  }
}

async function refExists(owner, repo, ref) {
  try {
    await octokit.rest.git.getRef({ owner, repo, ref: `heads/${ref}` });
    return true;
  } catch (error) {
    if (error.status === 404) {
      return false;
    }

    throw error;
  }
}

async function resolveUrlRef(owner, repo, repository, mode, rest) {
  if (mode !== 'tree' && mode !== 'blob') {
    return {
      ref: repository.default_branch,
      pathPrefix: '',
    };
  }

  for (let index = rest.length; index >= 1; index -= 1) {
    const ref = rest.slice(0, index).join('/');

    if (await refExists(owner, repo, ref)) {
      return {
        ref,
        pathPrefix: normalizePrefix(rest.slice(index).join('/')),
      };
    }
  }

  throw new ApiError(404, 'github_ref_not_found', 'GitHub branch from URL was not found.');
}

async function getBranchCommitSha(owner, repo, branch) {
  try {
    const { data } = await octokit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });

    return data.commit.sha;
  } catch (error) {
    if (error.status === 404) {
      throw new ApiError(404, 'github_ref_not_found', 'GitHub branch was not found.');
    }

    throw error;
  }
}

function isPathInPrefix(filePath, pathPrefix) {
  return pathPrefix === '' || filePath === pathPrefix || filePath.startsWith(`${pathPrefix}/`);
}

function getRelativeIngestPath(filePath, pathPrefix) {
  if (!pathPrefix) {
    return filePath;
  }

  if (filePath === pathPrefix) {
    return path.posix.basename(filePath);
  }

  return filePath.slice(pathPrefix.length).replace(/^\/+/, '');
}

function validateTreeItem(treeItem) {
  if (treeItem.size > MAX_SINGLE_SOURCE_FILE_BYTES) {
    throw new ApiError(
      413,
      'source_file_too_large',
      `${treeItem.path} exceeds the source file size limit.`
    );
  }
}

async function fetchBlobBuffer(owner, repo, fileSha) {
  const { data } = await octokit.rest.git.getBlob({
    owner,
    repo,
    file_sha: fileSha,
  });

  return Buffer.from(data.content, data.encoding);
}

export async function ingestGithubRepository(repositoryUrl) {
  const { owner, repo, mode, rest } = parseRepositoryUrl(repositoryUrl);
  const repository = await getRepository(owner, repo);
  const { ref, pathPrefix } = await resolveUrlRef(owner, repo, repository, mode, rest);
  const commitSha = await getBranchCommitSha(owner, repo, ref);
  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: commitSha,
    recursive: 'true',
  });

  if (treeData.truncated) {
    throw new ApiError(
      413,
      'github_tree_too_large',
      'GitHub repository tree is too large to ingest at once.'
    );
  }

  const entries = [];
  let totalBytes = 0;

  for (const treeItem of treeData.tree) {
    if (treeItem.type !== 'blob' || !treeItem.path || !treeItem.sha) {
      continue;
    }

    if (!isPathInPrefix(treeItem.path, pathPrefix)) {
      continue;
    }

    const parsedPath = getRelativeIngestPath(treeItem.path, pathPrefix);

    if (!isSupportedSourcePath(parsedPath)) {
      continue;
    }

    validateTreeItem(treeItem);
    totalBytes += treeItem.size ?? 0;

    if (entries.length >= MAX_TOTAL_SOURCE_FILES) {
      throw new ApiError(
        413,
        'too_many_source_files',
        'GitHub repository contains too many source files.'
      );
    }

    if (totalBytes > MAX_TOTAL_SOURCE_BYTES) {
      throw new ApiError(
        413,
        'codebase_too_large',
        'GitHub repository exceeds the total source size limit.'
      );
    }

    entries.push({
      path: parsedPath,
      buffer: await fetchBlobBuffer(owner, repo, treeItem.sha),
    });
  }

  return parseBufferEntries('github', entries, {
    repository: repository.full_name,
    url: repository.html_url,
    ref,
    commitSha,
    pathPrefix,
  });
}
