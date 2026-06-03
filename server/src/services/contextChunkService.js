import { env } from '../config/env.js';

const CHUNK_OVERLAP_CHARS = 300;

function chunkContent(content, maxChunkChars) {
  if (content.length <= maxChunkChars) {
    return [content];
  }

  const chunks = [];
  let start = 0;

  while (start < content.length) {
    const end = Math.min(start + maxChunkChars, content.length);
    chunks.push(content.slice(start, end));

    if (end === content.length) {
      break;
    }

    start = Math.max(end - CHUNK_OVERLAP_CHARS, start + 1);
  }

  return chunks;
}

function createChunkFile(file, content, chunkIndex, totalChunks) {
  const isChunked = totalChunks > 1;

  return {
    ...file,
    path: isChunked ? `${file.path}#chunk-${chunkIndex + 1}` : file.path,
    originalPath: file.originalPath ?? file.path,
    size: content.length,
    content,
    chunk: {
      index: chunkIndex + 1,
      total: totalChunks,
    },
    contextNote: isChunked
      ? `Chunk ${chunkIndex + 1} of ${totalChunks} from ${file.path}. Adjacent chunks overlap slightly.`
      : undefined,
  };
}

function chunkFile(file, maxChunkChars) {
  const chunks = chunkContent(file.content, maxChunkChars);
  return chunks.map((chunk, index) => createChunkFile(file, chunk, index, chunks.length));
}

function summarizeOmittedChunks(chunks) {
  const byPath = new Map();

  for (const chunk of chunks) {
    const originalPath = chunk.originalPath ?? chunk.path;
    const current = byPath.get(originalPath) ?? {
      path: originalPath,
      omittedChunks: 0,
      omittedCharacters: 0,
    };

    current.omittedChunks += 1;
    current.omittedCharacters += chunk.content.length;
    byPath.set(originalPath, current);
  }

  return Array.from(byPath.values());
}

export function chunkFilesForContext(
  files,
  { maxChunkChars = env.aiMaxFileChunkChars, maxContextChars = env.aiMaxContextChars } = {}
) {
  const chunks = files.flatMap((file) => chunkFile(file, maxChunkChars));
  const selectedChunks = [];
  const omittedChunks = [];
  let usedCharacters = 0;

  for (const chunk of chunks) {
    const nextUsedCharacters = usedCharacters + chunk.content.length;

    if (selectedChunks.length > 0 && nextUsedCharacters > maxContextChars) {
      omittedChunks.push(chunk);
      continue;
    }

    selectedChunks.push(chunk);
    usedCharacters = nextUsedCharacters;
  }

  return {
    files: selectedChunks,
    omittedContext: summarizeOmittedChunks(omittedChunks),
    contextCharacters: usedCharacters,
  };
}
