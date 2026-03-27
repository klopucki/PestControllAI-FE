import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Property, RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// TODO: Replace with real API data
const MOCK_PROPERTIES: Property[] = [
    {
        id: '1',
        name: 'Summer House',
        address: 'Masuria, Sniardwy Lake 5',
        description: 'Pest monitoring for woodworms',
        isDeleted: false
    },
    {
        id: '2',
        name: 'Krakow Apartment',
        address: 'Florianska 10',
        description: 'Motion and temperature sensors',
        isDeleted: false
    },
];

const PropertyListScreen = ({navigation}: Props) => {
    const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
    const [showDeleted, setShowDeleted] = useState(false);
    const {theme, isDark, setMode} = useTheme();
    const {t} = useTranslation();

    const filteredProperties = properties.filter(p => showDeleted || !p.isDeleted);

    const toggleDelete = useCallback((id: string) => {
        setProperties(prev => prev.map(p =>
            p.id === id ? {...p, isDeleted: !p.isDeleted} : p
        ));
    }, []);

    const renderItem = useCallback(({item}: { item: Property }) => (
        <TouchableOpacity
            style={[
                styles.card,
                {backgroundColor: theme.surface},
                item.isDeleted && styles.deletedCard
            ]}
            onPress={() => navigation.navigate('PropertyDetail', {propertyId: item.id})}
        >
            <View style={styles.cardContent}>
                <Text style={[
                    styles.propertyName,
                    {color: theme.text},
                    item.isDeleted && styles.deletedText
                ]}>{item.name}</Text>
                <Text style={[styles.propertyAddress, {color: theme.subtext}]}>{item.address}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('PropertyForm', {property: item})}
                    style={[styles.editButton, {backgroundColor: theme.primary}]}
                >
                    <Text style={styles.buttonText}>{t('common.edit')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => toggleDelete(item.id)}
                    style={[
                        styles.deleteButton,
                        {backgroundColor: theme.error},
                        item.isDeleted && styles.restoreButton
                    ]}
                >
                    <Text style={styles.buttonText}>{item.isDeleted ? t('common.restore') : t('common.delete')}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    ), [navigation, toggleDelete, theme, t]);

    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <View style={[styles.filterContainer, {backgroundColor: theme.surface, borderBottomColor: theme.border}]}>
                <Text style={[styles.filterLabel, {color: theme.text}]}>{t('property.show_deleted')}</Text>
                <Switch value={showDeleted} onValueChange={setShowDeleted}/>
            </View>

            <View style={[styles.themeToggle, {backgroundColor: theme.surface}]}>
                <Text style={{color: theme.text}}>{t('common.darkMode') || 'Dark Mode'}</Text>
                <Switch
                    value={isDark}
                    onValueChange={(val) => setMode(val ? 'dark' : 'light')}
                />
            </View>

            <FlatList
                data={filteredProperties}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />

            <TouchableOpacity
                style={[styles.fab, {backgroundColor: theme.primary}]}
                onPress={() => navigation.navigate('PropertyForm', {})}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1},
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1
    },
    themeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        marginTop: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    filterLabel: {fontSize: 14},
    list: {padding: 10},
    card: {borderRadius: 10, padding: 15, marginBottom: 10, elevation: 3},
    deletedCard: {opacity: 0.5},
    cardContent: {marginBottom: 10},
    propertyName: {fontSize: 18, fontWeight: 'bold'},
    deletedText: {textDecorationLine: 'line-through'},
    propertyAddress: {marginTop: 4},
    actions: {flexDirection: 'row', justifyContent: 'flex-end'},
    editButton: {padding: 8, borderRadius: 5, marginRight: 10},
    deleteButton: {padding: 8, borderRadius: 5},
    restoreButton: {backgroundColor: '#4CD964'},
    buttonText: {color: '#fff', fontSize: 14},
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    fabText: {color: '#fff', fontSize: 30, fontWeight: 'bold'},
});

export default PropertyListScreen;