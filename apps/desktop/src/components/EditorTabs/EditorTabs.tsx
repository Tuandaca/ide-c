import { FiX } from 'react-icons/fi';
import { useEditorStore } from '../../store/editorStore';
import './EditorTabs.css';

export function EditorTabs() {
    const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore();

    if (tabs.length === 0) {
        return null;
    }

    const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
        e.stopPropagation();
        closeTab(tabId);
    };

    return (
        <div className="editor-tabs">
            <div className="tabs-list">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`tab ${tab.id === activeTabId ? 'active' : ''} ${tab.isDirty ? 'dirty' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-name">
                            {tab.fileName}
                            {tab.isDirty && <span className="dirty-indicator">●</span>}
                        </span>
                        <button
                            className="tab-close-btn"
                            onClick={(e) => handleCloseTab(e, tab.id)}
                            aria-label={`Close ${tab.fileName}`}
                        >
                            <FiX />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
