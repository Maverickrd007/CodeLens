import { Edit2, MessageSquare, Trash2 } from 'lucide-react';
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
    return <div className="p-4 text-sm text-slate-500">Loading history...</div>;
  }

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 max-w-6xl mx-auto">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Sessions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="flex flex-col justify-between rounded-md border border-slate-200 p-4 transition hover:border-cyan-500"
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
                className="mb-2 w-full rounded border border-cyan-500 px-2 py-1 text-sm outline-none"
              />
            ) : (
              <button
                onClick={() => onSelectSession(session)}
                className="flex items-center gap-2 text-left font-medium text-slate-800 hover:text-cyan-700"
              >
                <MessageSquare size={16} className="text-slate-400" />
                <span className="truncate">{session.title}</span>
              </button>
            )}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingId(session._id);
                    setEditTitle(session.title);
                  }}
                  className="rounded p-1 transition hover:bg-slate-100 hover:text-slate-900"
                  title="Rename"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(session._id)}
                  className="rounded p-1 transition hover:bg-rose-100 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
