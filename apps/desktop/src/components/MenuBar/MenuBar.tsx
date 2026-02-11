import { useState, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useEditorStore } from '../../store/editorStore';
import './MenuBar.css';

type MenuType = 'file' | 'edit' | 'view' | null;

export function MenuBar() {
    const [activeMenu, setActiveMenu] = useState<MenuType>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { openTab, getActiveTab, tabs } = useEditorStore();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (menu: MenuType) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const closeMenu = () => setActiveMenu(null);

    // File menu handlers
    const handleNewFile = () => {
        openTab({
            fileName: 'untitled.c',
            filePath: '/untitled.c',
            content: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
            language: 'c',
        });
        closeMenu();
    };

    const handleOpenFile = async () => {
        try {
            const path = await invoke<string | null>('open_file_dialog', {});
            if (path) {
                const content = await invoke<string>('read_file', { path });
                const fileName = path.split(/[\\/]/).pop() || 'untitled';
                const ext = fileName.split('.').pop()?.toLowerCase();
                const language = ext === 'cpp' || ext === 'hpp' ? 'cpp' : 'c';

                openTab({
                    fileName,
                    filePath: path,
                    content,
                    language,
                });
            }
        } catch (error) {
            console.error('Failed to open file:', error);
        }
        closeMenu();
    };

    const handleSave = async () => {
        const activeTab = getActiveTab();
        if (!activeTab) return;

        try {
            await invoke('write_file', {
                path: activeTab.filePath,
                content: activeTab.content,
            });
            console.log('File saved:', activeTab.filePath);
        } catch (error) {
            console.error('Failed to save file:', error);
        }
        closeMenu();
    };

    const handleSaveAs = async () => {
        const activeTab = getActiveTab();
        if (!activeTab) return;

        try {
            const path = await invoke<string | null>('save_file_dialog', {
                defaultName: activeTab.fileName,
            });

            if (path) {
                await invoke('write_file', {
                    path,
                    content: activeTab.content,
                });
                console.log('File saved as:', path);
            }
        } catch (error) {
            console.error('Failed to save file:', error);
        }
        closeMenu();
    };

    // Edit menu handlers
    const handleUndo = () => {
        // Monaco handles this internally with Ctrl+Z
        console.log('Undo');
        closeMenu();
    };

    const handleRedo = () => {
        // Monaco handles this internally with Ctrl+Y
        console.log('Redo');
        closeMenu();
    };

    return (
        <div className="menu-bar" ref={menuRef}>
            <div className="menu-items">
                <span className="app-logo">IDE-C</span>

                <div className="menu-section">
                    <button
                        className={`menu-button ${activeMenu === 'file' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('file')}
                    >
                        File
                    </button>
                    {activeMenu === 'file' && (
                        <div className="menu-dropdown">
                            <div className="menu-item" onClick={handleNewFile}>
                                <span>New File</span>
                                <span className="shortcut">Ctrl+N</span>
                            </div>
                            <div className="menu-item" onClick={handleOpenFile}>
                                <span>Open File</span>
                                <span className="shortcut">Ctrl+O</span>
                            </div>
                            <div className="menu-divider" />
                            <div className="menu-item" onClick={handleSave} data-disabled={!getActiveTab()} aria-disabled={!getActiveTab()}>
                                <span>Save</span>
                                <span className="shortcut">Ctrl+S</span>
                            </div>
                            <div className="menu-item" onClick={handleSaveAs} data-disabled={!getActiveTab()} aria-disabled={!getActiveTab()}>
                                <span>Save As...</span>
                                <span className="shortcut">Ctrl+Shift+S</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="menu-section">
                    <button
                        className={`menu-button ${activeMenu === 'edit' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('edit')}
                    >
                        Edit
                    </button>
                    {activeMenu === 'edit' && (
                        <div className="menu-dropdown">
                            <div className="menu-item" onClick={handleUndo}>
                                <span>Undo</span>
                                <span className="shortcut">Ctrl+Z</span>
                            </div>
                            <div className="menu-item" onClick={handleRedo}>
                                <span>Redo</span>
                                <span className="shortcut">Ctrl+Y</span>
                            </div>
                            <div className="menu-divider" />
                            <div className="menu-item">
                                <span>Cut</span>
                                <span className="shortcut">Ctrl+X</span>
                            </div>
                            <div className="menu-item">
                                <span>Copy</span>
                                <span className="shortcut">Ctrl+C</span>
                            </div>
                            <div className="menu-item">
                                <span>Paste</span>
                                <span className="shortcut">Ctrl+V</span>
                            </div>
                            <div className="menu-divider" />
                            <div className="menu-item">
                                <span>Find</span>
                                <span className="shortcut">Ctrl+F</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="menu-section">
                    <button
                        className={`menu-button ${activeMenu === 'view' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('view')}
                    >
                        View
                    </button>
                    {activeMenu === 'view' && (
                        <div className="menu-dropdown">
                            <div className="menu-item">
                                <span>Toggle Sidebar</span>
                                <span className="shortcut">Ctrl+B</span>
                            </div>
                            <div className="menu-item">
                                <span>Toggle Bottom Panel</span>
                                <span className="shortcut">Ctrl+J</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="menu-right">
                <span className="file-count">{tabs.length} file{tabs.length !== 1 ? 's' : ''} open</span>
            </div>
        </div>
    );
}
