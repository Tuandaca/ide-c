import { useRef, useEffect } from 'react';
import { Terminal, TerminalRef } from '@ide-c/ui';
import { useBuildStore } from '../../store/buildStore';
import './TerminalPanel.css';

export const TerminalPanel = () => {
    const terminalRef = useRef<TerminalRef>(null);
    const lastLineCount = useRef(0);

    const outputLines = useBuildStore((s) => s.outputLines);

    // Initial welcome message
    useEffect(() => {
        const timer = setTimeout(() => {
            terminalRef.current?.writeln('\x1b[1;32mWelcome to IDE-C Terminal\x1b[0m');
            terminalRef.current?.writeln('Use the toolbar buttons to Build & Run your C/C++ code.');
            terminalRef.current?.writeln('');
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Subscribe to build output and write new lines to terminal
    useEffect(() => {
        const newLines = outputLines.slice(lastLineCount.current);
        newLines.forEach((line) => {
            terminalRef.current?.writeln(line);
        });
        lastLineCount.current = outputLines.length;
    }, [outputLines]);

    // When output is cleared (length goes to 0), clear terminal too
    useEffect(() => {
        if (outputLines.length === 0 && lastLineCount.current > 0) {
            terminalRef.current?.clear?.();
            lastLineCount.current = 0;
        }
    }, [outputLines.length]);

    return (
        <div className="terminal-panel-container">
            <div className="terminal-header">
                <span className="terminal-tab active">Output</span>
                <span className="terminal-tab">Terminal</span>
                <span className="terminal-tab">Debug Console</span>
            </div>
            <div className="terminal-content">
                <Terminal ref={terminalRef} />
            </div>
        </div>
    );
};
