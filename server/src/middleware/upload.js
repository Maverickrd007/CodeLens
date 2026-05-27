import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

export const codebaseUpload = upload.fields([
  { name: 'archive', maxCount: 1 },
  { name: 'files', maxCount: 1000 },
]);

export function getUploadedArchive(req) {
  return req.files?.archive?.[0] ?? null;
}

export function getUploadedFolderFiles(req) {
  return req.files?.files ?? [];
}
