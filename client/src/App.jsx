import { Navigate, Route, Routes } from 'react-router-dom';

function ShellPlaceholder({ title }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-50">
      <section className="w-full max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">CodeLens</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Frontend routing is ready. Feature screens will land in the next commits.
        </p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<ShellPlaceholder title="Login" />} />
      <Route path="/register" element={<ShellPlaceholder title="Register" />} />
      <Route path="/dashboard" element={<ShellPlaceholder title="Workspace" />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
