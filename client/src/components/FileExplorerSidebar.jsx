import { ChevronRight, FileCode2, Folder, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

function getFileByPath(files, filePath) {
  return files.find((file) => file.path === filePath);
}

function TreeNode({ node, depth, files, selectedPath, onSelectFile, searchTerm }) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isDirectory = node.type === 'directory';
  const isSelected = node.path === selectedPath;
  const file = isDirectory ? null : getFileByPath(files, node.path);

  if (searchTerm && !isDirectory && !node.path.toLowerCase().includes(searchTerm)) {
    return null;
  }

  if (searchTerm && isDirectory) {
    const hasMatchingChild = node.children?.some((child) =>
      child.type === 'directory'
        ? JSON.stringify(child).toLowerCase().includes(searchTerm)
        : child.path.toLowerCase().includes(searchTerm)
    );

    if (!hasMatchingChild) {
      return null;
    }
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          if (isDirectory) {
            setIsOpen((value) => !value);
          } else if (file) {
            onSelectFile(file);
          }
        }}
        className={`group flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] transition-all duration-200 ${
          isSelected
            ? 'bg-white/10 text-white font-medium border border-white/20'
            : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent'
        }`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isDirectory ? (
          <>
            <ChevronRight
              size={14}
              className={`shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''} ${isSelected ? 'text-white' : 'text-slate-500'}`}
              aria-hidden="true"
            />
            <Folder size={15} className={`shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} aria-hidden="true" />
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            <FileCode2 size={15} className={`shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} aria-hidden="true" />
          </>
        )}
        <span className="truncate tracking-tight">{node.name}</span>
      </button>
      {isDirectory && isOpen && node.children?.length ? (
        <ul className="mt-1 space-y-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.path || child.name}
              node={child}
              depth={depth + 1}
              files={files}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
              searchTerm={searchTerm}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileExplorerSidebar({ codebase, selectedFile, onSelectFile, onResetCodebase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const languageEntries = useMemo(
    () =>
      Object.entries(codebase.summary.languages ?? {})
        .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
        .slice(0, 5),
    [codebase.summary.languages]
  );

  return (
    <aside className="flex max-h-80 min-h-0 flex-col border-b border-white/5 bg-transparent lg:max-h-none lg:border-b-0 lg:border-r">
      <div className="border-b border-white/5 p-4 bg-white/[0.02]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-200">
              {codebase.metadata?.repository ?? codebase.metadata?.archiveName ?? 'Local codebase'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {codebase.summary.totalFiles} files · {codebase.summary.textFiles} text
            </p>
          </div>
          <button
            type="button"
            onClick={onResetCodebase}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
            title="Choose another repository"
            aria-label="Choose another repository"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
        <label className="mt-4 flex h-9 items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 transition-colors focus-within:border-white/30 focus-within:bg-black/60 shadow-inner">
          <Search size={14} className="shrink-0 text-slate-500" aria-hidden="true" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search files..."
            className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-slate-200 outline-none placeholder:text-slate-600"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <ul className="space-y-0.5">
          {codebase.tree.children?.map((child) => (
            <TreeNode
              key={child.path || child.name}
              node={child}
              depth={0}
              files={codebase.files}
              selectedPath={selectedFile?.path}
              onSelectFile={onSelectFile}
              searchTerm={normalizedSearch}
            />
          ))}
        </ul>
      </div>
      <div className="border-t border-white/5 p-4 bg-white/[0.01]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Top languages</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {languageEntries.length ? (
            languageEntries.map(([language, count]) => (
              <span
                key={language}
                className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-300"
              >
                {language} · {count}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-slate-500">Unknown</span>
          )}
        </div>
      </div>
    </aside>
  );
}
