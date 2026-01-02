import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/constants/ThemeContext';

/* ---------- constants ---------- */
const USERS_KEY = 'APP_USERS';
const CURRENT_USER = 'CURRENT_USER';

const AVATARS: Record<string, any> = {
  male1: require('../avatar/male1.png'),
  female1: require('../avatar/female1.png'),
};

type User = {
  username: string;
  email: string;
  avatar?: string;
};

/* ---------- main screen ---------- */
export default function SettingsScreen() {
  const router = useRouter();
  const { theme, colors, toggleTheme } = useTheme();

  const [profile, setProfile] = useState<User | null>(null);

  /* Load user profile from AsyncStorage */
  const loadProfile = async () => {
    const email = await AsyncStorage.getItem(CURRENT_USER);
    if (!email) return;

    const raw = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = raw ? JSON.parse(raw) : [];
    const found = users.find(u => u.email === email);

    if (found) setProfile(found);
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>

        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          {profile?.avatar ? (
            <TouchableOpacity>
              <Image
                source={AVATARS[profile.avatar]}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={36} color="#fff" />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={[styles.username, { color: colors.text }]}>
              {profile?.username || 'Guest User'}
            </Text>
            <Text style={[styles.email, { color: colors.icon }]}>
              {profile?.email || 'No email available'}
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/(profile)/switch_profile')}
              style={styles.manageBtn}
            >
              <Text style={[styles.manageBtnText, { color: '#23C762' }]}>
                Manage Account
              </Text>
              <MaterialIcons name="chevron-right" size={18} color="#23C762" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Appearance Section */}
        <Section title="Appearance" colors={colors}>
          <Row
            icon="dark-mode"
            label="Dark Mode"
            colors={colors}
            right={
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#e5e7eb', true: '#23c762' }}
                thumbColor="#fff"
              />
            }
          />
        </Section>

        {/* Account Section */}
        <Section title="Account" colors={colors}>
          <Row
            icon="person"
            label="Profile Details"
            colors={colors}
            onPress={() => router.push('/(profile)/profile')}
          />
          <Row
            icon="lock"
            label="Change Password"
            colors={colors}
            onPress={() => router.push('/(settings)/change_password')}
          />
        </Section>

        {/* Support Section */}
        <Section title="Support" colors={colors}>
          <Row
            icon="help-outline"
            label="Help & FAQ"
            colors={colors}
            onPress={() => router.push('/(settings)/support')}
          />
          <Row
            icon="policy"
            label="Privacy Policy"
            colors={colors}
            onPress={() => router.push('/(settings)/privacy_policy')}
          />
        </Section>
      </ScrollView>
    </View>
  );
}

/* ---------- reusable components ---------- */

/* Section groups rows under a title */
function Section({ title, children, colors }: any) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View
        style={{
          backgroundColor: colors.background,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  );
}

/* Row displays an icon, label, and optional right element */
function Row({ icon, label, right, colors, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 0.5,
        borderColor: colors.icon,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
          marginRight: 12,
        }}
      >
        <MaterialIcons name={icon} size={22} color={colors.icon} />
      </View>

      <Text style={{ flex: 1, fontSize: 16, color: colors.text }}>{label}</Text>

      {right ?? <MaterialIcons name="chevron-right" size={22} color={colors.icon} />}
    </TouchableOpacity>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  headerBtn: { width: 48 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#23C762',
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ccc',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: { fontSize: 20, fontWeight: '700' },
  email: { fontSize: 14, marginVertical: 4 },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
  },
  manageBtnText: { fontSize: 14, fontWeight: '600' },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
