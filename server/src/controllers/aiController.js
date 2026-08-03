import { buildPromptForTask, normalizeAiRequestContext } from '../services/aiPromptService.js';
import { createStructuredResponse } from '../services/bedrockService.js';

export async function askCodebase(req, res, next) {
  try {
    const context = normalizeAiRequestContext(req.body);
    const prompt = buildPromptForTask(context);
    const answer = await createStructuredResponse(prompt);

    req.user.apiCalls = (req.user.apiCalls || 0) + 1;
    await req.user.save();

    res.status(200).json({
      task: context.task,
      answer,
      apiCalls: req.user.apiCalls,
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
