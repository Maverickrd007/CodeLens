import { useState, useEffect } from 'react';
import { User, Zap, Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ChatPanel } from '../components/ChatPanel.jsx';
import { FileExplorerSidebar } from '../components/FileExplorerSidebar.jsx';
import { FilePreview } from '../components/FilePreview.jsx';
import { InteractiveMesh } from '../components/InteractiveMesh.jsx';
import { SessionHistory } from '../components/SessionHistory.jsx';
import { UploadPanel } from '../components/UploadPanel.jsx';
import { fetchSession } from '../services/api.js';
import { getStoredAuth, clearStoredAuth } from '../services/authStorage.js';

export function WorkspacePage() {
  const [codebase, setCodebase] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth?.user?.name) {
      setUserName(auth.user.name.split(' ')[0]);
    }
  }, []);

  function handleLogout() {
    clearStoredAuth();
    navigate('/login', { replace: true });
  }

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
      <main className="relative min-h-screen bg-transparent text-slate-200">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <section className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl lg:grid lg:h-[calc(100vh-7rem)] lg:grid-cols-[300px_minmax(0,1fr)_380px]">
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
    <main className="relative min-h-screen bg-transparent text-slate-200 selection:bg-cyan-500/30 overflow-hidden font-sans">
      
      {/* Top Navigation / Header */}
      <header className="relative z-20 border-b border-white/5 bg-[#0c0c0e]/60 backdrop-blur-2xl px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="CodeLens Logo" className="w-8 h-8 rounded-lg shadow-lg" />
              <span className="text-base font-bold text-white tracking-tight">CodeLens</span>
            </div>
            <div className="h-5 w-px bg-white/10"></div>
            <span className="text-[13px] font-medium text-slate-400">Personal Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-300 sm:flex backdrop-blur-md shadow-sm">
              <Activity size={14} className="text-cyan-400" />
              <span>Usage: 2/100 API Calls</span>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-300 sm:flex backdrop-blur-md shadow-sm">
              <Zap size={14} className="text-amber-400" />
              <span>Free Plan</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition shadow-sm"
              title="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Greeting */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-white"
          >
            {userName ? `Welcome back, ${userName}.` : 'Welcome back.'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-base text-slate-400"
          >
            Select a project to start analyzing your codebase.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]"
        >
          {/* Main Content Area (Upload Panel) */}
          <div className="space-y-8">
            <UploadPanel onCodebaseReady={handleCodebaseReady} />
          </div>

          {/* Right Sidebar (History & Stats) */}
          <div className="space-y-6">
            <SessionHistory onSelectSession={handleSelectSession} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
