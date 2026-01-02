import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
Defines possible screen modes.
Used to switch between Login and Signup UI.
*/
type Mode = 'login' | 'signup';

/*
Defines how a user object looks.
This structure is saved in AsyncStorage.
*/
type User = {
  username: string;
  email: string;
  password: string;
};

/*
App constants:
- STORAGE_KEY: key for saving users list
- PRIMARY: main app color
- BG: background color
*/
const STORAGE_KEY = 'APP_USERS';
const PRIMARY = '#23c762';
const BG = '#f6f8f7';

export default function AuthScreen() {

  /*
  State management for authentication screen.

  - mode: controls login or signup screen
  - passwordVisible: toggles password visibility
  - username, email, password: store user inputs
  */
  const [mode, setMode] = useState<Mode>('login');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /*
  This effect runs when mode changes (login ↔ signup).

  What it does:
  - Clears all input fields
  - Resets password visibility

  Important:
  - Dependency array [mode] means it runs only when mode changes
  */
  useEffect(() => {
    setUsername('');
    setEmail('');
    setPassword('');
    setPasswordVisible(false);
  }, [mode]);

  /*
  Utility function to validate email format.

  Important:
  - Uses regex to check basic email structure
  - Returns true or false
  */
  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  /*
  Reads all registered users from AsyncStorage.

  What it does:
  - Gets stored user data using STORAGE_KEY
  - Parses JSON if data exists
  - Returns empty array if no users found
  */
  const getUsers = async (): Promise<User[]> => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  /*
  Handles user signup process.

  What it does (general):
  - Validates inputs
  - Prevents duplicate emails
  - Saves new user to storage
  - Logs user in automatically
  - Navigates to main app screen

  Important lines:
  - Input validation using alerts
  - getUsers() to check existing users
  - AsyncStorage.setItem to save users
  - router.replace to move to next screen
  */
  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }

    if (password.length < 7) {
      Alert.alert('Error', 'Password must be at least 7 characters');
      return;
    }

    const users = await getUsers();

    if (users.some(u => u.email === email)) {
      Alert.alert('Error', 'Email already registered');
      return;
    }

    const newUser = { username, email, password };
    users.push(newUser);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    await AsyncStorage.setItem('CURRENT_USER', email);

    Alert.alert('Success', 'Account created successfully');

    router.replace('/(today)/today_task');
  };

  /*
  Handles user login process.

  What it does (general):
  - Checks input fields
  - Verifies email and password
  - Saves logged-in user
  - Navigates to main app screen

  Important lines:
  - users.find() checks credentials
  - CURRENT_USER is saved for session
  - router.replace changes screen
  */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    const users = await getUsers();

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      Alert.alert('Error', 'Incorrect email or password');
      return;
    }

    await AsyncStorage.setItem('CURRENT_USER', user.email);
    router.replace('/(today)/today_task');
  };

  /*
  UI rendering section.

  What it does:
  - Displays logo, title, and subtitle
  - Switches between login and signup UI
  - Shows form inputs
  - Handles navigation and user actions
  */
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.container}>

        <View style={styles.logoWrapper}>
          <View style={styles.logo}>
            <MaterialIcons name="task-alt" size={32} color="#fff" />
          </View>
        </View>
        
        <Text style={styles.title}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </Text>

        <Text style={styles.subtitle}>
          {mode === 'login'
            ? 'Log in to manage your tasks.'
            : 'Sign up to start managing tasks.'}
        </Text>


        <View style={styles.segment}>
          <Pressable
            style={[styles.segmentBtn, mode === 'login' && styles.activeBtn]}
            onPress={() => setMode('login')}
          >
            <Text style={mode === 'login' ? styles.activeText : styles.text}>
              Log In
            </Text>
          </Pressable>

          <Pressable
            style={[styles.segmentBtn, mode === 'signup' && styles.activeBtn]}
            onPress={() => setMode('signup')}
          >
            <Text style={mode === 'signup' ? styles.activeText : styles.text}>
              Sign Up
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          {mode === 'signup' && (
            <>
              <Text style={styles.label}>Username</Text>
              <TextInput
                placeholder="Your name"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />
            </>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              placeholder="••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              style={{ flex: 1 }}
            />
            <Pressable onPress={() => setPasswordVisible(v => !v)}>
              <MaterialIcons
                name={passwordVisible ? 'visibility' : 'visibility-off'}
                size={22}
                color="#9ca3af"
              />
            </Pressable>
          </View>
        </View>


        {mode === 'login' && (
          <Pressable onPress={() => router.push('/forgot')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>
        )}


        <Pressable
          style={styles.button}
          onPress={mode === 'login' ? handleLogin : handleSignup}
        >
          <Text style={styles.buttonText}>
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </Text>
        </Pressable>

      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  root: { minHeight: '100%', backgroundColor: BG },
  container: { maxWidth: 420, alignSelf: 'center', padding: 16 },

  logoWrapper: { alignItems: 'center', marginTop: 40 },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: PRIMARY,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: { fontSize: 30, fontWeight: '700', textAlign: 'center', marginTop: 24 },
  subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: 24 },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    padding: 4,
    marginBottom: 24,
  },
  segmentBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 999 },
  activeBtn: { backgroundColor: '#fff' },
  text: { color: '#6b7280' },
  activeText: { fontWeight: '600' },

  form: { gap: 12 },
  label: { fontWeight: '500' },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    width: 300,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },

  forgot: { color: '#3b82f6', textAlign: 'right', marginTop: 8, marginBottom: 16 },

  button: {
    height: 56,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
