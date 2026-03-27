import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PropertyListScreen from '../screens/PropertyListScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';
import PropertyFormScreen from '../screens/PropertyFormScreen';
import DeviceFormScreen from '../screens/DeviceFormScreen';
import DeviceDetailScreen from '../screens/DeviceDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {RootStackParamList} from './types';
import {useTheme} from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
    const {theme, isDark} = useTheme();
    const {t} = useTranslation();

    const MyTheme = {
        ...(isDark ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
            primary: theme.primary,
            background: theme.background,
            card: theme.surface,
            text: theme.text,
            border: theme.border,
        },
    };

    return (
        <NavigationContainer theme={MyTheme}>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: {backgroundColor: theme.primary},
                    headerTintColor: '#fff',
                    headerTitleStyle: {fontWeight: 'bold'},
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{title: t('auth.register')}}
                />
                <Stack.Screen
                    name="Home"
                    component={PropertyListScreen}
                    options={({navigation}) => ({
                        title: t('navigation.home'),
                        headerLeft: () => null,
                        headerRight: () => (
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={styles.headerIcon}
                                    onPress={() => navigation.navigate('Notifications')}
                                >
                                    <Text style={styles.bellIcon}>🔔</Text>
                                    <View style={[styles.badge, {backgroundColor: theme.notificationBadge}]}><Text
                                        style={styles.badgeText}>3</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.headerIcon}
                                    onPress={() => navigation.navigate('Settings')}
                                >
                                    <Text style={{ fontSize: 22 }}>⚙️</Text>
                                </TouchableOpacity>
                            </View>
                        ),
                    })}
                />
                <Stack.Screen
                    name="PropertyDetail"
                    component={PropertyDetailScreen}
                    options={({navigation, route}) => ({
                        title: t('navigation.details'),
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Statistics', {propertyId: route.params.propertyId})}
                                style={{marginRight: 10}}
                            >
                                <Text style={{fontSize: 20}}>📊</Text>
                            </TouchableOpacity>
                        )
                    })}
                />
                <Stack.Screen
                    name="PropertyForm"
                    component={PropertyFormScreen}
                    options={({route}) => ({
                        title: route.params?.property ? t('navigation.edit_property') : t('navigation.add_property')
                    })}
                />
                <Stack.Screen
                    name="DeviceForm"
                    component={DeviceFormScreen}
                    options={({route}) => ({
                        title: route.params?.device ? t('common.edit') : t('property.add_device')
                    })}
                />
                <Stack.Screen
                    name="DeviceDetail"
                    component={DeviceDetailScreen}
                    options={({navigation, route}) => ({
                        title: route.params?.device?.name || t('navigation.details'),
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Statistics', {deviceId: route.params.device.id})}
                                style={{marginRight: 10}}
                            >
                                <Text style={{fontSize: 20}}>📊</Text>
                            </TouchableOpacity>
                        )
                    })}
                />
                <Stack.Screen
                    name="Notifications"
                    component={NotificationsScreen}
                    options={{title: t('navigation.notifications')}}
                />
                <Stack.Screen
                    name="Statistics"
                    component={StatisticsScreen}
                    options={{title: t('navigation.statistics')}}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{title: 'Settings'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    headerIcon: {padding: 5, marginRight: 10},
    bellIcon: {fontSize: 22},
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff'
    },
    badgeText: {color: '#fff', fontSize: 10, fontWeight: 'bold'},
});

export default RootNavigator;