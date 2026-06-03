import {
  formatCodebaseSummaryForPrompt,
  formatContextOmissionsForPrompt,
  formatFilesForPrompt,
} from './promptUtils.js';

export const FILE_EXPLANATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'kind',
    'summary',
    'responsibilities',
    'keyExports',
    'importantFunctions',
    'dependencies',
    'risks',
    'followUpQuestions',
  ],
  properties: {
    kind: {
      type: 'string',
      enum: ['file_explanation'],
    },
    summary: {
      type: 'string',
    },
    responsibilities: {
      type: 'array',
      items: { type: 'string' },
    },
    keyExports: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'type', 'description'],
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
    importantFunctions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'description', 'inputs', 'outputs', 'sideEffects'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          inputs: { type: 'string' },
          outputs: { type: 'string' },
          sideEffects: { type: 'string' },
        },
      },
    },
    dependencies: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'kind', 'reason'],
        properties: {
          name: { type: 'string' },
          kind: {
            type: 'string',
            enum: ['internal', 'external', 'runtime', 'unknown'],
          },
          reason: { type: 'string' },
        },
      },
    },
    risks: {
      type: 'array',
      items: { type: 'string' },
    },
    followUpQuestions: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

export function buildFileExplanationPrompt({ question, files, codebaseSummary, omittedContext }) {
  return {
    schemaName: 'file_explanation',
    schema: FILE_EXPLANATION_SCHEMA,
    temperature: 0.2,
    instructions: [
      'You are CodeLens, an AI codebase assistant for professional developers.',
      'Explain the selected file using only the provided source context.',
      'Be concrete, cite filenames and symbols when useful, and do not invent missing project behavior.',
      'Return concise JSON that matches the supplied schema.',
    ].join('\n'),
    input: [
      'Developer question:',
      question || 'Explain this file.',
      '',
      'Codebase summary:',
      formatCodebaseSummaryForPrompt(codebaseSummary),
      '',
      'Selected file context:',
      formatFilesForPrompt(files),
      '',
      'Omitted context:',
      formatContextOmissionsForPrompt(omittedContext),
    ].join('\n'),
  };
}
