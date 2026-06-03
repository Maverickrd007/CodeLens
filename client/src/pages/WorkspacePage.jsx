import { useState } from 'react';

import { UploadPanel } from '../components/UploadPanel.jsx';

export function WorkspacePage() {
  const [codebase, setCodebase] = useState(null);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {codebase ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Loaded codebase</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {codebase.metadata?.repository ?? codebase.metadata?.archiveName ?? 'Local folder'}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {codebase.summary.totalFiles} files ready for exploration.
          </p>
          <button
            type="button"
            onClick={() => setCodebase(null)}
            className="mt-5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Choose another repository
          </button>
        </section>
      ) : (
        <UploadPanel onCodebaseReady={setCodebase} />
      )}
    </main>
  );
}
