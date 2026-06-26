import { useState, useEffect } from 'react';
import { User, Zap, Activity } from 'lucide-react';

import { ChatPanel } from '../components/ChatPanel.jsx';
import { FileExplorerSidebar } from '../components/FileExplorerSidebar.jsx';
import { FilePreview } from '../components/FilePreview.jsx';
import { SessionHistory } from '../components/SessionHistory.jsx';
import { UploadPanel } from '../components/UploadPanel.jsx';
import { fetchSession } from '../services/api.js';
import { getStoredAuth } from '../services/authStorage.js';

export function WorkspacePage() {
  const [codebase, setCodebase] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth?.user?.name) {
      setUserName(auth.user.name.split(' ')[0]);
    }
  }, []);

  function handleCodebaseReady(nextCodebase) {
    setCodebase(nextCodebase);
    setSelectedFile(nextCodebase.files.find((file) => !file.isBinary) ?? null);
  }

  function resetCodebase() {
    setCodebase(null);
    setSelectedFile(null);
    setActiveSession(null);
  }

  async function handleSelectSession(session) {
    try {
      const token = getStoredAuth()?.tokens?.accessToken;
      const res = await fetchSession({ token, sessionId: session._id });
      setActiveSession(res.session);
      setCodebase({ summary: { totalFiles: 0 }, files: [], isHistoryOnly: true });
    } catch (err) {
      console.error('Failed to load session details', err);
    }
  }

  if (codebase) {
    return (
      <main className="min-h-screen bg-[#09090b] text-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <section className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0c0c0e] shadow-sm lg:grid lg:h-[calc(100vh-7rem)] lg:grid-cols-[300px_minmax(0,1fr)_380px]">
            <FileExplorerSidebar
              codebase={codebase}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
              onResetCodebase={resetCodebase}
            />
            <FilePreview file={selectedFile} />
            <ChatPanel 
              codebase={codebase} 
              selectedFile={selectedFile} 
              initialSession={activeSession} 
            />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-200 selection:bg-slate-700/50">
      
      {/* Top Navigation / Header */}
      <header className="border-b border-white/5 bg-[#0c0c0e]/50 backdrop-blur-md px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-white text-black grid place-items-center font-bold text-xs">C</div>
              <span className="text-sm font-medium text-slate-200">CodeLens</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-[13px] font-medium text-slate-400">Personal Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-slate-400 sm:flex">
              <Activity size={12} className="text-cyan-500" />
              <span>Usage: 2/100 API Calls</span>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-slate-400 sm:flex">
              <Zap size={12} className="text-amber-500" />
              <span>Free Plan</span>
            </div>
            <button className="flex items-center justify-center size-8 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition">
              <User size={14} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {userName ? `Welcome back, ${userName}.` : 'Welcome back.'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">Select a project to start analyzing your codebase.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main Content Area (Upload Panel) */}
          <div className="space-y-8">
            <UploadPanel onCodebaseReady={handleCodebaseReady} />
          </div>

          {/* Right Sidebar (History & Stats) */}
          <div className="space-y-6">
            <SessionHistory onSelectSession={handleSelectSession} />
          </div>
        </div>
      </div>
    </main>
  );
}
