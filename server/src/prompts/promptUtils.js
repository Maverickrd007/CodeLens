function formatLanguage(language) {
  return language ? `${language}` : 'Unknown';
}

export function formatFileForPrompt(file) {
  const content = typeof file.content === 'string' ? file.content : '';

  return [
    `Path: ${file.path}`,
    `Language: ${formatLanguage(file.language)}`,
    `Size: ${file.size ?? content.length} bytes`,
    '',
    '```',
    content,
    '```',
  ].join('\n');
}

export function formatCodebaseSummaryForPrompt(summary) {
  if (!summary) {
    return 'No codebase summary was provided.';
  }

  const languages = Object.entries(summary.languages ?? {})
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([language, count]) => `${language}: ${count}`)
    .join(', ');

  return [
    `Total files: ${summary.totalFiles ?? 0}`,
    `Text files: ${summary.textFiles ?? 0}`,
    `Binary files: ${summary.binaryFiles ?? 0}`,
    `Total bytes: ${summary.totalBytes ?? 0}`,
    `Languages: ${languages || 'Unknown'}`,
  ].join('\n');
}

export function formatFilesForPrompt(files) {
  if (!Array.isArray(files) || files.length === 0) {
    return 'No source files were provided.';
  }

  return files.map((file, index) => `File ${index + 1}\n${formatFileForPrompt(file)}`).join('\n\n');
}
