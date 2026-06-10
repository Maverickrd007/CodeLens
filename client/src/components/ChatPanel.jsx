import {
  BookOpen,
  Bot,
  Bug,
  FlaskConical,
  GitFork,
  Loader2,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { ResponsePanel } from './ResponsePanel.jsx';
import { addMessageToSession, askCodebase, createSession } from '../services/api.js';
import { getStoredAuth } from '../services/authStorage.js';

const TASK_OPTIONS = [
  { value: 'file_explanation', label: 'Docs', icon: BookOpen },
  { value: 'architecture_summary', label: 'Architecture', icon: GitFork },
  { value: 'test_generation', label: 'Tests', icon: FlaskConical },
  { value: 'bug_detection', label: 'Bugs', icon: Bug },
];

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const Icon = isUser ? User : Bot;

  return (
    <article className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser ? (
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-cyan-100 text-cyan-700">
          <Icon size={16} aria-hidden="true" />
        </span>
      ) : null}
      <div
        className={`max-w-[min(88%,42rem)] rounded-lg px-3 py-2 text-sm leading-6 ${
          isUser ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700'
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <>
            <ResponsePanel answer={message.answer} />
            {message.filesUsed?.length ? (
              <p className="mt-3 border-t border-slate-200 pt-2 text-xs text-slate-500">
                {message.filesUsed.length} file context item(s)
              </p>
            ) : null}
          </>
        )}
      </div>
      {isUser ? (
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-slate-200 text-slate-700">
          <Icon size={16} aria-hidden="true" />
        </span>
      ) : null}
    </article>
  );
}

export function ChatPanel({ codebase, selectedFile, initialSession }) {
  const [task, setTask] = useState('file_explanation');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialSession) {
      setMessages(initialSession.messages || []);
      setActiveSessionId(initialSession._id);
    } else {
      setMessages([]);
      setActiveSessionId(null);
    }
  }, [initialSession]);

  const selectedFilePath = selectedFile?.path;
  const isSelectedFileTask =
    task === 'file_explanation' || task === 'test_generation' || task === 'bug_detection';
  const isHistoryOnly = codebase?.isHistoryOnly;
  const canAsk = question.trim() && (!isSelectedFileTask || selectedFilePath) && !isHistoryOnly;
  
  const helperText = useMemo(() => {
    if (isHistoryOnly) return 'Viewing past session history. Upload a codebase to ask new questions.';
    if (isSelectedFileTask) {
      return selectedFilePath ? `Focused on ${selectedFilePath}` : 'Select a file to ask about it.';
    }
    return `${codebase?.summary?.totalFiles || 0} files available for architecture context.`;
  }, [codebase, selectedFilePath, task, isHistoryOnly]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canAsk) {
      return;
    }

    const userMessage = {
      role: 'user',
      content: question.trim(),
    };

    setMessages((current) => [...current, { ...userMessage, id: crypto.randomUUID() }]);
    setQuestion('');
    setError('');
    setIsSubmitting(true);

    try {
      const token = getStoredAuth()?.tokens?.accessToken;

      if (!token) {
        throw new Error('Your session is missing an access token.');
      }

      let currentSessionId = activeSessionId;

      if (!currentSessionId) {
        const title = userMessage.content.slice(0, 40) + (userMessage.content.length > 40 ? '...' : '');
        const sessionRes = await createSession({ token, title });
        currentSessionId = sessionRes.session._id;
        setActiveSessionId(currentSessionId);
      }

      // Save user message to session
      await addMessageToSession({ token, sessionId: currentSessionId, message: userMessage });

      const response = await askCodebase({
        token,
        task,
        question: userMessage.content,
        codebase,
        selectedFilePath: isSelectedFileTask ? selectedFilePath : undefined,
      });

      const assistantMessage = {
        role: 'assistant',
        answer: response.answer,
        filesUsed: response.context?.filesUsed ?? [],
      };

      setMessages((current) => [
        ...current,
        { ...assistantMessage, id: crypto.randomUUID() },
      ]);

      // Save assistant message to session
      await addMessageToSession({ token, sessionId: currentSessionId, message: assistantMessage });

    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[540px] flex-col border-t border-slate-200 bg-slate-50 lg:min-h-0 lg:border-l lg:border-t-0">
      <header className="border-b border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-cyan-100 text-cyan-700">
            <Sparkles size={16} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-slate-950">Ask CodeLens</h2>
            <p className="text-xs text-slate-500">{helperText}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
          {TASK_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={isHistoryOnly}
              onClick={() => setTask(option.value)}
              className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                task === option.value
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-slate-950'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option.icon size={15} aria-hidden="true" />
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-3 sm:p-4">
        {messages.length ? (
          messages.map((message, index) => <MessageBubble key={message._id || index} message={message} />)
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
            Ask what a file does, where a behavior lives, or how the project is structured.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3 sm:p-4">
        {error ? (
          <p className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        <label className="block">
          <span className="sr-only">Question</span>
          <textarea
            value={question}
            disabled={isHistoryOnly}
            onChange={(event) => setQuestion(event.target.value)}
            rows={3}
            placeholder={isHistoryOnly ? "Cannot ask questions in history view." : "Ask about the selected file or architecture..."}
            className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:opacity-50 disabled:bg-slate-50"
          />
        </label>
        <button
          type="submit"
          disabled={!canAsk || isSubmitting || isHistoryOnly}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
          Ask
        </button>
      </form>
    </section>
  );
}
