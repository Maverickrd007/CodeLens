import { FolderUp, GitBranch, Loader2, UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { ingestGithubCodebase, uploadCodebase } from '../services/api.js';
import { getStoredAuth } from '../services/authStorage.js';

function formatFileCount(files) {
  if (files.length === 0) {
    return 'No folder files selected';
  }

  return `${files.length} file${files.length === 1 ? '' : 's'} selected`;
}

function getZipFile(files) {
  return files.find((file) => file.name.toLowerCase().endsWith('.zip')) ?? null;
}

export function UploadPanel({ onCodebaseReady }) {
  const folderInputRef = useRef(null);
  const archiveInputRef = useRef(null);
  const [mode, setMode] = useState('github');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [folderFiles, setFolderFiles] = useState([]);
  const [archive, setArchive] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  function resetLocalSelection() {
    setFolderFiles([]);
    setArchive(null);

    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }

    if (archiveInputRef.current) {
      archiveInputRef.current.value = '';
    }
  }

  function handleFolderSelect(event) {
    setMode('folder');
    setArchive(null);
    setFolderFiles(Array.from(event.target.files ?? []));
  }

  function handleArchiveSelect(event) {
    setMode('archive');
    setFolderFiles([]);
    setArchive(event.target.files?.[0] ?? null);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files ?? []);
    const zipFile = getZipFile(files);

    if (zipFile) {
      setMode('archive');
      setFolderFiles([]);
      setArchive(zipFile);
      return;
    }

    setMode('folder');
    setArchive(null);
    setFolderFiles(files);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const token = getStoredAuth()?.tokens?.accessToken;

      if (!token) {
        throw new Error('Your session is missing an access token.');
      }

      const response =
        mode === 'github'
          ? await ingestGithubCodebase({ token, repositoryUrl })
          : await uploadCodebase({ token, archive, files: folderFiles });

      onCodebaseReady(response.codebase);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    (mode === 'github' && repositoryUrl.trim()) ||
    (mode === 'archive' && archive) ||
    (mode === 'folder' && folderFiles.length > 0);

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          {[
            { value: 'github', label: 'GitHub', icon: GitBranch },
            { value: 'archive', label: 'Zip', icon: UploadCloud },
            { value: 'folder', label: 'Folder', icon: FolderUp },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setMode(item.value);
                  setError('');
                }}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {mode === 'github' ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">GitHub repository URL</span>
              <input
                value={repositoryUrl}
                onChange={(event) => setRepositoryUrl(event.target.value)}
                placeholder="https://github.com/owner/repo"
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`rounded-lg border border-dashed p-6 text-center transition ${
                isDragging ? 'border-cyan-400 bg-cyan-50' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <UploadCloud className="mx-auto text-slate-500" size={32} aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-800">
                {mode === 'archive'
                  ? archive?.name || 'Drop a zip archive'
                  : formatFileCount(folderFiles)}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {mode === 'archive' ? (
                  <button
                    type="button"
                    onClick={() => archiveInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <UploadCloud size={16} aria-hidden="true" />
                    Select zip
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <FolderUp size={16} aria-hidden="true" />
                    Select folder
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetLocalSelection}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
                >
                  <X size={16} aria-hidden="true" />
                  Clear
                </button>
              </div>
              <input
                ref={archiveInputRef}
                type="file"
                accept=".zip"
                className="hidden"
                onChange={handleArchiveSelect}
              />
              <input
                ref={folderInputRef}
                type="file"
                multiple
                webkitdirectory=""
                directory=""
                className="hidden"
                onChange={handleFolderSelect}
              />
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <UploadCloud size={17} />
          )}
          Analyze repository
        </button>
      </form>

      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Ingestion limits</p>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="text-slate-500">Upload formats</dt>
            <dd className="font-medium text-slate-900">GitHub URL, zip, or folder files</dd>
          </div>
          <div>
            <dt className="text-slate-500">Source filtering</dt>
            <dd className="font-medium text-slate-900">Code and config files only</dd>
          </div>
          <div>
            <dt className="text-slate-500">Ignored folders</dt>
            <dd className="font-medium text-slate-900">node_modules, dist, build, .git</dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
