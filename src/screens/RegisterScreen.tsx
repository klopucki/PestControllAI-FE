import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({navigation}: Props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {theme} = useTheme();

    const handleRegister = () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Błąd', 'Hasła nie są identyczne');
            return;
        }

        Alert.alert('Sukces', 'Konto zostało utworzone!', [
            {text: 'OK', onPress: () => navigation.navigate('Login')}
        ]);
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, {backgroundColor: theme.background}]}>
            <Text style={[styles.title, {color: theme.text}]}>Dołącz do PestGuard 🛡️</Text>
            <Text style={[styles.subtitle, {color: theme.subtext}]}>Chroń swój dom przed szkodnikami</Text>

            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="Imię i nazwisko"
                placeholderTextColor={theme.subtext}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="E-mail"
                placeholderTextColor={theme.subtext}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="Hasło"
                placeholderTextColor={theme.subtext}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={[styles.input, {backgroundColor: theme.surface, color: theme.text, borderColor: theme.border}]}
                placeholder="Powtórz hasło"
                placeholderTextColor={theme.subtext}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity style={[styles.registerButton, {backgroundColor: theme.secondary}]}
                              onPress={handleRegister}>
                <Text style={styles.buttonText}>Zarejestruj się</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={[styles.linkText, {color: theme.primary}]}>Masz już konto? Zaloguj się</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {flexGrow: 1, justifyContent: 'center', padding: 20},
    title: {fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center'},
    subtitle: {fontSize: 16, textAlign: 'center', marginBottom: 30},
    input: {borderWidth: 1, padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16},
    registerButton: {padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10},
    buttonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
    linkText: {marginTop: 20, textAlign: 'center'},
});

export default RegisterScreen;