import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface EditorTab {
    id: string;
    fileName: string;
    filePath: string;
    content: string;
    language: string;
    isDirty: boolean;
}

interface EditorStore {
    tabs: EditorTab[];
    activeTabId: string | null;

    // Tab Management
    openTab: (tab: Omit<EditorTab, 'id' | 'isDirty'>) => void;
    closeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;
    updateTabContent: (tabId: string, content: string) => void;

    // Helpers
    getActiveTab: () => EditorTab | null;
    findTabByPath: (filePath: string) => EditorTab | null;
}

export const useEditorStore = create<EditorStore>()(
    immer((set, get) => ({
        tabs: [],
        activeTabId: null,

        openTab: (tabData) => {
            const existing = get().findTabByPath(tabData.filePath);

            if (existing) {
                // File already open, just switch to it
                set({ activeTabId: existing.id });
                return;
            }

            // Create new tab
            const newTab: EditorTab = {
                ...tabData,
                id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                isDirty: false,
            };

            set((state) => {
                state.tabs.push(newTab);
                state.activeTabId = newTab.id;
            });
        },

        closeTab: (tabId) => {
            set((state) => {
                const index = state.tabs.findIndex(t => t.id === tabId);
                if (index === -1) return;

                state.tabs.splice(index, 1);

                // If closed tab was active, switch to another tab
                if (state.activeTabId === tabId) {
                    if (state.tabs.length > 0) {
                        // Switch to previous tab, or first if none before
                        const newActiveIndex = Math.max(0, index - 1);
                        state.activeTabId = state.tabs[newActiveIndex]?.id || null;
                    } else {
                        state.activeTabId = null;
                    }
                }
            });
        },

        setActiveTab: (tabId) => {
            set({ activeTabId: tabId });
        },

        updateTabContent: (tabId, content) => {
            set((state) => {
                const tab = state.tabs.find(t => t.id === tabId);
                if (tab) {
                    tab.content = content;
                    tab.isDirty = true;
                }
            });
        },

        getActiveTab: () => {
            const state = get();
            return state.tabs.find(t => t.id === state.activeTabId) || null;
        },

        findTabByPath: (filePath) => {
            return get().tabs.find(t => t.filePath === filePath) || null;
        },
    }))
);
