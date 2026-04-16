import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Device, DeviceType, RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deviceApi} from '../api/deviceApi';
import {useTranslation} from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceForm'>;

const DEVICE_TYPES: { labelKey: string, value: DeviceType, icon: string }[] = [
    {labelKey: 'device.camera', value: 'camera', icon: '📷'},
    {labelKey: 'device.microphone', value: 'microphone', icon: '🎤'},
    {labelKey: 'device.sensor', value: 'sensor', icon: '📡'},
    {labelKey: 'device.trap', value: 'trap', icon: '🪤'},
];

const DeviceFormScreen = ({navigation, route}: Props) => {
    const {propertyId, device} = route.params;
    const isEditing = !!device;
    const {theme} = useTheme();
    const {t} = useTranslation();
    const queryClient = useQueryClient();

    const [name, setName] = useState(device?.name || '');
    const [type, setType] = useState<DeviceType>(device?.type || 'camera');
    const [imageUri, setImageUri] = useState(device?.imageUri || '');

    const mutation = useMutation({
        mutationFn: deviceApi.save,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['devices', propertyId]});
            navigation.goBack();
        },
        onError: (error: any) => {
            Alert.alert(t('common.error'), error.message || 'Failed to save device');
        }
    });

    const handleSave = () => {
        if (!name) {
            Alert.alert(t('common.error'), 'Device name is required');
            return;
        }

        const deviceData: Partial<Device> = {
            id: device?.id,
            propertyId: propertyId,
            name,
            type,
            imageUri,
            status: device?.status || 'active',
            isListening: device?.isListening ?? true,
            isDeleted: device?.isDeleted ?? false,
        };

        mutation.mutate(deviceData);
    };

    const mockPickImage = () => {
        const mockUris = [
            'https://via.placeholder.com/300x200.png?text=Camera+Capture+1',
            'https://via.placeholder.com/300x200.png?text=Camera+Capture+2',
        ];
        setImageUri(mockUris[Math.floor(Math.random() * mockUris.length)]);
    };

    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.background}]}>
            <Text style={[styles.label, {color: theme.text}]}>{t('property.name')}</Text>
            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="e.g. Living Room Camera"
                placeholderTextColor={theme.subtext}
                value={name}
                onChangeText={setName}
                editable={!mutation.isPending}
            />

            <Text style={[styles.label, {color: theme.text}]}>Device Type</Text>
            <View style={styles.typeContainer}>
                {DEVICE_TYPES.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        style={[
                            styles.typeButton,
                            {backgroundColor: theme.surface, borderColor: theme.border},
                            type === item.value && {
                                borderColor: theme.primary,
                                backgroundColor: theme.isDark ? '#2c2c2c' : '#eef6ff'
                            }
                        ]}
                        onPress={() => setType(item.value)}
                        disabled={mutation.isPending}
                    >
                        <Text style={styles.typeIcon}>{item.icon}</Text>
                        <Text style={[
                            styles.typeLabel,
                            {color: theme.subtext},
                            type === item.value && {color: theme.primary, fontWeight: 'bold'}
                        ]}>{t(item.labelKey)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={[styles.label, {color: theme.text}]}>Preview Image</Text>
            {imageUri ? (
                <Image source={{uri: imageUri}} style={styles.previewImage}/>
            ) : (
                <View style={[styles.emptyPreview, {backgroundColor: theme.surface, borderColor: theme.border}]}>
                    <Text style={{color: theme.subtext}}>No Image Selected</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.imageButton}
                onPress={mockPickImage}
                disabled={mutation.isPending}
            >
                <Text style={[styles.imageButtonText, {color: theme.primary}]}>
                    {imageUri ? 'Change Image' : 'Add Image (Mock)'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.saveButton, {backgroundColor: theme.secondary, opacity: mutation.isPending ? 0.7 : 1}]}
                onPress={handleSave}
                disabled={mutation.isPending}
            >
                {mutation.isPending ? (
                    <ActivityIndicator color="#fff"/>
                ) : (
                    <Text style={styles.saveButtonText}>
                        {isEditing ? t('common.save') : t('property.add_device')}
                    </Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    label: {fontSize: 16, fontWeight: 'bold', marginBottom: 10},
    input: {borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16},
    typeContainer: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20},
    typeButton: {width: '48%', borderWidth: 1, borderRadius: 10, padding: 15, alignItems: 'center', marginBottom: 10},
    typeIcon: {fontSize: 24, marginBottom: 5},
    typeLabel: {fontSize: 14},
    previewImage: {width: '100%', height: 200, borderRadius: 10, marginBottom: 10},
    emptyPreview: {
        width: '100%',
        height: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderStyle: 'dashed',
        borderWidth: 1
    },
    imageButton: {padding: 10, alignItems: 'center', marginBottom: 30},
    imageButtonText: {fontWeight: 'bold'},
    saveButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 40,
        minHeight: 55,
        justifyContent: 'center'
    },
    saveButtonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
});

export default DeviceFormScreen;