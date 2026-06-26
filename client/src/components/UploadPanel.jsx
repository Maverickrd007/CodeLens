import { FolderUp, GitBranch, Loader2, UploadCloud, X, ArrowRight, Code2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ingestGithubCodebase, uploadCodebase } from '../services/api.js';
import { getStoredAuth } from '../services/authStorage.js';

function formatFileCount(files) {
  if (files.length === 0) return 'No folder files selected';
  return `${files.length} file${files.length === 1 ? '' : 's'} selected`;
}

function getZipFile(files) {
  return files.find((file) => file.name.toLowerCase().endsWith('.zip')) ?? null;
}

export function UploadPanel({ onCodebaseReady }) {
  const folderInputRef = useRef(null);
  const archiveInputRef = useRef(null);
  
  // 'none', 'github', 'folder', 'archive'
  const [activeAction, setActiveAction] = useState('none'); 
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [folderFiles, setFolderFiles] = useState([]);
  const [archive, setArchive] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  function resetLocalSelection() {
    setFolderFiles([]);
    setArchive(null);
    if (folderInputRef.current) folderInputRef.current.value = '';
    if (archiveInputRef.current) archiveInputRef.current.value = '';
    setActiveAction('none');
    setError('');
  }

  function handleFolderSelect(event) {
    setFolderFiles(Array.from(event.target.files ?? []));
    setActiveAction('folder');
  }

  function handleArchiveSelect(event) {
    setArchive(event.target.files?.[0] ?? null);
    setActiveAction('archive');
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files ?? []);
    const zipFile = getZipFile(files);

    if (zipFile) {
      setFolderFiles([]);
      setArchive(zipFile);
      setActiveAction('archive');
      return;
    }

    setArchive(null);
    setFolderFiles(files);
    setActiveAction('folder');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const token = getStoredAuth()?.tokens?.accessToken;
      if (!token) throw new Error('Your session is missing an access token.');

      const response =
        activeAction === 'github'
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
    (activeAction === 'github' && repositoryUrl.trim()) ||
    (activeAction === 'archive' && archive) ||
    (activeAction === 'folder' && folderFiles.length > 0);

  const actionCards = [
    {
      id: 'github',
      title: 'Connect GitHub',
      description: 'Import a public or private repository directly.',
      icon: Code2,
      accent: 'group-hover:text-blue-400',
      bgHover: 'hover:bg-blue-500/5 hover:border-blue-500/20',
      onClick: () => setActiveAction('github'),
    },
    {
      id: 'folder',
      title: 'Upload Folder',
      description: 'Analyze a local directory from your machine.',
      icon: FolderUp,
      accent: 'group-hover:text-cyan-400',
      bgHover: 'hover:bg-cyan-500/5 hover:border-cyan-500/20',
      onClick: () => {
        setActiveAction('folder');
        folderInputRef.current?.click();
      },
    },
    {
      id: 'archive',
      title: 'Upload ZIP',
      description: 'Upload a compressed codebase archive.',
      icon: UploadCloud,
      accent: 'group-hover:text-purple-400',
      bgHover: 'hover:bg-purple-500/5 hover:border-purple-500/20',
      onClick: () => {
        setActiveAction('archive');
        archiveInputRef.current?.click();
      },
    },
  ];

  return (
    <div className="w-full">
      
      {/* Action Cards Grid */}
      {activeAction === 'none' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actionCards.map((card) => (
            <button
              key={card.id}
              onClick={card.onClick}
              className={`group relative flex flex-col items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-5 text-left transition-all duration-300 ${card.bgHover}`}
            >
              <span className={`inline-flex rounded-lg border border-white/5 bg-[#0c0c0e] p-2 text-slate-400 transition-colors shadow-sm ${card.accent}`}>
                <card.icon size={20} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">{card.title}</h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Active Form Area */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/10 bg-[#0c0c0e] p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              {activeAction === 'github' && <><Code2 size={18} className="text-blue-400"/> Connect GitHub</>}
              {activeAction === 'folder' && <><FolderUp size={18} className="text-cyan-400"/> Upload Folder</>}
              {activeAction === 'archive' && <><UploadCloud size={18} className="text-purple-400"/> Upload ZIP</>}
            </h3>
            <button 
              onClick={resetLocalSelection}
              className="text-slate-400 hover:text-white transition rounded-md p-1 hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeAction === 'github' ? (
              <label className="block">
                <span className="text-[13px] font-medium text-slate-300">Repository URL</span>
                <input
                  autoFocus
                  value={repositoryUrl}
                  onChange={(event) => setRepositoryUrl(event.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="mt-2 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/[0.02] placeholder:text-slate-600"
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
                className={`rounded-lg border border-dashed p-8 text-center transition ${
                  isDragging ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/10 bg-black/20 hover:border-white/20'
                }`}
              >
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/5 mb-4">
                  <UploadCloud className="text-slate-400" size={24} aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  {activeAction === 'archive'
                    ? archive?.name || 'Drop your ZIP file here'
                    : formatFileCount(folderFiles)}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {activeAction === 'archive' ? (
                    <button
                      type="button"
                      onClick={() => archiveInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-md bg-white/[0.05] border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      Select ZIP
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => folderInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-md bg-white/[0.05] border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      Select Folder
                    </button>
                  )}
                </div>
              </div>
            )}

            {error ? (
              <p className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowRight size={16} />
                )}
                Analyze Repository
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Hidden Inputs */}
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
  );
}
