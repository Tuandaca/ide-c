import { useEditorStore } from '../../store/editorStore';
import { useCompilerStore } from '../../store/compilerStore';
import { useBuildStore } from '../../store/buildStore';
import type { BuildStatus } from '../../store/buildStore';
import './EditorToolbar.css';

const STATUS_LABELS: Record<BuildStatus, string> = {
    idle: '',
    saving: 'Saving...',
    compiling: 'Building...',
    running: 'Running...',
    success: 'Build Succeeded ✓',
    error: 'Build Failed ✗',
};

export function EditorToolbar() {
    const activeTab = useEditorStore((s) => s.tabs.find((t) => t.id === s.activeTabId));
    const { compilers, selectedCompiler, selectCompiler } = useCompilerStore();
    const { status, buildFile, buildAndRun, clearOutput, addOutput } = useBuildStore();

    const isBusy = status === 'saving' || status === 'compiling' || status === 'running';

    const handleBuild = async () => {
        if (isBusy) return;
        if (!activeTab) {
            addOutput('\x1b[1;33m[Info]\x1b[0m Open a C/C++ file first, then click Build.');
            return;
        }
        if (!selectedCompiler) {
            addOutput('\x1b[1;31m[Error]\x1b[0m No compiler detected. Install GCC, Clang, or MSVC and restart.');
            return;
        }
        await buildFile();
    };

    const handleRun = async () => {
        if (isBusy) return;
        if (!activeTab) {
            addOutput('\x1b[1;33m[Info]\x1b[0m Open a C/C++ file first, then click Run.');
            return;
        }
        if (!selectedCompiler) {
            addOutput('\x1b[1;31m[Error]\x1b[0m No compiler detected. Install GCC, Clang, or MSVC and restart.');
            return;
        }
        await buildAndRun();
    };

    return (
        <div className="editor-toolbar">
            <div className="toolbar-left">
                <button
                    className={`toolbar-btn run-btn ${isBusy ? 'is-busy' : ''}`}
                    onClick={handleRun}
                    title="Build & Run (F5)"
                >
                    <span className="toolbar-icon">▶</span>
                    <span>Run</span>
                </button>

                <button
                    className={`toolbar-btn build-btn ${isBusy ? 'is-busy' : ''}`}
                    onClick={handleBuild}
                    title="Build (Ctrl+Shift+B)"
                >
                    <span className="toolbar-icon">⚙</span>
                    <span>Build</span>
                </button>

                <div className="toolbar-separator" />

                {/* Compiler Selector */}
                <select
                    className="compiler-select"
                    value={selectedCompiler?.path || ''}
                    onChange={(e) => selectCompiler(e.target.value)}
                    title="Select compiler"
                >
                    {compilers.length === 0 ? (
                        <option value="">No compiler found</option>
                    ) : (
                        compilers.map((c) => (
                            <option key={c.path} value={c.path}>
                                {c.name} ({c.compiler_type})
                            </option>
                        ))
                    )}
                </select>

                {/* Status */}
                {status !== 'idle' && (
                    <span className={`toolbar-status toolbar-status--${status}`}>
                        {isBusy && <span className="spinner" />}
                        {STATUS_LABELS[status]}
                    </span>
                )}
            </div>

            <div className="toolbar-right">
                <button
                    className="toolbar-btn clear-btn"
                    onClick={clearOutput}
                    title="Clear output"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
