import { AlertTriangle, BookOpen, Bug, FlaskConical, GitFork, ShieldCheck } from 'lucide-react';

function TextList({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <ul className="mt-2 space-y-1 text-sm text-slate-300">
      {items.map((item) => (
        <li key={item} className="leading-6 flex items-start gap-2">
          <span className="mt-2 h-1 w-1 rounded-full bg-cyan-500/50 shrink-0"></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PanelSection({ title, children }) {
  if (!children) {
    return null;
  }

  return (
    <section className="border-t border-white/5 pt-3">
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{title}</h4>
      {children}
    </section>
  );
}

function DocsPanel({ answer }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen size={16} className="text-cyan-400" aria-hidden="true" />
        <p className="font-semibold text-white">
          {answer.kind === 'architecture_summary' ? 'Architecture Overview' : 'File Documentation'}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{answer.summary ?? answer.overview}</p>
      <PanelSection title="Responsibilities">
        <TextList items={answer.responsibilities ?? answer.dataFlow} />
      </PanelSection>
      {answer.layers?.length ? (
        <PanelSection title="Layers">
          <div className="mt-3 space-y-2">
            {answer.layers.map((layer) => (
              <div key={layer.name} className="rounded-lg border border-white/5 bg-black/20 p-3 backdrop-blur-sm">
                <p className="text-sm font-semibold text-cyan-100">{layer.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{layer.responsibility}</p>
              </div>
            ))}
          </div>
        </PanelSection>
      ) : null}
      {answer.importantFunctions?.length ? (
        <PanelSection title="Important functions">
          <div className="mt-3 space-y-2">
            {answer.importantFunctions.map((fn) => (
              <div key={fn.name} className="rounded-lg border border-white/5 bg-black/20 p-3 backdrop-blur-sm">
                <p className="text-sm font-semibold text-cyan-100 font-mono text-[13px]">{fn.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{fn.description}</p>
              </div>
            ))}
          </div>
        </PanelSection>
      ) : null}
    </div>
  );
}

function TestsPanel({ answer }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FlaskConical size={16} className="text-emerald-400" aria-hidden="true" />
        <p className="font-semibold text-white">Test Plan</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{answer.overview}</p>
      <PanelSection title="Framework">
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {answer.testFrameworkRecommendation}
        </p>
      </PanelSection>
      {answer.testCases?.length ? (
        <PanelSection title="Cases">
          <div className="mt-3 space-y-2">
            {answer.testCases.map((testCase) => (
              <div key={testCase.name} className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-3 backdrop-blur-sm">
                <p className="text-sm font-semibold text-emerald-100">{testCase.name}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-emerald-500/70">{testCase.type}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{testCase.description}</p>
              </div>
            ))}
          </div>
        </PanelSection>
      ) : null}
      {answer.generatedTestFiles?.length ? (
        <PanelSection title="Generated files">
          <div className="mt-3 space-y-2">
            {answer.generatedTestFiles.map((file) => (
              <details key={file.path} className="group rounded-lg border border-white/10 bg-[#0c0c0e] text-slate-100 overflow-hidden">
                <summary className="cursor-pointer bg-white/[0.02] px-4 py-2.5 text-sm font-semibold flex items-center hover:bg-white/[0.04] transition-colors">
                  <span className="font-mono text-[12px] text-emerald-400">{file.path}</span>
                </summary>
                <pre className="max-h-80 overflow-auto border-t border-white/5 p-4 text-[12px] leading-relaxed font-mono bg-[#050505] scrollbar-thin scrollbar-thumb-white/10">
                  <code className="text-slate-300">{file.content}</code>
                </pre>
              </details>
            ))}
          </div>
        </PanelSection>
      ) : null}
    </div>
  );
}

function BugsPanel({ answer }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bug size={16} className="text-rose-400" aria-hidden="true" />
        <p className="font-semibold text-white">Bug Findings</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{answer.summary}</p>
      {answer.findings?.length ? (
        <div className="space-y-3">
          {answer.findings.map((finding) => (
            <div
              key={`${finding.path}-${finding.title}`}
              className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-rose-100">{finding.title}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-rose-400/70">
                    {finding.severity} · <span className="font-mono normal-case">{finding.path}</span> · Lines {finding.lineEstimate}
                  </p>
                </div>
              </div>
              <div className="mt-3 pl-6 space-y-3">
                <p className="text-sm leading-relaxed text-slate-300">{finding.description}</p>
                <div className="rounded border border-amber-500/10 bg-amber-500/5 p-3">
                  <p className="text-[11px] font-semibold uppercase text-amber-500/70 mb-1">Recommendation</p>
                  <p className="text-sm leading-relaxed text-amber-100/90">{finding.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 backdrop-blur-sm">
          <ShieldCheck size={18} aria-hidden="true" />
          No concrete bug findings returned. Code looks solid!
        </div>
      )}
    </div>
  );
}

export function ResponsePanel({ answer }) {
  if (answer.kind === 'test_generation') {
    return <TestsPanel answer={answer} />;
  }

  if (answer.kind === 'bug_detection') {
    return <BugsPanel answer={answer} />;
  }

  return (
    <div className="space-y-4">
      {answer.kind === 'architecture_summary' ? (
        <div className="flex items-center gap-2 mb-2">
          <GitFork size={16} className="text-purple-400" aria-hidden="true" />
          <p className="font-semibold text-white">Architecture Review</p>
        </div>
      ) : null}
      <DocsPanel answer={answer} />
    </div>
  );
}
