import path from 'node:path';

import unzipper from 'unzipper';

import { ApiError } from '../utils/ApiError.js';

const IGNORED_DIRECTORY_NAMES = new Set([
  '.git',
  '.hg',
  '.svn',
  '.next',
  '.nuxt',
  '.turbo',
  '.vercel',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'vendor',
]);

const LANGUAGE_BY_EXTENSION = new Map([
  ['.c', 'C'],
  ['.cpp', 'C++'],
  ['.cs', 'C#'],
  ['.css', 'CSS'],
  ['.go', 'Go'],
  ['.html', 'HTML'],
  ['.java', 'Java'],
  ['.js', 'JavaScript'],
  ['.jsx', 'React JSX'],
  ['.json', 'JSON'],
  ['.kt', 'Kotlin'],
  ['.md', 'Markdown'],
  ['.php', 'PHP'],
  ['.py', 'Python'],
  ['.rb', 'Ruby'],
  ['.rs', 'Rust'],
  ['.sh', 'Shell'],
  ['.sql', 'SQL'],
  ['.ts', 'TypeScript'],
  ['.tsx', 'React TSX'],
  ['.vue', 'Vue'],
  ['.yaml', 'YAML'],
  ['.yml', 'YAML'],
]);

function normalizeArchivePath(rawPath) {
  const normalizedPath = path.posix.normalize(String(rawPath ?? '').replaceAll('\\', '/'));
  const cleanPath = normalizedPath.replace(/^([a-zA-Z]:)?\/+/, '');

  if (
    !cleanPath ||
    cleanPath === '.' ||
    cleanPath.startsWith('../') ||
    cleanPath.includes('/../')
  ) {
    return null;
  }

  return cleanPath;
}

function shouldIgnorePath(filePath) {
  return filePath.split('/').some((part) => IGNORED_DIRECTORY_NAMES.has(part));
}

function getFileLanguage(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return LANGUAGE_BY_EXTENSION.get(extension) ?? null;
}

function isLikelyBinary(buffer) {
  if (buffer.length === 0) {
    return false;
  }

  const sample = buffer.subarray(0, Math.min(buffer.length, 8000));
  let suspiciousBytes = 0;

  for (const byte of sample) {
    if (byte === 0) {
      return true;
    }

    const isAllowedControlByte = byte === 9 || byte === 10 || byte === 13;

    if (byte < 32 && !isAllowedControlByte) {
      suspiciousBytes += 1;
    }
  }

  return suspiciousBytes / sample.length > 0.3;
}

function createFileRecord(filePath, buffer) {
  const isBinary = isLikelyBinary(buffer);

  return {
    path: filePath,
    name: path.posix.basename(filePath),
    extension: path.extname(filePath).toLowerCase(),
    language: getFileLanguage(filePath),
    size: buffer.length,
    isBinary,
    content: isBinary ? null : buffer.toString('utf8'),
  };
}

function addFileToTree(root, file) {
  const parts = file.path.split('/');
  let currentNode = root;

  for (const [index, part] of parts.entries()) {
    const isFile = index === parts.length - 1;
    let nextNode = currentNode.children.find((child) => child.name === part);

    if (!nextNode) {
      nextNode = {
        name: part,
        path: parts.slice(0, index + 1).join('/'),
        type: isFile ? 'file' : 'directory',
        children: isFile ? undefined : [],
      };
      currentNode.children.push(nextNode);
    }

    if (isFile) {
      nextNode.size = file.size;
      nextNode.language = file.language;
      nextNode.isBinary = file.isBinary;
      return;
    }

    currentNode = nextNode;
  }
}

function sortTree(node) {
  if (!node.children) {
    return node;
  }

  node.children.sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === 'directory' ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });

  node.children.forEach(sortTree);
  return node;
}

function buildTree(files) {
  const root = {
    name: 'root',
    path: '',
    type: 'directory',
    children: [],
  };

  for (const file of files) {
    addFileToTree(root, file);
  }

  return sortTree(root);
}

function summarizeFiles(files) {
  return files.reduce(
    (summary, file) => {
      summary.totalFiles += 1;
      summary.totalBytes += file.size;

      if (file.isBinary) {
        summary.binaryFiles += 1;
      } else {
        summary.textFiles += 1;
      }

      if (file.language) {
        summary.languages[file.language] = (summary.languages[file.language] ?? 0) + 1;
      }

      return summary;
    },
    {
      totalFiles: 0,
      totalBytes: 0,
      textFiles: 0,
      binaryFiles: 0,
      languages: {},
    }
  );
}

function createParsedCodebase(source, files) {
  if (files.length === 0) {
    throw new ApiError(400, 'empty_codebase', 'No readable files were found in the upload.');
  }

  return {
    source,
    tree: buildTree(files),
    files,
    summary: summarizeFiles(files),
  };
}

export function parseFolderUpload(uploadedFiles) {
  const files = uploadedFiles
    .map((file) => {
      const filePath = normalizeArchivePath(file.originalname);

      if (!filePath || shouldIgnorePath(filePath)) {
        return null;
      }

      return createFileRecord(filePath, file.buffer);
    })
    .filter(Boolean);

  return createParsedCodebase('folder', files);
}

export async function parseZipUpload(archive) {
  const directory = await unzipper.Open.buffer(archive.buffer);
  const files = [];

  for (const entry of directory.files) {
    const filePath = normalizeArchivePath(entry.path);

    if (entry.type !== 'File' || !filePath || shouldIgnorePath(filePath)) {
      continue;
    }

    files.push(createFileRecord(filePath, await entry.buffer()));
  }

  return createParsedCodebase('archive', files);
}
