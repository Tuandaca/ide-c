import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Terminal as XTerm, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
// CSS is improved in global theme or via package side-effects
// import 'xterm/css/xterm.css'; 
import './Terminal.css';

export interface TerminalRef {
    write: (data: string | Uint8Array) => void;
    writeln: (data: string | Uint8Array) => void;
    clear: () => void;
    focus: () => void;
    fit: () => void;
}

interface TerminalProps {
    onData?: (data: string) => void;
    onResize?: (cols: number, rows: number) => void;
    theme?: {
        background?: string;
        foreground?: string;
        cursor?: string;
        selection?: string;
        cursorAccent?: string;
    };
    options?: ITerminalOptions;
}

export const Terminal = forwardRef<TerminalRef, TerminalProps>(
    ({ onData, onResize, theme, options = {} }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const terminalRef = useRef<XTerm | null>(null);
        const fitAddonRef = useRef<FitAddon | null>(null);

        // Expose methods to parent
        useImperativeHandle(ref, () => ({
            write: (data) => terminalRef.current?.write(data),
            writeln: (data) => terminalRef.current?.writeln(data),
            clear: () => terminalRef.current?.clear(),
            focus: () => terminalRef.current?.focus(),
            fit: () => fitAddonRef.current?.fit(),
        }));

        useEffect(() => {
            if (!containerRef.current) return;

            // Initialize xterm
            const term = new XTerm({
                cursorBlink: true,
                fontSize: 14,
                fontFamily: 'Consolas, "Courier New", monospace',
                theme: theme || {
                    background: '#1e1e1e',
                    foreground: '#d4d4d4',
                },
                ...options,
            });

            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);
            term.open(containerRef.current);
            fitAddon.fit();

            terminalRef.current = term;
            fitAddonRef.current = fitAddon;

            // Handle input
            if (onData) {
                term.onData(onData);
            }

            // Handle resize
            term.onResize((size: { cols: number; rows: number }) => {
                onResize?.(size.cols, size.rows);
            });

            // Resize observer to auto-fit
            const resizeObserver = new ResizeObserver(() => {
                fitAddon.fit();
            });
            resizeObserver.observe(containerRef.current);

            // Cleanup
            return () => {
                resizeObserver.disconnect();
                term.dispose();
            };
        }, []);

        // Update theme dynamically
        useEffect(() => {
            if (terminalRef.current && theme) {
                terminalRef.current.options.theme = theme;
            }
        }, [theme]);

        return (
            <div
                ref={containerRef}
                style={{ width: '100%', height: '100%', overflow: 'hidden' }}
                className="ide-terminal"
            />
        );
    }
);

Terminal.displayName = 'Terminal';
