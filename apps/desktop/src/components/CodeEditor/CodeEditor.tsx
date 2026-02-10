import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../store/editorStore';
import './CodeEditor.css';

export function CodeEditor() {
    const { getActiveTab, updateTabContent } = useEditorStore();
    const activeTab = getActiveTab();

    const handleEditorChange = (value: string | undefined) => {
        if (activeTab && value !== undefined) {
            updateTabContent(activeTab.id, value);
        }
    };

    if (!activeTab) {
        return (
            <div className="editor-empty-state">
                <div className="empty-state-content">
                    <h2>No File Open</h2>
                    <p>Open a file to start editing</p>
                </div>
            </div>
        );
    }

    // Map theme variants to Monaco themes
    // Note: ThemeVariant is color-based (green/red/blue/violet), not light/dark
    // Using vs-dark as the IDE uses a dark theme
    const monacoTheme = 'vs-dark';

    return (
        <div className="code-editor">
            <Editor
                height="100%"
                language={activeTab.language}
                value={activeTab.content}
                onChange={handleEditorChange}
                theme={monacoTheme}
                options={{
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, Consolas, monospace',
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    renderWhitespace: 'selection',
                    tabSize: 4,
                    insertSpaces: true,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                }}
            />
        </div>
    );
}
