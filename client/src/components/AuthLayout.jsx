import { SearchCode } from 'lucide-react';

export function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-md bg-slate-950 text-cyan-300">
              <SearchCode size={23} aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-semibold">CodeLens</p>
              <p className="text-sm text-slate-500">AI-powered codebase assistant</p>
            </div>
          </div>
          <h1 className="mt-10 max-w-2xl text-5xl font-semibold leading-tight tracking-tight text-slate-950">
            Understand unfamiliar code without losing the thread.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
            Upload a repository, inspect its files, and ask targeted questions about architecture,
            tests, docs, and likely defects.
          </p>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {['Explain files', 'Map architecture', 'Draft tests'].map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm font-medium text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-md bg-slate-950 text-cyan-300">
              <SearchCode size={21} aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold">CodeLens</p>
              <p className="text-xs text-slate-500">Codebase assistant</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
