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
    <article className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : ''}`}>
      {!isUser ? (
        <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
          <Icon size={16} aria-hidden="true" />
        </span>
      ) : null}
      <div
        className={`max-w-[min(88%,42rem)] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
          isUser 
            ? 'bg-white/10 text-white rounded-tr-sm backdrop-blur-md border border-white/5' 
            : 'bg-black/40 text-slate-200 rounded-tl-sm backdrop-blur-md border border-white/5'
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <>
            <ResponsePanel answer={message.answer} />
            {message.filesUsed?.length ? (
              <p className="mt-4 border-t border-white/10 pt-3 text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                <BookOpen size={12} className="text-cyan-500" />
                {message.filesUsed.length} file context item(s)
              </p>
            ) : null}
          </>
        )}
      </div>
      {isUser ? (
        <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-slate-800 text-slate-300 border border-white/10">
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
    <section className="flex min-h-[540px] flex-col border-t border-white/5 bg-transparent lg:min-h-0 lg:border-t-0 relative">
      <header className="border-b border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="CodeLens Logo" className="w-9 h-9 rounded-xl shadow-lg" />
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Ask CodeLens</h2>
            <p className="text-[11px] font-medium text-slate-400">{helperText}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {TASK_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={isHistoryOnly}
              onClick={() => setTask(option.value)}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all duration-300 ${
                task === option.value
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <option.icon size={14} aria-hidden="true" />
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.length ? (
          messages.map((message, index) => <MessageBubble key={message._id || index} message={message} />)
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 grid size-12 place-items-center rounded-full bg-white/5 border border-white/10 text-slate-500">
              <Bot size={24} />
            </div>
            <p className="text-sm font-medium text-slate-300">How can I help you today?</p>
            <p className="mt-1 max-w-xs text-xs text-slate-500">Ask what a file does, where a behavior lives, or how the project is structured.</p>
          </div>
        )}
      </div>

      <div className="bg-transparent p-4">
        <form onSubmit={handleSubmit} className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-2 shadow-2xl focus-within:border-cyan-500/50 focus-within:bg-black/60 transition-colors">
          {error ? (
            <p className="absolute -top-12 left-0 right-0 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-[12px] text-red-200 backdrop-blur-md">
              {error}
            </p>
          ) : null}
          <label className="block">
            <span className="sr-only">Question</span>
            <textarea
              value={question}
              disabled={isHistoryOnly}
              onChange={(event) => setQuestion(event.target.value)}
              rows={2}
              placeholder={isHistoryOnly ? "Cannot ask questions in history view." : "Message CodeLens..."}
              className="w-full resize-none border-0 bg-transparent px-3 py-2 text-[14px] text-slate-200 placeholder:text-slate-500 outline-none focus:ring-0 disabled:opacity-50 scrollbar-thin scrollbar-thumb-white/10"
            />
          </label>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!canAsk || isSubmitting || isHistoryOnly}
              className="inline-flex size-9 items-center justify-center rounded-xl bg-cyan-500 text-white transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
