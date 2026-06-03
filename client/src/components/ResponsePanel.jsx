import { AlertTriangle, BookOpen, Bug, FlaskConical, GitFork, ShieldCheck } from 'lucide-react';

function TextList({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <ul className="mt-2 space-y-1 text-sm text-slate-700">
      {items.map((item) => (
        <li key={item} className="leading-6">
          {item}
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
    <section className="border-t border-slate-200 pt-3">
      <h4 className="text-xs font-semibold uppercase text-slate-500">{title}</h4>
      {children}
    </section>
  );
}

function DocsPanel({ answer }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen size={16} className="text-cyan-700" aria-hidden="true" />
        <p className="font-semibold text-slate-950">
          {answer.kind === 'architecture_summary' ? 'Architecture docs' : 'File docs'}
        </p>
      </div>
      <p className="text-sm leading-6 text-slate-700">{answer.summary ?? answer.overview}</p>
      <PanelSection title="Responsibilities">
        <TextList items={answer.responsibilities ?? answer.dataFlow} />
      </PanelSection>
      {answer.layers?.length ? (
        <PanelSection title="Layers">
          <div className="mt-2 space-y-2">
            {answer.layers.map((layer) => (
              <div key={layer.name} className="rounded-md bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{layer.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{layer.responsibility}</p>
              </div>
            ))}
          </div>
        </PanelSection>
      ) : null}
      {answer.importantFunctions?.length ? (
        <PanelSection title="Important functions">
          <div className="mt-2 space-y-2">
            {answer.importantFunctions.map((fn) => (
              <div key={fn.name} className="rounded-md bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{fn.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{fn.description}</p>
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FlaskConical size={16} className="text-cyan-700" aria-hidden="true" />
        <p className="font-semibold text-slate-950">Test plan</p>
      </div>
      <p className="text-sm leading-6 text-slate-700">{answer.overview}</p>
      <PanelSection title="Framework">
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {answer.testFrameworkRecommendation}
        </p>
      </PanelSection>
      {answer.testCases?.length ? (
        <PanelSection title="Cases">
          <div className="mt-2 space-y-2">
            {answer.testCases.map((testCase) => (
              <div key={testCase.name} className="rounded-md bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{testCase.name}</p>
                <p className="mt-1 text-xs font-medium uppercase text-slate-500">{testCase.type}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{testCase.description}</p>
              </div>
            ))}
          </div>
        </PanelSection>
      ) : null}
      {answer.generatedTestFiles?.length ? (
        <PanelSection title="Generated files">
          <div className="mt-2 space-y-2">
            {answer.generatedTestFiles.map((file) => (
              <details key={file.path} className="rounded-md bg-slate-950 text-slate-100">
                <summary className="cursor-pointer px-3 py-2 text-sm font-semibold">
                  {file.path}
                </summary>
                <pre className="max-h-72 overflow-auto border-t border-slate-800 p-3 text-xs leading-5">
                  <code>{file.content}</code>
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Bug size={16} className="text-rose-700" aria-hidden="true" />
        <p className="font-semibold text-slate-950">Bug findings</p>
      </div>
      <p className="text-sm leading-6 text-slate-700">{answer.summary}</p>
      {answer.findings?.length ? (
        <div className="space-y-2">
          {answer.findings.map((finding) => (
            <div
              key={`${finding.path}-${finding.title}`}
              className="rounded-md border border-slate-200 p-3"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-600" aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-950">{finding.title}</p>
              </div>
              <p className="mt-1 text-xs font-medium uppercase text-slate-500">
                {finding.severity} · {finding.path} · {finding.lineEstimate}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{finding.description}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{finding.recommendation}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <ShieldCheck size={16} aria-hidden="true" />
          No concrete bug findings returned.
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
    <div className="space-y-3">
      {answer.kind === 'architecture_summary' ? (
        <div className="flex items-center gap-2">
          <GitFork size={16} className="text-cyan-700" aria-hidden="true" />
          <p className="font-semibold text-slate-950">Architecture</p>
        </div>
      ) : null}
      <DocsPanel answer={answer} />
    </div>
  );
}
