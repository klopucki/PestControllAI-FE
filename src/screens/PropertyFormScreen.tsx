import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Property, RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PropertyForm'>;

const PropertyFormScreen = ({navigation, route}: Props) => {
    const propertyToEdit = route.params?.property;
    const isEditing = !!propertyToEdit;
    const {theme} = useTheme();

    const [name, setName] = useState(propertyToEdit?.name || '');
    const [address, setAddress] = useState(propertyToEdit?.address || '');
    const [description, setDescription] = useState(propertyToEdit?.description || '');

    const handleSave = () => {
        if (!name || !address) {
            Alert.alert('Błąd', 'Nazwa i adres są wymagane');
            return;
        }

        const savedProperty: Property = {
            id: propertyToEdit?.id || Math.random().toString(),
            name,
            address,
            description,
            isDeleted: propertyToEdit?.isDeleted || false,
        };

        navigation.goBack();
    };

    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.background}]}>
            <Text style={[styles.label, {color: theme.text}]}>Nazwa posesji</Text>
            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="np. Mieszkanie w Warszawie"
                placeholderTextColor={theme.subtext}
                value={name}
                onChangeText={setName}
            />

            <Text style={[styles.label, {color: theme.text}]}>Adres</Text>
            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="ul. Sezamkowa 1, 00-001"
                placeholderTextColor={theme.subtext}
                value={address}
                onChangeText={setAddress}
            />

            <Text style={[styles.label, {color: theme.text}]}>Dodatkowe informacje</Text>
            <TextInput
                style={[styles.input, styles.textArea, {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border
                }]}
                placeholder="np. Opis szkodników, kody do bramy..."
                placeholderTextColor={theme.subtext}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

            <TouchableOpacity style={[styles.saveButton, {backgroundColor: theme.primary}]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{isEditing ? 'Zapisz zmiany' : 'Dodaj posesję'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    label: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
    input: {borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16},
    textArea: {height: 100, textAlignVertical: 'top'},
    saveButton: {padding: 15, borderRadius: 8, alignItems: 'center'},
    saveButtonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
});

export default PropertyFormScreen;