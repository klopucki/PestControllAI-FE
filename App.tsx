import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import {NotificationProvider} from './src/context/NotificationContext';
import {ThemeProvider} from './src/context/ThemeContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <NotificationProvider>
                    <RootNavigator/>
                </NotificationProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;