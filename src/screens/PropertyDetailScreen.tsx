import React, {useCallback, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Device, RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {deviceApi} from '../api/deviceApi';
import {propertyApi} from '../api/propertyApi';

type Props = NativeStackScreenProps<RootStackParamList, 'PropertyDetail'>;

const PropertyDetailScreen = ({route, navigation}: Props) => {
    const {propertyId} = route.params;
    const [showDeleted, setShowDeleted] = useState(false);
    const {theme} = useTheme();
    const {t} = useTranslation();
    const queryClient = useQueryClient();

    const {
        data: property,
        isLoading: isPropertyLoading
    } = useQuery({
        queryKey: ['property', propertyId],
        queryFn: () => propertyApi.getById(propertyId),
    });

    const {
        data: devices = [],
        isLoading: isDevicesLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ['devices', propertyId],
        queryFn: () => deviceApi.getByPropertyId(propertyId),
    });

    const toggleDeleteMutation = useMutation({
        mutationFn: ({id, isDeleted}: { id: string, isDeleted: boolean }) =>
            deviceApi.updateStatus(id, isDeleted),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['devices', propertyId]});
        }
    });

    const filteredDevices = devices.filter(d => showDeleted || !d.isDeleted);

    const toggleDeleteDevice = useCallback((id: string, currentDeleted: boolean) => {
        toggleDeleteMutation.mutate({id, isDeleted: !currentDeleted});
    }, [toggleDeleteMutation]);

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'camera':
                return '📷';
            case 'microphone':
                return '🎤';
            case 'sensor':
                return '📡';
            case 'trap':
                return '🪤';
            default:
                return '⚙️';
        }
    };

    const renderDeviceItem = useCallback(({item}: { item: Device }) => (
        <TouchableOpacity
            style={[
                styles.deviceCard,
                {backgroundColor: theme.surface},
                item.status === 'alert' && !item.isDeleted && {borderColor: theme.error, borderWidth: 1},
                item.isDeleted && {opacity: 0.6}
            ]}
            onPress={() => !item.isDeleted && navigation.navigate('DeviceDetail', {device: item})}
        >
            <View style={styles.deviceHeader}>
                <Text
                    style={[styles.deviceIcon, item.isDeleted && styles.deletedText]}>{getDeviceIcon(item.type)}</Text>
                <View style={styles.deviceInfo}>
                    <Text
                        style={[styles.deviceName, {color: theme.text}, item.isDeleted && styles.deletedText]}>{item.name}</Text>
                    <Text
                        style={[styles.lastCapture, {color: theme.subtext}]}>{t('device.last_activity')}: {item.lastCaptureDate || 'N/A'}</Text>
                </View>
                {!item.isDeleted && (
                    <View
                        style={[styles.statusBadge, {backgroundColor: item.status === 'active' ? theme.secondary : theme.error}]}>
                        <Text
                            style={styles.statusText}>{item.status === 'active' ? t('device.active') : t('device.alert')}</Text>
                    </View>
                )}
            </View>

            {item.imageUri && !item.isDeleted && (
                <Image source={{uri: item.imageUri}} style={styles.deviceImage}/>
            )}

            <View style={[styles.deviceActions, {borderTopColor: theme.border}]}>
                <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: theme.error}, item.isDeleted && {backgroundColor: theme.secondary}]}
                    onPress={() => toggleDeleteDevice(item.id, item.isDeleted)}
                >
                    <Text
                        style={styles.actionButtonText}>{item.isDeleted ? t('common.restore') : t('common.delete')}</Text>
                </TouchableOpacity>

                {!item.isDeleted && (
                    <TouchableOpacity
                        style={[styles.actionButton, {backgroundColor: theme.primary}]}
                        onPress={() => navigation.navigate('DeviceForm', {propertyId, device: item})}
                    >
                        <Text style={styles.actionButtonText}>{t('common.edit')}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    ), [navigation, propertyId, toggleDeleteDevice, theme, t]);

    if (isError) {
        return (
            <View style={[styles.center, {backgroundColor: theme.background}]}>
                <Text style={{color: theme.text}}>{t('common.error')}</Text>
                <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: theme.primary, marginTop: 10}]}
                    onPress={() => refetch()}
                >
                    <Text style={styles.actionButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <FlatList
                ListHeaderComponent={
                    <View style={[styles.header, {backgroundColor: theme.surface, borderBottomColor: theme.border}]}>
                        {isPropertyLoading ? (
                            <ActivityIndicator color={theme.primary}/>
                        ) : (
                            <>
                                <Text style={[styles.title, {color: theme.text}]}>{property?.name || 'Property'}</Text>
                                <Text
                                    style={[styles.address, {color: theme.subtext}]}>{t('property.address')}: {property?.address}</Text>
                            </>
                        )}
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, {color: theme.text}]}>{t('property.devices')}</Text>
                            <View style={styles.filterRow}>
                                <Text
                                    style={[styles.filterLabel, {color: theme.subtext}]}>{t('property.show_deleted')}</Text>
                                <Switch
                                    value={showDeleted}
                                    onValueChange={setShowDeleted}
                                    style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
                                />
                            </View>
                        </View>
                    </View>
                }
                data={filteredDevices}
                renderItem={renderDeviceItem}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl refreshing={isDevicesLoading} onRefresh={refetch} tintColor={theme.primary}/>
                }
                ListEmptyComponent={
                    !isDevicesLoading && (
                        <View style={styles.emptyDeviceBox}>
                            <Text style={[styles.emptyText, {color: theme.subtext}]}>{t('common.noData')}</Text>
                        </View>
                    )
                }
                contentContainerStyle={styles.listContent}
            />

            <TouchableOpacity
                style={[styles.addButton, {backgroundColor: theme.secondary}]}
                onPress={() => navigation.navigate('DeviceForm', {propertyId})}
            >
                <Text style={styles.addButtonText}>+ {t('property.add_device')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1},
    center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    listContent: {paddingBottom: 100},
    header: {padding: 20, borderBottomWidth: 1},
    title: {fontSize: 22, fontWeight: 'bold'},
    address: {fontSize: 16, marginTop: 5, marginBottom: 15},
    sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10},
    sectionTitle: {fontSize: 20, fontWeight: 'bold'},
    filterRow: {flexDirection: 'row', alignItems: 'center'},
    filterLabel: {fontSize: 12, marginRight: 5},

    deviceCard: {marginHorizontal: 15, marginTop: 15, borderRadius: 12, padding: 15, elevation: 2},
    deletedText: {textDecorationLine: 'line-through', color: '#aaa'},
    deviceHeader: {flexDirection: 'row', alignItems: 'center'},
    deviceIcon: {fontSize: 30, marginRight: 15},
    deviceInfo: {flex: 1},
    deviceName: {fontSize: 18, fontWeight: 'bold'},
    lastCapture: {fontSize: 12, marginTop: 2},

    statusBadge: {paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10},
    statusText: {color: '#fff', fontSize: 10, fontWeight: 'bold'},

    deviceImage: {width: '100%', height: 150, borderRadius: 8, marginTop: 15},
    deviceActions: {marginTop: 10, borderTopWidth: 1, paddingTop: 10, flexDirection: 'row', justifyContent: 'flex-end'},
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
        justifyContent: 'center'
    },
    actionButtonText: {color: '#fff', fontSize: 12, fontWeight: 'bold'},

    emptyDeviceBox: {padding: 40, alignItems: 'center'},
    emptyText: {fontSize: 14},

    addButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5
    },
    addButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default PropertyDetailScreen;