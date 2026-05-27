import multer from 'multer';

import {
  MAX_ARCHIVE_BYTES,
  MAX_TOTAL_SOURCE_FILES,
  isSupportedSourcePath,
  isZipArchivePath,
} from '../config/ingestion.js';
import { ApiError } from '../utils/ApiError.js';

function fileFilter(_req, file, callback) {
  if (file.fieldname === 'archive') {
    if (!isZipArchivePath(file.originalname)) {
      callback(new ApiError(400, 'unsupported_archive_type', 'Only zip archives are supported.'));
      return;
    }

    callback(null, true);
    return;
  }

  if (file.fieldname === 'files') {
    callback(null, isSupportedSourcePath(file.originalname));
    return;
  }

  callback(
    new ApiError(400, 'unexpected_upload_field', `Unexpected upload field "${file.fieldname}".`)
  );
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: MAX_ARCHIVE_BYTES,
    files: MAX_TOTAL_SOURCE_FILES + 1,
  },
});

const codebaseUploadFields = upload.fields([
  { name: 'archive', maxCount: 1 },
  { name: 'files', maxCount: MAX_TOTAL_SOURCE_FILES },
]);

function mapMulterError(error) {
  if (!(error instanceof multer.MulterError)) {
    return error;
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return new ApiError(413, 'upload_too_large', 'Uploaded file exceeds the allowed size limit.');
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return new ApiError(413, 'too_many_files', 'Upload contains too many files.');
  }

  return new ApiError(400, 'invalid_upload', error.message);
}

export function codebaseUpload(req, res, next) {
  codebaseUploadFields(req, res, (error) => {
    if (error) {
      next(mapMulterError(error));
      return;
    }

    next();
  });
}

export function getUploadedArchive(req) {
  return req.files?.archive?.[0] ?? null;
}

export function getUploadedFolderFiles(req) {
  return req.files?.files ?? [];
}
