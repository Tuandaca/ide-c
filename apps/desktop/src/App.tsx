import { useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Layout } from './components/Layout';
import { useThemeStore } from './store/themeStore';
import { useEditorStore } from './store/editorStore';
import './App.css';

// Demo C code for testing
const DEMO_C_CODE = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

const DEMO_CPP_CODE = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`;

function App() {
  const { showWelcomeScreen, dismissWelcomeScreen, currentTheme, setTheme } = useThemeStore();
  const { openTab } = useEditorStore();

  // Apply theme on mount and when it changes
  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme, setTheme]);

  const handleNewFile = () => {
    console.log('Creating new file...');

    // Create a new demo file
    openTab({
      fileName: 'untitled.c',
      filePath: '/untitled.c',
      content: DEMO_C_CODE,
      language: 'c',
    });
  };

  const handleOpenFile = () => {
    console.log('Opening file...');

    // Demo: Open multiple files for testing
    openTab({
      fileName: 'main.c',
      filePath: '/demo/main.c',
      content: DEMO_C_CODE,
      language: 'c',
    });

    openTab({
      fileName: 'hello.cpp',
      filePath: '/demo/hello.cpp',
      content: DEMO_CPP_CODE,
      language: 'cpp',
    });
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

  return <Layout />;
}

export default App;

