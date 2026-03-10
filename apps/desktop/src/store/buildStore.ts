import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { useCompilerStore } from './compilerStore';
import { useEditorStore } from './editorStore';

export type BuildStatus = 'idle' | 'saving' | 'compiling' | 'running' | 'success' | 'error';

interface CompileResult {
    success: boolean;
    stdout: string;
    stderr: string;
    output_path: string;
}

interface RunResult {
    exit_code: number;
    stdout: string;
    stderr: string;
}

interface BuildState {
    status: BuildStatus;
    lastResult: CompileResult | null;
    outputLines: string[];

    buildFile: () => Promise<CompileResult | null>;
    buildAndRun: () => Promise<void>;
    addOutput: (line: string) => void;
    clearOutput: () => void;
}

export const useBuildStore = create<BuildState>()((set, get) => ({
    status: 'idle',
    lastResult: null,
    outputLines: [],

    addOutput: (line: string) => {
        set((state) => ({
            outputLines: [...state.outputLines, line],
        }));
    },

    clearOutput: () => {
        set({ outputLines: [], status: 'idle' });
    },

    buildFile: async () => {
        const compiler = useCompilerStore.getState().selectedCompiler;
        const activeTab = useEditorStore.getState().tabs.find(
            (t) => t.id === useEditorStore.getState().activeTabId
        );

        if (!activeTab) {
            get().addOutput('\x1b[1;31m[Error] No file open.\x1b[0m');
            return null;
        }
        if (!compiler) {
            get().addOutput('\x1b[1;31m[Error] No compiler selected.\x1b[0m');
            return null;
        }

        // Save first if dirty
        if (activeTab.isDirty) {
            set({ status: 'saving' });
            try {
                await invoke('write_file', {
                    path: activeTab.filePath,
                    content: activeTab.content,
                });
                useEditorStore.getState().saveTab(activeTab.id);
                get().addOutput(`\x1b[90m[Save] ${activeTab.filePath}\x1b[0m`);
            } catch (err) {
                get().addOutput(`\x1b[1;31m[Error] Failed to save: ${String(err)}\x1b[0m`);
                set({ status: 'error' });
                return null;
            }
        }

        set({ status: 'compiling' });
        get().addOutput(`\x1b[1;36m[Build]\x1b[0m ${compiler.name} ${activeTab.filePath}`);

        try {
            const result = await invoke<CompileResult>('compile_file', {
                filePath: activeTab.filePath,
                compilerPath: compiler.path,
                extraArgs: null,
            });

            set({ lastResult: result });

            if (result.success) {
                set({ status: 'success' });
                get().addOutput(`\x1b[1;32m[Build]\x1b[0m OK → ${result.output_path}`);
            } else {
                set({ status: 'error' });
                get().addOutput(`\x1b[1;31m[Build]\x1b[0m Failed`);
            }

            if (result.stdout) {
                result.stdout.split('\n').forEach((line) => get().addOutput(line));
            }
            if (result.stderr) {
                result.stderr.split('\n').forEach((line) => get().addOutput(line));
            }

            return result;
        } catch (err) {
            get().addOutput(`\x1b[1;31m[Error]\x1b[0m ${String(err)}`);
            set({ status: 'error' });
            return null;
        }
    },

    buildAndRun: async () => {
        get().clearOutput();
        const result = await get().buildFile();

        if (!result?.success) return;

        set({ status: 'running' });
        get().addOutput(`\x1b[1;36m[Run]\x1b[0m ${result.output_path}`);
        get().addOutput('─'.repeat(40));

        try {
            const runResult = await invoke<RunResult>('run_binary', {
                binaryPath: result.output_path,
            });

            if (runResult.stdout) {
                runResult.stdout.split('\n').forEach((line) => get().addOutput(line));
            }
            if (runResult.stderr) {
                runResult.stderr.split('\n').forEach((line) => {
                    get().addOutput(`\x1b[1;31m${line}\x1b[0m`);
                });
            }

            get().addOutput('─'.repeat(40));
            if (runResult.exit_code === 0) {
                set({ status: 'success' });
                get().addOutput(`\x1b[1;32m[Done]\x1b[0m exit code ${runResult.exit_code}`);
            } else {
                set({ status: 'error' });
                get().addOutput(`\x1b[1;33m[Done]\x1b[0m exit code ${runResult.exit_code}`);
            }
        } catch (err) {
            get().addOutput(`\x1b[1;31m[Error]\x1b[0m ${String(err)}`);
            set({ status: 'error' });
        }
    },
}));
