import React, {useCallback, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    Modal
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Property, RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {propertyApi} from '../api/propertyApi';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const PropertyListScreen = ({navigation}: Props) => {
    const [showDeleted, setShowDeleted] = useState(false);
    const {theme} = useTheme();
    const {t} = useTranslation();
    const queryClient = useQueryClient();

    const {
        data: properties = [],
        isLoading,
        isFetching,
        isError,
        refetch
    } = useQuery({
        queryKey: ['properties'],
        queryFn: propertyApi.getAll,
    });

    const toggleDeleteMutation = useMutation({
        mutationFn: ({id, isDeleted}: { id: string, isDeleted: boolean }) =>
            propertyApi.updateStatus(id, isDeleted),
        onSuccess: async () => {
            // TODO: Consider adding a small delay if CQRS Read Model is very slow
            await queryClient.invalidateQueries({queryKey: ['properties']});
        }
    });

    const filteredProperties = properties.filter(p => showDeleted || !p.isDeleted);

    const toggleDelete = useCallback((id: string, currentDeleted: boolean) => {
        toggleDeleteMutation.mutate({id, isDeleted: !currentDeleted});
    }, [toggleDeleteMutation]);

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
                    onPress={() => toggleDelete(item.id, item.isDeleted)}
                    disabled={toggleDeleteMutation.isPending}
                    style={[
                        styles.deleteButton,
                        {backgroundColor: theme.error},
                        item.isDeleted && styles.restoreButton,
                        toggleDeleteMutation.isPending && { opacity: 0.5 }
                    ]}
                >
                    <Text style={styles.buttonText}>{item.isDeleted ? t('common.restore') : t('common.delete')}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    ), [navigation, toggleDelete, theme, t, toggleDeleteMutation.isPending]);

    if (isError) {
        return (
            <View style={[styles.center, {backgroundColor: theme.background}]}>
                <Text style={{color: theme.text}}>{t('common.error')}</Text>
                <TouchableOpacity
                    style={[styles.editButton, {backgroundColor: theme.primary, marginTop: 10}]}
                    onPress={() => refetch()}
                >
                    <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            {/* Full screen loader for initial fetch or CQRS sync */}
            <Modal transparent visible={isFetching && properties.length === 0} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.loaderCard, { backgroundColor: theme.surface }]}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={[styles.loaderText, { color: theme.text }]}>Syncing data...</Text>
                    </View>
                </View>
            </Modal>

            <View style={[styles.filterContainer, {backgroundColor: theme.surface, borderBottomColor: theme.border}]}>
                <Text style={[styles.filterLabel, {color: theme.text}]}>{t('property.show_deleted')}</Text>
                <Switch value={showDeleted} onValueChange={setShowDeleted}/>
            </View>

            <FlatList
                data={filteredProperties}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={theme.primary}/>
                }
                ListEmptyComponent={
                    !isFetching && (
                        <Text style={[styles.emptyText, {color: theme.subtext}]}>{t('common.noData')}</Text>
                    )
                }
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
    center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loaderCard: {
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 5
    },
    loaderText: {
        marginTop: 15,
        fontWeight: 'bold'
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1
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
    emptyText: {textAlign: 'center', marginTop: 50},
});

export default PropertyListScreen;