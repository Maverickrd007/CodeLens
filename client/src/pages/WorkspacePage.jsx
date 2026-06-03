import { useState } from 'react';

import { ChatPanel } from '../components/ChatPanel.jsx';
import { FileExplorerSidebar } from '../components/FileExplorerSidebar.jsx';
import { FilePreview } from '../components/FilePreview.jsx';
import { UploadPanel } from '../components/UploadPanel.jsx';

export function WorkspacePage() {
  const [codebase, setCodebase] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  function handleCodebaseReady(nextCodebase) {
    setCodebase(nextCodebase);
    setSelectedFile(nextCodebase.files.find((file) => !file.isBinary) ?? null);
  }

  function resetCodebase() {
    setCodebase(null);
    setSelectedFile(null);
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
          <ChatPanel codebase={codebase} selectedFile={selectedFile} />
        </section>
      ) : (
        <UploadPanel onCodebaseReady={handleCodebaseReady} />
      )}
    </main>
  );
}
