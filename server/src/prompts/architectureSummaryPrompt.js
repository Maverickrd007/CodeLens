import {
  formatCodebaseSummaryForPrompt,
  formatContextOmissionsForPrompt,
  formatFilesForPrompt,
} from './promptUtils.js';

export const ARCHITECTURE_SUMMARY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'kind',
    'overview',
    'layers',
    'entryPoints',
    'dataFlow',
    'externalDependencies',
    'riskHotspots',
    'recommendedNextQuestions',
  ],
  properties: {
    kind: {
      type: 'string',
      enum: ['architecture_summary'],
    },
    overview: {
      type: 'string',
    },
    layers: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'responsibility', 'files'],
        properties: {
          name: { type: 'string' },
          responsibility: { type: 'string' },
          files: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
    entryPoints: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['path', 'purpose'],
        properties: {
          path: { type: 'string' },
          purpose: { type: 'string' },
        },
      },
    },
    dataFlow: {
      type: 'array',
      items: { type: 'string' },
    },
    externalDependencies: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'purpose'],
        properties: {
          name: { type: 'string' },
          purpose: { type: 'string' },
        },
      },
    },
    riskHotspots: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['path', 'risk', 'reason'],
        properties: {
          path: { type: 'string' },
          risk: { type: 'string' },
          reason: { type: 'string' },
        },
      },
    },
    recommendedNextQuestions: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

export function buildArchitectureSummaryPrompt({
  question,
  files,
  codebaseSummary,
  omittedContext,
}) {
  return {
    schemaName: 'architecture_summary',
    schema: ARCHITECTURE_SUMMARY_SCHEMA,
    temperature: 0.2,
    instructions: [
      'You are CodeLens, an AI codebase assistant for professional developers.',
      'Summarize the architecture from the provided source files and repository summary.',
      'Identify boundaries, entry points, major flows, dependencies, and risk hotspots.',
      'Use only the provided context. If evidence is incomplete, say what is uncertain inside the relevant field.',
      'Return concise JSON that matches the supplied schema.',
    ].join('\n'),
    input: [
      'Developer question:',
      question || 'Summarize the architecture of this codebase.',
      '',
      'Codebase summary:',
      formatCodebaseSummaryForPrompt(codebaseSummary),
      '',
      'Source files:',
      formatFilesForPrompt(files),
      '',
      'Omitted context:',
      formatContextOmissionsForPrompt(omittedContext),
    ].join('\n'),
  };
}
