import { formatCodebaseSummaryForPrompt, formatFilesForPrompt } from './promptUtils.js';

export const TEST_GENERATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'kind',
    'overview',
    'testFrameworkRecommendation',
    'testCases',
    'generatedTestFiles',
    'setupNotes',
    'gaps',
  ],
  properties: {
    kind: {
      type: 'string',
      enum: ['test_generation'],
    },
    overview: {
      type: 'string',
    },
    testFrameworkRecommendation: {
      type: 'string',
    },
    testCases: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'type', 'description', 'targetFiles', 'steps', 'expectedResult'],
        properties: {
          name: { type: 'string' },
          type: {
            type: 'string',
            enum: ['unit', 'integration', 'api', 'e2e', 'other'],
          },
          description: { type: 'string' },
          targetFiles: {
            type: 'array',
            items: { type: 'string' },
          },
          steps: {
            type: 'array',
            items: { type: 'string' },
          },
          expectedResult: { type: 'string' },
        },
      },
    },
    generatedTestFiles: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['path', 'content', 'notes'],
        properties: {
          path: { type: 'string' },
          content: { type: 'string' },
          notes: { type: 'string' },
        },
      },
    },
    setupNotes: {
      type: 'array',
      items: { type: 'string' },
    },
    gaps: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

export function buildTestGenerationPrompt({ question, files, codebaseSummary }) {
  return {
    schemaName: 'test_generation',
    schema: TEST_GENERATION_SCHEMA,
    temperature: 0.15,
    instructions: [
      'You are CodeLens, an AI codebase assistant for professional developers.',
      'Generate practical tests for the provided source files using only the available context.',
      'Prefer the testing style implied by existing code and package metadata when visible.',
      'Generated test file content must be complete enough for a developer to adapt directly.',
      'Do not invent unavailable APIs. List setup gaps when dependencies or fixtures are missing.',
      'Return concise JSON that matches the supplied schema.',
    ].join('\n'),
    input: [
      'Developer question:',
      question || 'Generate useful tests for this code.',
      '',
      'Codebase summary:',
      formatCodebaseSummaryForPrompt(codebaseSummary),
      '',
      'Source files:',
      formatFilesForPrompt(files),
    ].join('\n'),
  };
}
