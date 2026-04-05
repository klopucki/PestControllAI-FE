import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Property, RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {propertyApi} from '../api/propertyApi';
import {useTranslation} from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamList, 'PropertyForm'>;

const PropertyFormScreen = ({navigation, route}: Props) => {
    const propertyToEdit = route.params?.property;
    const isEditing = !!propertyToEdit;
    const {theme} = useTheme();
    const {t} = useTranslation();
    const queryClient = useQueryClient();

    const [name, setName] = useState(propertyToEdit?.name || '');
    const [address, setAddress] = useState(propertyToEdit?.address || '');
    const [description, setDescription] = useState(propertyToEdit?.description || '');

    const mutation = useMutation({
        mutationFn: propertyApi.save,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['properties']});
            navigation.goBack();
        },
        onError: (error) => {
            Alert.alert(t('common.error'), error.message || 'Failed to save property');
        }
    });

    const handleSave = () => {
        if (!name || !address) {
            Alert.alert(t('common.error'), 'Name and address are required');
            return;
        }

        const propertyData: Partial<Property> = {
            id: propertyToEdit?.id,
            name,
            address,
            description,
            isDeleted: propertyToEdit?.isDeleted || false,
        };

        mutation.mutate(propertyData);
    };

    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.background}]}>
            <Text style={[styles.label, {color: theme.text}]}>{t('property.name')}</Text>
            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="e.g. Warsaw Apartment"
                placeholderTextColor={theme.subtext}
                value={name}
                onChangeText={setName}
                editable={!mutation.isPending}
            />

            <Text style={[styles.label, {color: theme.text}]}>{t('property.address')}</Text>
            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="St. Sesame 1, 00-001"
                placeholderTextColor={theme.subtext}
                value={address}
                onChangeText={setAddress}
                editable={!mutation.isPending}
            />

            <Text style={[styles.label, {color: theme.text}]}>{t('property.description')}</Text>
            <TextInput
                style={[styles.input, styles.textArea, {
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border
                }]}
                placeholder="e.g. Pest description, gate codes..."
                placeholderTextColor={theme.subtext}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                editable={!mutation.isPending}
            />

            <TouchableOpacity
                style={[styles.saveButton, {backgroundColor: theme.primary, opacity: mutation.isPending ? 0.7 : 1}]}
                onPress={handleSave}
                disabled={mutation.isPending}
            >
                {mutation.isPending ? (
                    <ActivityIndicator color="#fff"/>
                ) : (
                    <Text style={styles.saveButtonText}>
                        {isEditing ? t('common.save') : t('navigation.add_property')}
                    </Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20},
    label: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
    input: {borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16},
    textArea: {height: 100, textAlignVertical: 'top'},
    saveButton: {padding: 15, borderRadius: 8, alignItems: 'center', minHeight: 55, justifyContent: 'center'},
    saveButtonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
});

export default PropertyFormScreen;