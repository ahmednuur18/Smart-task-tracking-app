// app/forgot.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type User = {
  username: string;
  email: string;
  password: string;
};

const STORAGE_KEY = 'APP_USERS';
const PRIMARY = '#23c762';

export default function ForgotScreen() {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [canReset, setCanReset] = useState(false);

  const getUsers = async (): Promise<User[]> => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const checkOldPassword = async () => {
    if (!email || !oldPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      Alert.alert('Error', 'Email not found');
      return;
    }

    // 🔐 60% password similarity check
    let matches = 0;
    const len = Math.max(oldPassword.length, user.password.length);

    for (let i = 0; i < Math.min(oldPassword.length, user.password.length); i++) {
      if (oldPassword[i] === user.password[i]) matches++;
    }

    if (matches / len >= 0.6) {
      setCanReset(true);
      Alert.alert('Verified', 'You can now set a new password');
    } else {
      Alert.alert('Error', 'Old password incorrect');
    }
  };

  const handleReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // ❌ new password must not equal old password
    if (newPassword === oldPassword) {
      Alert.alert(
        'Invalid Password',
        'New password cannot be the same as your old password'
      );
      return;
    }

    const users = await getUsers();
    const updatedUsers = users.map(u =>
      u.email === email ? { ...u, password: newPassword } : u
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));

    Alert.alert('Success', 'Password updated successfully');
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="Enter your email"
          style={styles.input}
        />

        {!canReset && (
          <>
            <Text style={styles.label}>Old Password</Text>
            <TextInput
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Enter your last password"
              secureTextEntry
              style={styles.input}
            />

            <Pressable style={styles.button} onPress={checkOldPassword}>
              <Text style={styles.buttonText}>Verify</Text>
            </Pressable>
          </>
        )}

        {canReset && (
          <>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
              style={styles.input}
            />

            <Pressable style={styles.button} onPress={handleReset}>
              <Text style={styles.buttonText}>Set New Password</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: '100%',
    backgroundColor: '#f6f8f7',
  },
  container: {
    padding: 16,
    maxWidth: 420,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 5,
    textAlign: 'center',
  },
  label: {
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 56,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
