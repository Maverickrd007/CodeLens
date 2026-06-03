import { formatCodebaseSummaryForPrompt, formatFilesForPrompt } from './promptUtils.js';

export const BUG_DETECTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'summary', 'findings', 'safeFixes', 'followUpQuestions'],
  properties: {
    kind: {
      type: 'string',
      enum: ['bug_detection'],
    },
    summary: {
      type: 'string',
    },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'severity',
          'title',
          'path',
          'lineEstimate',
          'description',
          'evidence',
          'recommendation',
        ],
        properties: {
          severity: {
            type: 'string',
            enum: ['critical', 'high', 'medium', 'low'],
          },
          title: { type: 'string' },
          path: { type: 'string' },
          lineEstimate: { type: 'string' },
          description: { type: 'string' },
          evidence: { type: 'string' },
          recommendation: { type: 'string' },
        },
      },
    },
    safeFixes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['path', 'change', 'reason'],
        properties: {
          path: { type: 'string' },
          change: { type: 'string' },
          reason: { type: 'string' },
        },
      },
    },
    followUpQuestions: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

export function buildBugDetectionPrompt({ question, files, codebaseSummary }) {
  return {
    schemaName: 'bug_detection',
    schema: BUG_DETECTION_SCHEMA,
    temperature: 0.1,
    instructions: [
      'You are CodeLens, an AI codebase assistant for professional developers.',
      'Review the provided source files for concrete bugs, security issues, edge cases, and fragile logic.',
      'Base every finding on visible code. Avoid speculative issues that are not supported by the context.',
      'Prioritize correctness and security risks over style feedback.',
      'Return concise JSON that matches the supplied schema.',
    ].join('\n'),
    input: [
      'Developer question:',
      question || 'Find likely bugs and risky edge cases in this code.',
      '',
      'Codebase summary:',
      formatCodebaseSummaryForPrompt(codebaseSummary),
      '',
      'Source files:',
      formatFilesForPrompt(files),
    ].join('\n'),
  };
}
