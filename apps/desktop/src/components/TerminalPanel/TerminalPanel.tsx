import { useRef, useEffect } from 'react';
import { Terminal, TerminalRef } from '@ide-c/ui';
import './TerminalPanel.css';

export const TerminalPanel = () => {
    const terminalRef = useRef<TerminalRef>(null);

    useEffect(() => {
        // Initial welcome message
        const timer = setTimeout(() => {
            terminalRef.current?.writeln('\x1b[1;32mWelcome to IDE-C Terminal\x1b[0m');
            terminalRef.current?.writeln('Run your C/C++ code to see output here.');
        }, 100); // Small delay to ensure init

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="terminal-panel-container">
            <div className="terminal-header">
                <span className="terminal-tab active">Terminal</span>
                <span className="terminal-tab">Output</span>
                <span className="terminal-tab">Debug Console</span>
            </div>
            <div className="terminal-content">
                <Terminal ref={terminalRef} />
            </div>
        </div>
    );
};
