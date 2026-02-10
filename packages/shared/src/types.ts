export interface FileNode {
    id: string;
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileNode[];
    isExpanded?: boolean;
}

export interface EditorTab {
    id: string;
    filePath: string;
    fileName: string;
    language: string;
    isDirty: boolean;
    isActive: boolean;
}

export interface PanelConfig {
    id: string;
    title: string;
    isVisible: boolean;
    size?: number;
    minSize?: number;
    maxSize?: number;
}

export interface Command {
    id: string;
    label: string;
    description?: string;
    category?: string;
    keybinding?: string;
    execute: () => void | Promise<void>;
}

export interface Theme {
    name: string;
    type: 'light' | 'dark';
}
