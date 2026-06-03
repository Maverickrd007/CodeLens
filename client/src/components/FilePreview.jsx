import { FileCode2 } from 'lucide-react';

export function FilePreview({ file }) {
  if (!file) {
    return (
      <section className="grid min-h-72 place-items-center bg-white lg:min-h-0">
        <div className="text-center">
          <FileCode2 className="mx-auto text-slate-300" size={42} aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-slate-700">Select a file</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[420px] flex-col bg-white lg:min-h-0">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-950">{file.path}</h2>
          <p className="text-xs text-slate-500">
            {file.language ?? 'Unknown'} · {file.size} bytes
          </p>
        </div>
      </header>
      <pre className="min-h-0 flex-1 overflow-auto bg-slate-950 p-4 text-xs leading-5 text-slate-100">
        <code>{file.content}</code>
      </pre>
    </section>
  );
}
