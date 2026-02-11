import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { FiFolder, FiFile, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { useEditorStore } from '../../store/editorStore';
import './FileExplorer.css';

interface FileEntry {
    name: string;
    path: string;
    is_dir: boolean;
    children?: FileEntry[];
}

export function FileExplorer() {
    const [rootPath, setRootPath] = useState<string | null>(null);
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const { openTab } = useEditorStore();

    const handleOpenFolder = async () => {
        setLoading(true);
        try {
            const path = await invoke<string | null>('open_folder_dialog', {});
            if (path) {
                setRootPath(path);
                const entries = await invoke<FileEntry[]>('read_dir_recursive', { path, maxDepth: 3 });
                setFiles(entries);
                setExpandedFolders(new Set()); // Reset expanded state
            }
        } catch (error) {
            console.error('Failed to open folder:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFolder = (path: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    };

    const handleFileClick = async (file: FileEntry) => {
        if (file.is_dir) {
            toggleFolder(file.path);
        } else {
            // Open file in editor
            try {
                const content = await invoke<string>('read_file', { path: file.path });
                const language = getLanguageFromExtension(file.name);

                openTab({
                    fileName: file.name,
                    filePath: file.path,
                    content,
                    language,
                });
            } catch (error) {
                console.error('Failed to open file:', error);
            }
        }
    };

    const getLanguageFromExtension = (fileName: string): string => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'c':
            case 'h':
                return 'c';
            case 'cpp':
            case 'hpp':
            case 'cc':
            case 'cxx':
                return 'cpp';
            case 'js':
            case 'jsx':
                return 'javascript';
            case 'ts':
            case 'tsx':
                return 'typescript';
            case 'json':
                return 'json';
            case 'md':
                return 'markdown';
            default:
                return 'plaintext';
        }
    };

    const renderFileTree = (entries: FileEntry[], depth = 0) => {
        return entries.map((entry) => {
            const isExpanded = expandedFolders.has(entry.path);
            const hasChildren = entry.children && entry.children.length > 0;

            return (
                <div key={entry.path} className="file-tree-item">
                    <div
                        className={`file-item ${entry.is_dir ? 'folder' : 'file'}`}
                        style={{ paddingLeft: `${depth * 16 + 8}px` }}
                        onClick={() => handleFileClick(entry)}
                    >
                        {entry.is_dir && (
                            <span className="folder-chevron">
                                {hasChildren && (isExpanded ? <FiChevronDown /> : <FiChevronRight />)}
                            </span>
                        )}
                        <span className="file-icon">
                            {entry.is_dir ? <FiFolder /> : <FiFile />}
                        </span>
                        <span className="file-name">{entry.name}</span>
                    </div>
                    {entry.is_dir && isExpanded && entry.children && (
                        <div className="file-children">
                            {renderFileTree(entry.children, depth + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="file-explorer">
            <div className="explorer-header">
                <h3>Explorer</h3>
                <button onClick={handleOpenFolder} disabled={loading} className="open-folder-btn">
                    {loading ? 'Loading...' : 'Open Folder'}
                </button>
            </div>
            <div className="explorer-content">
                {rootPath ? (
                    <div className="file-tree">
                        <div className="root-path">{rootPath}</div>
                        {renderFileTree(files)}
                    </div>
                ) : (
                    <div className="explorer-empty">
                        <p>No folder opened</p>
                        <p className="hint">Click "Open Folder" to start</p>
                    </div>
                )}
            </div>
        </div>
    );
}
