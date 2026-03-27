import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

export type NotificationMessage = {
    title: string;
    body: string;
    data?: any;
};

interface NotificationContextType {
    notifications: NotificationMessage[];
    unreadCount: number;
    addNotification: (msg: NotificationMessage) => void;
    clearUnread: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // TODO: const socket = new WebSocket('ws://backend.com');

        const timer = setTimeout(() => {
            const mockAlert: NotificationMessage = {
                title: '🔴 ALERT: Wykryto ruch!',
                body: 'Kamera w Spiżarni zarejestrowała aktywność.',
                data: {deviceId: 'd1'}
            };

            handleIncomingNotification(mockAlert);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const handleIncomingNotification = (msg: NotificationMessage) => {
        setNotifications(prev => [msg, ...prev]);
        setUnreadCount(prev => prev + 1);

        Alert.alert(msg.title, msg.body, [
            {text: 'Zobacz', onPress: () => console.log('Nawiguj do urządzenia...')},
            {text: 'Zamknij', style: 'cancel'}
        ]);
    };

    const clearUnread = () => setUnreadCount(0);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification: handleIncomingNotification,
            clearUnread
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};
