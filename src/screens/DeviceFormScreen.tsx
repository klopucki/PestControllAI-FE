import React, {useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Device, DeviceType, RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceForm'>;

const DEVICE_TYPES: { label: string, value: DeviceType, icon: string }[] = [
    {label: 'Kamera', value: 'camera', icon: '📷'},
    {label: 'Mikrofon', value: 'microphone', icon: '🎤'},
    {label: 'Czujnik Ruchu', value: 'sensor', icon: '📡'},
    {label: 'Pułapka', value: 'trap', icon: '🪤'},
];

const DeviceFormScreen = ({navigation, route}: Props) => {
    const {propertyId, device} = route.params;
    const isEditing = !!device;
    const {theme} = useTheme();

    const [name, setName] = useState(device?.name || '');
    const [type, setType] = useState<DeviceType>(device?.type || 'camera');
    const [imageUri, setImageUri] = useState(device?.imageUri || '');

    const handleSave = () => {
        if (!name) {
            Alert.alert('Błąd', 'Nazwa urządzenia jest wymagana');
            return;
        }

        const savedDevice: Device = {
            id: device?.id || Math.random().toString(),
            propertyId,
            name,
            type,
            imageUri,
            status: device?.status || 'active',
            isListening: device?.isListening || true,
            isDeleted: device?.isDeleted || false,
            lastCaptureDate: device?.lastCaptureDate || new Date().toISOString(),
        };

        navigation.goBack();
    };

    const mockPickImage = () => {
        const mockUris = [
            'https://via.placeholder.com/300x200.png?text=Ujecie+z+kamery+1',
            'https://via.placeholder.com/300x200.png?text=Ujecie+z+kamery+2',
        ];
        setImageUri(mockUris[Math.floor(Math.random() * mockUris.length)]);
    };

    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.background}]}>
            <Text style={[styles.label, {color: theme.text}]}>Nazwa urządzenia</Text>
            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="np. Kamera w Spiżarni"
                placeholderTextColor={theme.subtext}
                value={name}
                onChangeText={setName}
            />

            <Text style={[styles.label, {color: theme.text}]}>Typ urządzenia</Text>
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
                    >
                        <Text style={styles.typeIcon}>{item.icon}</Text>
                        <Text style={[
                            styles.typeLabel,
                            {color: theme.subtext},
                            type === item.value && {color: theme.primary, fontWeight: 'bold'}
                        ]}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={[styles.label, {color: theme.text}]}>Zdjęcie / Podgląd</Text>
            {imageUri ? (
                <Image source={{uri: imageUri}} style={styles.previewImage}/>
            ) : (
                <View style={[styles.emptyPreview, {backgroundColor: theme.surface, borderColor: theme.border}]}>
                    <Text style={{color: theme.subtext}}>Brak zdjęcia</Text>
                </View>
            )}

            <TouchableOpacity style={styles.imageButton} onPress={mockPickImage}>
                <Text
                    style={[styles.imageButtonText, {color: theme.primary}]}>{imageUri ? 'Zmień zdjęcie' : 'Dodaj zdjęcie (Mock)'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveButton, {backgroundColor: theme.secondary}]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{isEditing ? 'Zapisz zmiany' : 'Dodaj urządzenie'}</Text>
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
    saveButton: {padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 40},
    saveButtonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
});

export default DeviceFormScreen;