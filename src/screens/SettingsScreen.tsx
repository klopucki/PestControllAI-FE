import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const { theme, isDark, mode, setMode } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'pl' ? 'en' : 'pl';
    i18n.changeLanguage(nextLng);
  };

  const languages = [
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>{t('common.darkMode')}</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>{t('common.darkMode')}</Text>
            <Switch
              value={isDark}
              onValueChange={(val) => setMode(val ? 'dark' : 'light')}
              trackColor={{ false: '#767577', true: theme.secondary }}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Use System Settings</Text>
            <Switch
              value={mode === 'system'}
              onValueChange={(val) => setMode(val ? 'system' : (isDark ? 'dark' : 'light'))}
              trackColor={{ false: '#767577', true: theme.primary }}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Language</Text>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          {languages.map((lang, index) => (
            <React.Fragment key={lang.code}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => i18n.changeLanguage(lang.code)}
              >
                <Text style={[styles.label, { color: theme.text }]}>{lang.flag} {lang.name}</Text>
                {i18n.language === lang.code && (
                  <Text style={{ color: theme.primary, fontWeight: 'bold' }}>✓</Text>
                )}
              </TouchableOpacity>
              {index < languages.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Account</Text>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.surface }]}
          onPress={() => navigation.replace('Login')}
        >
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.error }]}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.versionText, { color: theme.subtext }]}>PestGuard AI v0.1.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginTop: 25, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginLeft: 10 },
  card: { borderRadius: 12, overflow: 'hidden', elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  label: { fontSize: 16 },
  separator: { height: 1, backgroundColor: '#eee', marginHorizontal: 15 },
  versionText: { textAlign: 'center', marginTop: 40, marginBottom: 20, fontSize: 12 }
});

export default SettingsScreen;