import * as Device from 'expo-device';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const sampleLeads: Lead[] = [
  {
    id: "12101",
    name: "Bob",
    email: "Bob123@gmail.com",
    phone: "1234567891",
    createdAt: "2026-11-15",
  },
  {
    id: "12102",
    name: "Alice",
    email: "Alice123@gmail.com",
    phone: "1234567892",
    createdAt: "2026-11-15",
  }
]

export default function HomeScreen() {

  const [leads, setLeads] = useState<Lead[]>(sampleLeads);

  useEffect(() => {
    const socket = io("http://192.168.1.20:3000")
    socket.on('connect', () => {
      console.log('Connected to backend:', socket.id);
    });
    socket.on('newLead', (leads) => {
      setLeads((prevLeads) => [leads, ...prevLeads]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Live Leads Dashboard
          </ThemedText>
        </ThemedView>

        <ThemedText type="title" style={styles.sectionTitle}>
          Live Leads
        </ThemedText>

        <FlatList 
          style={{width: '100%',flex: 1}}
        
          data={leads}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={styles.leadCard}>
              <ThemedText style={styles.leadName}>{item.name}</ThemedText>
              <ThemedText>{item.email}</ThemedText>
              <ThemedText>{item.phone}</ThemedText>
            </View>
          )}
        />

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  sectionTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 25,
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  leadCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#4d4c4c",
  },
  leadName: {
    fontWeight: 'bold',
    fontSize: 18,
  }
});
