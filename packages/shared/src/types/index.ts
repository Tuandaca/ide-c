export interface FileSystemItem {
    path: string;
    name: string;
    type: 'file' | 'directory';
    size?: number;
    lastModified?: Date;
    children?: FileSystemItem[];
}

export interface EditorTab {
    id: string;
    path: string;
    title: string;
    isDirty: boolean;
    language?: string;
}

export interface Position {
    line: number;
    column: number;
}

export interface Range {
    start: Position;
    end: Position;
}

export interface TextEdit {
    range: Range;
    newText: string;
}
