import { buildArchitectureSummaryPrompt } from '../prompts/architectureSummaryPrompt.js';
import { buildBugDetectionPrompt } from '../prompts/bugDetectionPrompt.js';
import { buildFileExplanationPrompt } from '../prompts/fileExplanationPrompt.js';
import { buildTestGenerationPrompt } from '../prompts/testGenerationPrompt.js';
import { ApiError } from '../utils/ApiError.js';
import { chunkFilesForContext } from './contextChunkService.js';

const SUPPORTED_TASKS = new Set([
  'file_explanation',
  'architecture_summary',
  'test_generation',
  'bug_detection',
]);

function normalizeTask(task) {
  const normalizedTask = String(task ?? 'file_explanation').trim();

  if (!SUPPORTED_TASKS.has(normalizedTask)) {
    throw new ApiError(400, 'unsupported_ai_task', `Unsupported AI task "${normalizedTask}".`);
  }

  return normalizedTask;
}

function normalizeQuestion(question) {
  const normalizedQuestion = String(question ?? '').trim();

  if (normalizedQuestion.length > 2000) {
    throw new ApiError(400, 'question_too_long', 'Question must be 2000 characters or less.');
  }

  return normalizedQuestion;
}

function getCandidateFiles(body) {
  if (Array.isArray(body.files)) {
    return body.files;
  }

  if (Array.isArray(body.codebase?.files)) {
    return body.codebase.files;
  }

  return [];
}

function normalizeFile(file) {
  if (!file || typeof file.path !== 'string') {
    return null;
  }

  if (file.isBinary || typeof file.content !== 'string') {
    return null;
  }

  return {
    path: file.path,
    name: file.name ?? file.path.split('/').at(-1),
    extension: file.extension,
    language: file.language,
    size: Number(file.size ?? file.content.length),
    content: file.content,
  };
}

function normalizeFiles(body) {
  const files = getCandidateFiles(body).map(normalizeFile).filter(Boolean);

  if (files.length === 0) {
    throw new ApiError(400, 'ai_context_required', 'At least one text source file is required.');
  }

  return files;
}

function getCodebaseSummary(body) {
  return body.codebase?.summary ?? body.summary ?? null;
}

function getSelectedFile(files, selectedFilePath) {
  if (selectedFilePath) {
    const selectedFile = files.find((file) => file.path === selectedFilePath);

    if (!selectedFile) {
      throw new ApiError(404, 'selected_file_not_found', 'Selected file was not found in context.');
    }

    return selectedFile;
  }

  if (files.length === 1) {
    return files[0];
  }

  throw new ApiError(
    400,
    'selected_file_required',
    'selectedFilePath is required for file explanations.'
  );
}

function getUniqueOriginalPaths(files) {
  return Array.from(new Set(files.map((file) => file.originalPath ?? file.path)));
}

function preparePromptContext(files) {
  const chunkedContext = chunkFilesForContext(files);

  return {
    files: chunkedContext.files,
    filesUsed: getUniqueOriginalPaths(chunkedContext.files),
    omittedContext: chunkedContext.omittedContext,
    contextCharacters: chunkedContext.contextCharacters,
  };
}

export function normalizeAiRequestContext(body) {
  const task = normalizeTask(body.task);
  const question = normalizeQuestion(body.question);
  const files = normalizeFiles(body);
  const selectedFilePath = String(body.selectedFilePath ?? body.filePath ?? '').trim();

  if (task === 'file_explanation') {
    const selectedFile = getSelectedFile(files, selectedFilePath);
    const promptContext = preparePromptContext([selectedFile]);

    return {
      task,
      question,
      selectedFile,
      ...promptContext,
      codebaseSummary: getCodebaseSummary(body),
    };
  }

  if ((task === 'test_generation' || task === 'bug_detection') && selectedFilePath) {
    const selectedFile = getSelectedFile(files, selectedFilePath);
    const promptContext = preparePromptContext([selectedFile]);

    return {
      task,
      question,
      ...promptContext,
      codebaseSummary: getCodebaseSummary(body),
    };
  }

  const promptContext = preparePromptContext(files);

  return {
    task,
    question,
    ...promptContext,
    codebaseSummary: getCodebaseSummary(body),
  };
}

export function buildPromptForTask(context) {
  if (context.task === 'file_explanation') {
    return buildFileExplanationPrompt({
      question: context.question,
      files: context.files,
      codebaseSummary: context.codebaseSummary,
      omittedContext: context.omittedContext,
    });
  }

  if (context.task === 'architecture_summary') {
    return buildArchitectureSummaryPrompt({
      question: context.question,
      files: context.files,
      codebaseSummary: context.codebaseSummary,
      omittedContext: context.omittedContext,
    });
  }

  if (context.task === 'test_generation') {
    return buildTestGenerationPrompt({
      question: context.question,
      files: context.files,
      codebaseSummary: context.codebaseSummary,
      omittedContext: context.omittedContext,
    });
  }

  if (context.task === 'bug_detection') {
    return buildBugDetectionPrompt({
      question: context.question,
      files: context.files,
      codebaseSummary: context.codebaseSummary,
      omittedContext: context.omittedContext,
    });
  }

  throw new ApiError(400, 'unsupported_ai_task', `Unsupported AI task "${context.task}".`);
}
