import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { invoke } from '@tauri-apps/api/core';

export interface Compiler {
    name: string;
    version: string;
    path: string;
    compiler_type: string;
}

interface CompilerState {
    compilers: Compiler[];
    selectedCompiler: Compiler | null;
    isLoading: boolean;
    error: string | null;
    fetchCompilers: () => Promise<void>;
    selectCompiler: (path: string) => void;
}

export const useCompilerStore = create<CompilerState>()(
    immer((set) => ({
        compilers: [],
        selectedCompiler: null,
        isLoading: false,
        error: null,

        fetchCompilers: async () => {
            set((state) => {
                state.isLoading = true;
                state.error = null;
            });

            try {
                console.log('Fetching compilers...');
                const compilers = await invoke<Compiler[]>('get_compilers');
                console.log('Detected compilers:', compilers);

                set((state) => {
                    state.compilers = compilers;
                    state.isLoading = false;
                    // Select first compiler by default if none selected
                    if (compilers.length > 0 && !state.selectedCompiler) {
                        state.selectedCompiler = compilers[0];
                    }
                });
            } catch (err) {
                console.error('Failed to fetch compilers:', err);
                set((state) => {
                    state.error = String(err);
                    state.isLoading = false;
                });
            }
        },

        selectCompiler: (path: string) => {
            set((state) => {
                const compiler = state.compilers.find((c) => c.path === path);
                if (compiler) {
                    state.selectedCompiler = compiler;
                }
            });
        },
    }))
);
