import { motion } from 'framer-motion';
import { FiPlus, FiFolder } from 'react-icons/fi';
import { useState } from 'react';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
    onNewFile: () => void;
    onOpenFile: () => void;
    onDismiss: () => void;
}

export function WelcomeScreen({ onNewFile, onOpenFile, onDismiss }: WelcomeScreenProps) {
    const [isExiting, setIsExiting] = useState(false);

    const handleAction = (action: () => void) => {
        setIsExiting(true);
        setTimeout(() => {
            action();
            onDismiss();
        }, 400);
    };

    return (
        <motion.div
            className="welcome-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="welcome-background" />

            <motion.div
                className="welcome-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            >
                <div className="welcome-logo">
                    <h1 className="welcome-title">C++ IDE</h1>
                    <p className="welcome-subtitle">Fast & Modern Development</p>
                </div>

                <div className="welcome-actions">
                    <button
                        className="welcome-action-btn new-file"
                        onClick={() => handleAction(onNewFile)}
                    >
                        <FiPlus className="action-icon" />
                        <span>New File</span>
                    </button>

                    <button
                        className="welcome-action-btn open-file"
                        onClick={() => handleAction(onOpenFile)}
                    >
                        <FiFolder className="action-icon" />
                        <span>Open File</span>
                    </button>
                </div>

                <div className="welcome-footer">
                    <p className="version-text">Version 0.1.0</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
