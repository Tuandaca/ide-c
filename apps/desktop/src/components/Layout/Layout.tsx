import { EditorTabs } from '../EditorTabs';
import { CodeEditor } from '../CodeEditor';
import './Layout.css';

interface LayoutProps {
    children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="ide-layout">
            <div className="menu-bar">
                {/* MenuBar component will go here */}
                <div className="menu-items">
                    <span className="app-logo">C++ IDE</span>
                </div>
            </div>

            <div className="layout-body">
                <aside className="sidebar">
                    {/* Sidebar component will go here */}
                    <div className="sidebar-placeholder">Sidebar</div>
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
                {/* Bottom panel component will go here */}
                <div className="bottom-placeholder">Bottom Panel</div>
            </div>

            <div className="status-bar">
                {/* StatusBar component will go here */}
                <span>Ready</span>
            </div>
        </div>
    );
}
