/**
 * Get the file extension from a file path
 */
export function getFileExtension(filePath: string): string {
    const lastDot = filePath.lastIndexOf('.');
    const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));

    if (lastDot > lastSlash) {
        return filePath.substring(lastDot + 1);
    }

    return '';
}

/**
 * Get the filename without extension
 */
export function getBaseName(filePath: string): string {
    const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
    const fileName = filePath.substring(lastSlash + 1);
    const lastDot = fileName.lastIndexOf('.');

    return lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
}

/**
 * Join path segments
 */
export function joinPath(...segments: string[]): string {
    return segments
        .join('/')
        .replace(/\/+/g, '/')
        .replace(/\\/g, '/');
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
