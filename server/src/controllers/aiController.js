import { buildPromptForTask, normalizeAiRequestContext } from '../services/aiPromptService.js';
import { createStructuredResponse } from '../services/geminiService.js';

export async function askCodebase(req, res, next) {
  try {
    const context = normalizeAiRequestContext(req.body);
    const prompt = buildPromptForTask(context);
    const answer = await createStructuredResponse(prompt);

    res.status(200).json({
      task: context.task,
      answer,
      context: {
        filesUsed: context.filesUsed,
        omittedContext: context.omittedContext,
        contextCharacters: context.contextCharacters,
      },
    });
  } catch (error) {
    next(error);
  }
}
