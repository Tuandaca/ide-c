/**
 * Get file extension from path
 */
export function getFileExtension(filePath: string): string {
    const match = filePath.match(/\.([^.]+)$/);
    return match ? match[1] : '';
}

/**
 * Get file name from path
 */
export function getFileName(filePath: string): string {
    return filePath.split(/[/\\]/).pop() || '';
}

/**
 * Normalize path separators to forward slashes
 */
export function normalizePath(path: string): string {
    return path.replace(/\\/g, '/');
}

/**
 * Check if path is absolute
 */
export function isAbsolutePath(path: string): boolean {
    return /^([a-zA-Z]:)?[/\\]/.test(path);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
