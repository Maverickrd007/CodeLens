import { LogOut, SearchCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { clearStoredAuth, getStoredAuth } from '../services/authStorage.js';

export function AppShell({ children }) {
  const navigate = useNavigate();
  const auth = getStoredAuth();

  function handleLogout() {
    clearStoredAuth();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-slate-950 text-cyan-300">
              <SearchCode size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-5">CodeLens</p>
              <p className="text-xs leading-4 text-slate-500">Codebase assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden max-w-48 truncate text-sm text-slate-600 sm:block">
              {auth?.user?.email}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
