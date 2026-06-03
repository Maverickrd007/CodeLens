import { ChevronRight, FileCode2, Folder, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

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
        className={`group flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition ${
          isSelected
            ? 'bg-slate-950 text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
        }`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isDirectory ? (
          <>
            <ChevronRight
              size={14}
              className={`shrink-0 transition ${isOpen ? 'rotate-90' : ''}`}
              aria-hidden="true"
            />
            <Folder size={15} className="shrink-0" aria-hidden="true" />
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            <FileCode2 size={15} className="shrink-0" aria-hidden="true" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {isDirectory && isOpen && node.children?.length ? (
        <ul className="mt-1 space-y-1">
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
    <aside className="flex max-h-80 min-h-0 flex-col border-b border-slate-200 bg-white lg:max-h-none lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {codebase.metadata?.repository ?? codebase.metadata?.archiveName ?? 'Local codebase'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {codebase.summary.totalFiles} files · {codebase.summary.textFiles} text
            </p>
          </div>
          <button
            type="button"
            onClick={onResetCodebase}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:text-slate-950"
            title="Choose another repository"
            aria-label="Choose another repository"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
        <label className="mt-4 flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2">
          <Search size={15} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Filter files"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <ul className="space-y-1">
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
      <div className="border-t border-slate-200 p-4">
        <p className="text-xs font-medium uppercase text-slate-500">Top languages</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {languageEntries.length ? (
            languageEntries.map(([language, count]) => (
              <span
                key={language}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
              >
                {language} · {count}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">Unknown</span>
          )}
        </div>
      </div>
    </aside>
  );
}
