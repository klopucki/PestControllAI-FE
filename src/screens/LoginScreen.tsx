import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';
import {useTranslation} from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {theme, isDark, setMode} = useTheme();
    const {t, i18n} = useTranslation();

    const handleLogin = () => {
        if (email && password) {
            navigation.replace('Home');
        } else {
            Alert.alert(t('common.error'), t('auth.welcome'));
        }
    };

    const toggleLanguage = () => {
        const nextLng = i18n.language === 'pl' ? 'en' : 'pl';
        i18n.changeLanguage(nextLng);
    };

    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <View style={styles.topActions}>
                <TouchableOpacity onPress={toggleLanguage} style={[styles.langButton, {borderColor: theme.primary}]}>
                    <Text style={{color: theme.primary, fontWeight: 'bold'}}>{i18n.language.toUpperCase()}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode(isDark ? 'light' : 'dark')}>
                    <Text style={{fontSize: 20}}>{isDark ? '☀️' : '🌙'}</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.logo, {color: theme.primary}]}>🐞 PestGuard AI</Text>
            <Text style={[styles.title, {color: theme.text}]}>{t('auth.welcome')}</Text>

            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder={t('auth.email')}
                placeholderTextColor={theme.subtext}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder={t('auth.password')}
                placeholderTextColor={theme.subtext}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={[styles.loginButton, {backgroundColor: theme.primary}]} onPress={handleLogin}>
                <Text style={styles.buttonText}>{t('auth.login')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.linkText, {color: theme.primary}]}>{t('auth.no_account')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', padding: 20},
    topActions: {position: 'absolute', top: 50, right: 20, flexDirection: 'row', alignItems: 'center'},
    langButton: {marginRight: 15, padding: 5, borderWidth: 1, borderRadius: 5},
    logo: {fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10},
    title: {fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center'},
    input: {borderWidth: 1, padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16},
    loginButton: {padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10},
    buttonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
    linkText: {marginTop: 20, textAlign: 'center'},
});

export default LoginScreen;