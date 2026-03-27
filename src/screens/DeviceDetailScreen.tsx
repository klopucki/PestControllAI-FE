import React, {useState} from 'react';
import {FlatList, Image, StyleSheet, Switch, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DeviceEvent, RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceDetail'>;

const MOCK_EVENTS: DeviceEvent[] = [
    {
        id: 'e1',
        deviceId: 'd1',
        deviceName: 'Kamera Frontowa',
        propertyName: 'Dom Letniskowy',
        timestamp: '2024-03-20 15:45',
        type: 'motion',
        description: 'Wykryto ruch w strefie A',
        imageUri: 'https://via.placeholder.com/300x200.png?text=Zdarzenie+1'
    },
    {
        id: 'e2',
        deviceId: 'd1',
        deviceName: 'Kamera Frontowa',
        propertyName: 'Dom Letniskowy',
        timestamp: '2024-03-20 14:20',
        type: 'capture',
        description: 'Zaplanowane ujęcie kontrolne',
        imageUri: 'https://via.placeholder.com/300x200.png?text=Zdarzenie+2'
    },
    {
        id: 'e3',
        deviceId: 'd1',
        deviceName: 'Kamera Frontowa',
        propertyName: 'Dom Letniskowy',
        timestamp: '2024-03-20 02:15',
        type: 'alert',
        description: 'Wykryto szkodnika! (Wysokie prawdopodobieństwo)',
        imageUri: 'https://via.placeholder.com/300x200.png?text=SZKODNIK+WYKRYTY'
    },
];

const DeviceDetailScreen = ({route, navigation}: Props) => {
    const {device} = route.params;
    const [isListening, setIsListening] = useState(device.isListening);
    const {theme} = useTheme();

    const renderEventItem = ({item}: { item: DeviceEvent }) => (
        <View style={[styles.eventCard, {backgroundColor: theme.surface}]}>
            <View style={styles.eventHeader}>
                <Text style={[styles.eventTime, {color: theme.subtext}]}>{item.timestamp}</Text>
                <Text style={[styles.eventType, {color: theme.primary}, item.type === 'alert' && {color: theme.error}]}>
                    {item.type.toUpperCase()}
                </Text>
            </View>
            <Text style={[styles.eventDesc, {color: theme.text}]}>{item.description}</Text>
            {item.imageUri && (
                <Image source={{uri: item.imageUri}} style={styles.eventImage}/>
            )}
        </View>
    );

    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <FlatList
                ListHeaderComponent={
                    <View>
                        <View style={styles.liveContainer}>
                            <Text style={styles.liveTitle}>Podgląd Na Żywo / Ostatnie ujęcie</Text>
                            {device.type === 'camera' ? (
                                <View style={styles.videoPlaceholder}>
                                    <Image
                                        source={{uri: device.imageUri || 'https://via.placeholder.com/400x250.png?text=PODGLAD+KAMERY'}}
                                        style={styles.fullImage}/>
                                    <View style={styles.liveBadge}><Text style={styles.liveText}>LIVE</Text></View>
                                </View>
                            ) : (
                                <View style={[styles.sensorStatus, {backgroundColor: theme.surface}]}>
                                    <Text style={styles.sensorIcon}>{device.type === 'microphone' ? '🎤' : '📡'}</Text>
                                    <Text style={[styles.sensorStatusText, {color: theme.subtext}]}>Urządzenie aktywne -
                                        Nasłuchiwanie...</Text>
                                </View>
                            )}
                        </View>

                        <View style={[styles.controlPanel, {backgroundColor: theme.surface}]}>
                            <View style={styles.controlRow}>
                                <View>
                                    <Text style={[styles.controlTitle, {color: theme.text}]}>Nasłuchiwanie
                                        zdarzeń</Text>
                                    <Text style={[styles.controlSub, {color: theme.subtext}]}>Włącz powiadomienia
                                        Push</Text>
                                </View>
                                <Switch
                                    value={isListening}
                                    onValueChange={setIsListening}
                                    trackColor={{false: "#767577", true: theme.secondary}}
                                />
                            </View>

                            {!isListening && (
                                <View
                                    style={[styles.warningBox, {backgroundColor: theme.isDark ? '#3a2d00' : '#fff3cd'}]}>
                                    <Text style={[styles.warningText, {color: theme.isDark ? '#ffd64d' : '#856404'}]}>⚠️
                                        Urządzenie działa, ale nie otrzymasz powiadomień o wykryciach.</Text>
                                </View>
                            )}
                        </View>

                        <Text style={[styles.historyTitle, {color: theme.text}]}>Historia Zdarzeń</Text>
                    </View>
                }
                data={MOCK_EVENTS}
                renderItem={renderEventItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1},
    listContent: {paddingBottom: 20},

    liveContainer: {backgroundColor: '#000', paddingBottom: 10},
    liveTitle: {color: '#fff', padding: 10, fontSize: 14, fontWeight: 'bold'},
    videoPlaceholder: {
        width: '100%',
        height: 250,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullImage: {width: '100%', height: '100%', opacity: 0.8},
    liveBadge: {position: 'absolute', top: 10, left: 10, backgroundColor: 'red', paddingHorizontal: 6, borderRadius: 4},
    liveText: {color: '#fff', fontSize: 10, fontWeight: 'bold'},

    sensorStatus: {height: 150, justifyContent: 'center', alignItems: 'center'},
    sensorIcon: {fontSize: 50, marginBottom: 10},
    sensorStatusText: {fontWeight: 'bold'},

    controlPanel: {padding: 20, marginVertical: 10, elevation: 2},
    controlRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    controlTitle: {fontSize: 18, fontWeight: 'bold'},
    controlSub: {fontSize: 14},
    warningBox: {marginTop: 15, padding: 10, borderRadius: 8},
    warningText: {fontSize: 12},

    historyTitle: {fontSize: 20, fontWeight: 'bold', padding: 20},
    eventCard: {marginHorizontal: 15, marginBottom: 15, borderRadius: 10, padding: 15, elevation: 1},
    eventHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5},
    eventTime: {fontSize: 12},
    eventType: {fontSize: 10, fontWeight: 'bold'},
    eventDesc: {fontSize: 15, marginBottom: 10},
    eventImage: {width: '100%', height: 180, borderRadius: 8},
});

export default DeviceDetailScreen;