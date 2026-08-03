import { Edit2, MessageSquare, Trash2, Clock, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { deleteSession, fetchSessions, updateSession } from '../services/api.js';
import { getStoredAuth } from '../services/authStorage.js';

export function SessionHistory({ onSelectSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const token = getStoredAuth()?.tokens?.accessToken;
      if (!token) return;
      const res = await fetchSessions({ token });
      setSessions(res.sessions || []);
    } catch (err) {
      console.error('Failed to load sessions', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      const token = getStoredAuth()?.tokens?.accessToken;
      await deleteSession({ token, sessionId: id });
      setSessions((current) => current.filter((s) => s._id !== id));
    } catch (err) {
      console.error('Failed to delete session', err);
    }
  }

  async function handleRenameSubmit(id) {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const token = getStoredAuth()?.tokens?.accessToken;
      await updateSession({ token, sessionId: id, title: editTitle });
      setSessions((current) =>
        current.map((s) => (s._id === id ? { ...s, title: editTitle } : s))
      );
    } catch (err) {
      console.error('Failed to rename session', err);
    } finally {
      setEditingId(null);
    }
  }

  if (loading) {
    return <div className="p-4 text-[13px] text-slate-500">Loading history...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-[#0c0c0e] p-5 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-white">Recent Sessions</h2>
        <p className="text-[13px] text-slate-500">No previous sessions found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#0c0c0e] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock size={14} className="text-slate-400" />
          Recent Sessions
        </h2>
        <button className="text-[11px] font-medium text-slate-400 hover:text-white transition">
          View All
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="group relative flex flex-col justify-between rounded-lg border border-transparent hover:border-white/10 hover:bg-white/[0.02] p-3 transition-colors"
          >
            {editingId === session._id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleRenameSubmit(session._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit(session._id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="mb-2 w-full rounded border border-white/30 bg-black/50 px-2 py-1 text-[13px] text-white outline-none"
              />
            ) : (
              <button
                onClick={() => onSelectSession(session)}
                className="flex items-start justify-between text-left font-medium text-slate-200 hover:text-white"
              >
                <div className="flex gap-2.5">
                  <MessageSquare size={14} className="text-slate-500 mt-0.5 shrink-0" />
                  <span className="truncate text-[13px] pr-8">{session.title}</span>
                </div>
              </button>
            )}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
              <span className="pl-6">{new Date(session.updatedAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingId(session._id);
                    setEditTitle(session.title);
                  }}
                  className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
                  title="Rename"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(session._id)}
                  className="rounded p-1 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
