import React from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Device, DeviceEvent, RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const MOCK_NOTIFICATIONS: DeviceEvent[] = [
    {
        id: 'n1',
        deviceId: 'd1',
        deviceName: 'Kamera Frontowa',
        propertyName: 'Dom Letniskowy',
        timestamp: '2024-03-20 18:30',
        type: 'alert',
        description: 'Wykryto szkodnika! (Wysokie prawdopodobieństwo)',
        imageUri: 'https://via.placeholder.com/300x200.png?text=SZKODNIK+WYKRYTY'
    },
    {
        id: 'n2',
        deviceId: 'd2',
        deviceName: 'Czujnik Ruchu Kuchnia',
        propertyName: 'Dom Letniskowy',
        timestamp: '2024-03-20 17:15',
        type: 'motion',
        description: 'Wykryto ruch w kuchni o zmierzchu',
    },
    {
        id: 'n3',
        deviceId: 'd1',
        deviceName: 'Kamera Frontowa',
        propertyName: 'Dom Letniskowy',
        timestamp: '2024-03-20 12:00',
        type: 'capture',
        description: 'Ujęcie kontrolne - wszystko w porządku',
        imageUri: 'https://via.placeholder.com/300x200.png?text=Ujecie+kontrolne'
    },
];

const NotificationsScreen = ({navigation}: Props) => {
    const {theme} = useTheme();

    const handleNotificationPress = (event: DeviceEvent) => {
        const mockDevice: Device = {
            id: event.deviceId,
            propertiesId: '1',
            name: event.deviceName,
            type: 'camera',
            status: event.type === 'alert' ? 'alert' : 'active',
            isListening: true,
            isDeleted: false,
            imageUri: event.imageUri,
            lastCaptureDate: event.timestamp
        };

        navigation.navigate('DeviceDetail', {device: mockDevice});
    };

    const renderItem = ({item}: { item: DeviceEvent }) => (
        <TouchableOpacity
            style={[
                styles.notificationCard,
                {backgroundColor: theme.surface},
                item.type === 'alert' && {borderLeftColor: theme.error, borderLeftWidth: 5}
            ]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={styles.cardHeader}>
                <View style={styles.headerText}>
                    <Text style={[styles.propertyName, {color: theme.primary}]}>{item.propertyName}</Text>
                    <Text style={[styles.deviceName, {color: theme.text}]}>{item.deviceName}</Text>
                </View>
                <Text style={[styles.timestamp, {color: theme.subtext}]}>{item.timestamp}</Text>
            </View>

            <Text style={[styles.description, {color: theme.text}]}>{item.description}</Text>

            {item.imageUri && (
                <Image source={{uri: item.imageUri}} style={styles.eventImage}/>
            )}

            <View style={[styles.footer, {borderTopColor: theme.border}]}>
                <Text style={[styles.footerLink, {color: theme.primary}]}>Zobacz szczegóły urządzenia →</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <FlatList
                data={MOCK_NOTIFICATIONS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, {color: theme.subtext}]}>Brak nowych powiadomień</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1},
    listContent: {padding: 15},
    notificationCard: {borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2},
    cardHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
    headerText: {flex: 1},
    propertyName: {fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase'},
    deviceName: {fontSize: 16, fontWeight: 'bold'},
    timestamp: {fontSize: 12},
    description: {fontSize: 14, marginBottom: 10},
    eventImage: {width: '100%', height: 150, borderRadius: 8, marginBottom: 10},
    footer: {borderTopWidth: 1, paddingTop: 10},
    footerLink: {fontSize: 12, fontWeight: 'bold', textAlign: 'right'},
    emptyContainer: {padding: 50, alignItems: 'center'},
    emptyText: {fontSize: 16},
});

export default NotificationsScreen;