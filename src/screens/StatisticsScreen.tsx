import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useTheme} from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Statistics'>;

const StatisticsScreen = ({route}: Props) => {
    const {propertyId, deviceId} = route.params;
    const {theme} = useTheme();

    // Mock data for statistics
    const stats = {
        totalDetections: 42,
        alertsLastWeek: 7,
        mostActiveTime: '22:00 - 02:00',
        activityByDay: [5, 8, 3, 12, 6, 4, 4], // Mon-Sun
    };

    const days = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
    const maxDayValue = Math.max(...stats.activityByDay);

    return (
        <ScrollView style={[styles.container, {backgroundColor: theme.background}]}>
            <View style={[styles.header, {backgroundColor: theme.surface}]}>
                <Text style={[styles.title, {color: theme.text}]}>
                    {deviceId ? 'Statystyki Urządzenia' : propertyId ? 'Statystyki Posesji' : 'Statystyki Ogólne'}
                </Text>
                <Text style={[styles.subtitle, {color: theme.subtext}]}>Ostatnie 7 dni</Text>
            </View>

            <View style={styles.statsGrid}>
                <View style={[styles.statBox, {backgroundColor: theme.surface}]}>
                    <Text style={[styles.statValue, {color: theme.primary}]}>{stats.totalDetections}</Text>
                    <Text style={[styles.statLabel, {color: theme.subtext}]}>Wykryć (łącznie)</Text>
                </View>
                <View style={[styles.statBox, {backgroundColor: theme.surface}]}>
                    <Text style={[styles.statValue, {color: theme.error}]}>{stats.alertsLastWeek}</Text>
                    <Text style={[styles.statLabel, {color: theme.subtext}]}>Alerty (7 dni)</Text>
                </View>
            </View>

            <View style={[styles.chartContainer, {backgroundColor: theme.surface}]}>
                <Text style={[styles.sectionTitle, {color: theme.text}]}>Aktywność w tygodniu</Text>
                <View style={styles.barChart}>
                    {stats.activityByDay.map((value, index) => (
                        <View key={index} style={styles.barWrapper}>
                            <View
                                style={[
                                    styles.bar,
                                    {height: (value / maxDayValue) * 100, backgroundColor: theme.primary}
                                ]}
                            />
                            <Text style={[styles.barLabel, {color: theme.subtext}]}>{days[index]}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={[styles.infoCard, {backgroundColor: theme.surface, borderLeftColor: theme.secondary}]}>
                <Text style={[styles.infoTitle, {color: theme.text}]}>Analiza AI 🤖</Text>
                <Text style={[styles.infoText, {color: theme.text}]}>
                    Największa aktywność szkodników występuje w godzinach <Text
                    style={[styles.bold, {color: theme.text}]}>{stats.mostActiveTime}</Text>.
                    Zalecamy sprawdzenie pułapek w <Text style={[styles.bold, {color: theme.text}]}>Czwartek</Text> rano
                    ze względu na pik aktywności.
                </Text>
            </View>

            <View style={[styles.infoCard, {backgroundColor: theme.surface, borderLeftColor: theme.primary}]}>
                <Text style={[styles.infoTitle, {color: theme.text}]}>Skuteczność</Text>
                <View style={styles.row}>
                    <Text style={[styles.statLabel, {color: theme.subtext}]}>Poprawność detekcji:</Text>
                    <Text style={[styles.bold, {color: theme.text}]}>94%</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.statLabel, {color: theme.subtext}]}>Czas reakcji systemu:</Text>
                    <Text style={[styles.bold, {color: theme.text}]}>1.2s</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1},
    header: {padding: 20},
    title: {fontSize: 22, fontWeight: 'bold'},
    subtitle: {fontSize: 14, marginTop: 4},

    statsGrid: {flexDirection: 'row', padding: 10, justifyContent: 'space-between'},
    statBox: {flex: 1, margin: 5, padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2},
    statValue: {fontSize: 28, fontWeight: 'bold'},
    statLabel: {fontSize: 12, marginTop: 5},

    chartContainer: {margin: 15, padding: 20, borderRadius: 12, elevation: 2},
    sectionTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 20},
    barChart: {flexDirection: 'row', height: 150, alignItems: 'flex-end', justifyContent: 'space-around'},
    barWrapper: {alignItems: 'center', flex: 1},
    bar: {width: 20, borderRadius: 4},
    barLabel: {fontSize: 10, marginTop: 8},

    infoCard: {margin: 15, padding: 20, borderRadius: 12, elevation: 2, borderLeftWidth: 5},
    infoTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 8},
    infoText: {fontSize: 14, lineHeight: 20},
    bold: {fontWeight: 'bold'},
    row: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10},
});

export default StatisticsScreen;
