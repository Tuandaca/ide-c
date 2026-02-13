import { FileExplorer } from '../FileExplorer/FileExplorer';
import { MenuBar } from '../MenuBar/MenuBar';
import { EditorTabs } from '../EditorTabs';
import { CodeEditor } from '../CodeEditor';
import './Layout.css';

import { TerminalPanel } from '../TerminalPanel/TerminalPanel';

interface LayoutProps {
    children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="ide-layout">
            <MenuBar />

            <div className="layout-body">
                <aside className="sidebar">
                    <FileExplorer />
                </aside>

                <main className="editor-area">
                    <EditorTabs />
                    <div className="editor-content">
                        {children || <CodeEditor />}
                    </div>
                </main>

                <aside className="right-panels">
                    {/* Right panels component will go here */}
                    <div className="panels-placeholder">Panels</div>
                </aside>
            </div>

            <div className="bottom-panel">
                <TerminalPanel />
            </div>

            <div className="status-bar">
                {/* StatusBar component will go here */}
                <span>Ready</span>
            </div>
        </div>
    );
}
