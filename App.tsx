import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { NotificationProvider } from './src/context/NotificationContext';
import { ThemeProvider } from './src/context/ThemeContext';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <RootNavigator />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;