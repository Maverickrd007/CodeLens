import { getUploadedArchive, getUploadedFolderFiles } from '../middleware/upload.js';
import { parseFolderUpload, parseZipUpload } from '../services/fileTreeService.js';
import { ingestGithubRepository } from '../services/githubIngestionService.js';
import { ApiError } from '../utils/ApiError.js';

export async function uploadCodebase(req, res) {
  const archive = getUploadedArchive(req);
  const files = getUploadedFolderFiles(req);

  if (archive && files.length > 0) {
    throw new ApiError(400, 'mixed_upload_type', 'Upload either a zip archive or folder files.');
  }

  if (!archive && files.length === 0) {
    throw new ApiError(400, 'codebase_required', 'Upload a zip archive or folder files.');
  }

  const parsedCodebase = archive ? await parseZipUpload(archive) : parseFolderUpload(files);

  res.status(201).json({
    codebase: parsedCodebase,
  });
}

export async function ingestGithubCodebase(req, res) {
  const repositoryUrl = String(req.body.repositoryUrl ?? '').trim();

  if (!repositoryUrl) {
    throw new ApiError(400, 'github_url_required', 'GitHub repository URL is required.');
  }

  const parsedCodebase = await ingestGithubRepository(repositoryUrl);

  res.status(201).json({
    codebase: parsedCodebase,
  });
}
