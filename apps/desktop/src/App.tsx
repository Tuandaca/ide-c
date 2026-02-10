import { useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Layout } from './components/Layout';
import { useThemeStore } from './store/themeStore';
import './App.css';

function App() {
  const { showWelcomeScreen, dismissWelcomeScreen, currentTheme, setTheme } = useThemeStore();

  // Apply theme on mount and when it changes
  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme, setTheme]);

  const handleNewFile = () => {
    console.log('Creating new file...');
    // TODO: Implement new file creation
  };

  const handleOpenFile = () => {
    console.log('Opening file...');
    // TODO: Implement file picker dialog
  };

  if (showWelcomeScreen) {
    return (
      <WelcomeScreen
        onNewFile={handleNewFile}
        onOpenFile={handleOpenFile}
        onDismiss={dismissWelcomeScreen}
      />
    );
  }

  return (
    <Layout>
      <div className="editor-placeholder">
        <h2>Editor Area</h2>
        <p>Monaco Editor will go here</p>
      </div>
    </Layout>
  );
}

export default App;

