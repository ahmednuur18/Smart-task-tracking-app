import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
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

/* ---------- screen ---------- */
export default function SettingsScreen() {
  const router = useRouter();
  const { theme, colors, toggleTheme } = useTheme();

  const [profile, setProfile] = useState<User | null>(null);

  /* load profile same way as TodayTasks */
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 32,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ width: 48 }}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
          }}
        >
          Settings
        </Text>

        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Profile Card */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 18,
            backgroundColor: colors.background,
            marginBottom: 24,
          }}
        >
          {profile?.avatar ? (
            <TouchableOpacity
            >
              <Image
                source={AVATARS[profile.avatar]}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  marginRight: 16,
                }}
              />
            </TouchableOpacity>
          ) : (
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#ccc',
                marginRight: 16,
              }}
            />
          )}

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
              }}
            >
              {profile?.username}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: colors.icon,
                marginVertical: 4,
              }}
            >
              {profile?.email}
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/(profile)/switch_profile')}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.text,
                  marginRight: 4,
                }}
              >
                Manage Account
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={18}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Appearance */}
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

        {/* Account */}
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

        {/* Support */}
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

function Section({ title, children, colors }: any) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          marginBottom: 8,
          color: colors.text,
        }}
      >
        {title}
      </Text>

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

      <Text style={{ flex: 1, fontSize: 16, color: colors.text }}>
        {label}
      </Text>

      {right ?? (
        <MaterialIcons
          name="chevron-right"
          size={22}
          color={colors.icon}
        />
      )}
    </TouchableOpacity>
  );
}
