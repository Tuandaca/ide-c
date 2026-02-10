export const APP_NAME = 'IDE-C';
export const APP_VERSION = '0.1.0';

export const KEYBINDINGS = {
    SAVE: 'Ctrl+S',
    OPEN: 'Ctrl+O',
    CLOSE_TAB: 'Ctrl+W',
    NEW_FILE: 'Ctrl+N',
    COMMAND_PALETTE: 'Ctrl+Shift+P',
    QUICK_OPEN: 'Ctrl+P',
    TOGGLE_TERMINAL: 'Ctrl+`',
    TOGGLE_SIDEBAR: 'Ctrl+B',
} as const;

export const FILE_EXTENSIONS = {
    TYPESCRIPT: ['.ts', '.tsx'],
    JAVASCRIPT: ['.js', '.jsx'],
    CSS: ['.css', '.scss', '.sass', '.less'],
    HTML: ['.html', '.htm'],
    JSON: ['.json'],
    MARKDOWN: ['.md', '.markdown'],
} as const;
