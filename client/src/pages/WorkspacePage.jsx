import { useState } from 'react';

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
      // We don't have codebase saved, so just open the chat with the session history
      setCodebase({ summary: { totalFiles: 0 }, files: [], isHistoryOnly: true });
    } catch (err) {
      console.error('Failed to load session details', err);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {codebase ? (
        <section className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid lg:h-[calc(100vh-7rem)] lg:grid-cols-[300px_minmax(0,1fr)_380px]">
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
      ) : (
        <>
          <SessionHistory onSelectSession={handleSelectSession} />
          <UploadPanel onCodebaseReady={handleCodebaseReady} />
        </>
      )}
    </main>
  );
}
