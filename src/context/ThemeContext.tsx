import React, {createContext, useContext, useState} from 'react';
import {useColorScheme} from 'react-native';
import {darkTheme, lightTheme, ThemeColors} from '../theme/colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeColors;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const systemColorScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');

    const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';
    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{theme, mode, setMode, isDark}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
