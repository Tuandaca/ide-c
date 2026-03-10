import { FileExplorer } from '../FileExplorer/FileExplorer';
import { MenuBar } from '../MenuBar/MenuBar';
import { EditorTabs } from '../EditorTabs';
import { EditorToolbar } from '../EditorToolbar/EditorToolbar';
import { CodeEditor } from '../CodeEditor';
import { TerminalPanel } from '../TerminalPanel/TerminalPanel';
import { useBuildStore } from '../../store/buildStore';
import type { BuildStatus } from '../../store/buildStore';
import './Layout.css';

const STATUS_BAR_TEXT: Record<BuildStatus, string> = {
    idle: 'Ready',
    saving: '$(sync~spin) Saving...',
    compiling: '$(sync~spin) Building...',
    running: '$(play) Running...',
    success: '$(check) Build Succeeded',
    error: '$(error) Build Failed',
};

const STATUS_BAR_CLASS: Record<BuildStatus, string> = {
    idle: '',
    saving: 'status-busy',
    compiling: 'status-busy',
    running: 'status-busy',
    success: 'status-success',
    error: 'status-error',
};

interface LayoutProps {
    children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const status = useBuildStore((s) => s.status);

    return (
        <div className="ide-layout">
            <MenuBar />

            <div className="layout-body">
                <aside className="sidebar">
                    <FileExplorer />
                </aside>

                <main className="editor-area">
                    <EditorTabs />
                    <EditorToolbar />
                    <div className="editor-content">
                        {children || <CodeEditor />}
                    </div>
                </main>

                <aside className="right-panels">
                    <div className="panels-placeholder">Panels</div>
                </aside>
            </div>

            <div className="bottom-panel">
                <TerminalPanel />
            </div>

            <div className={`status-bar ${STATUS_BAR_CLASS[status]}`}>
                <span>{STATUS_BAR_TEXT[status]}</span>
            </div>
        </div>
    );
}
