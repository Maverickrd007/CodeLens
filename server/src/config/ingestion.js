import path from 'node:path';

const BYTES_IN_MB = 1024 * 1024;

export const MAX_ARCHIVE_BYTES = 25 * BYTES_IN_MB;
export const MAX_SINGLE_SOURCE_FILE_BYTES = 1.5 * BYTES_IN_MB;
export const MAX_TOTAL_SOURCE_BYTES = 20 * BYTES_IN_MB;
export const MAX_TOTAL_SOURCE_FILES = 1000;

const SUPPORTED_SOURCE_EXTENSIONS = new Set([
  '.c',
  '.cc',
  '.conf',
  '.cpp',
  '.cs',
  '.css',
  '.csv',
  '.env',
  '.go',
  '.graphql',
  '.h',
  '.hpp',
  '.html',
  '.java',
  '.js',
  '.json',
  '.jsx',
  '.kt',
  '.lock',
  '.md',
  '.mjs',
  '.php',
  '.properties',
  '.py',
  '.rb',
  '.rs',
  '.scss',
  '.sh',
  '.sql',
  '.svg',
  '.toml',
  '.ts',
  '.tsx',
  '.txt',
  '.vue',
  '.xml',
  '.yaml',
  '.yml',
]);

const SUPPORTED_SOURCE_FILENAMES = new Set([
  '.dockerignore',
  '.editorconfig',
  '.env.example',
  '.eslintignore',
  '.eslintrc',
  '.gitignore',
  '.prettierignore',
  '.prettierrc',
  'dockerfile',
  'license',
  'makefile',
  'procfile',
  'readme',
]);

export function isZipArchivePath(filePath) {
  return path.extname(filePath).toLowerCase() === '.zip';
}

export function isSupportedSourcePath(filePath) {
  const filename = path.posix.basename(String(filePath).replaceAll('\\', '/')).toLowerCase();

  if (SUPPORTED_SOURCE_FILENAMES.has(filename)) {
    return true;
  }

  return SUPPORTED_SOURCE_EXTENSIONS.has(path.extname(filename));
}
