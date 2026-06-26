import { FileCode2, Code2 } from 'lucide-react';

export function FilePreview({ file }) {
  if (!file) {
    return (
      <section className="grid min-h-72 place-items-center bg-black/20 lg:min-h-0 border-r border-white/5">
        <div className="text-center flex flex-col items-center">
          <div className="grid w-16 h-16 place-items-center rounded-2xl bg-white/5 border border-white/10 shadow-lg mb-4">
            <Code2 className="text-slate-400" size={28} aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-slate-300">No file selected</p>
          <p className="mt-1 text-xs text-slate-500">Select a file from the explorer to view its contents.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[420px] flex-col bg-[#09090b] lg:min-h-0 border-r border-white/5 relative">
      <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 backdrop-blur-md">
        <div className="min-w-0 flex items-center gap-3">
          <FileCode2 size={16} className="text-cyan-500" />
          <div>
            <h2 className="truncate text-[13px] font-medium text-slate-200">{file.path}</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {file.language ?? 'Unknown'} <span className="mx-1 opacity-50">•</span> {file.size} bytes
            </p>
          </div>
        </div>
      </header>
      
      {/* Code Area */}
      <div className="relative min-h-0 flex-1 overflow-auto bg-black/40">
        <div className="absolute left-0 top-0 bottom-0 w-10 border-r border-white/5 bg-[#0c0c0e] z-0"></div>
        <pre className="relative z-10 min-h-full p-4 pl-14 text-[13px] leading-6 text-slate-300 font-mono scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <code>{file.content}</code>
        </pre>
      </div>
    </section>
  );
}
