
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

/*
Defines the structure of a user object.

TypeScript uses this to:
- Know what properties a user must have
- Help catch errors while coding
*/
type User = {
  username: string;
  email: string;
  password: string;
};

/*
Key name used in AsyncStorage.

AsyncStorage works like:
- A key-value database
- Similar to localStorage in web
*/
const STORAGE_KEY = 'APP_USERS';

/* Main theme color */
const PRIMARY = '#23c762';

export default function ForgotScreen() {

  /*
  useState creates state variables.

  Each state has:
  - a value (email, password, etc.)
  - a setter function (setEmail, setOldPassword, etc.)

  When state changes → UI re-renders
  */
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [canReset, setCanReset] = useState(false);

  /*
  Reads users from AsyncStorage.

  Important concepts:
  - async: allows using await inside this function
  - await: pauses code until AsyncStorage finishes
  - AsyncStorage.getItem: reads data as STRING
  - JSON.parse: converts string → JavaScript object
  */
  const getUsers = async (): Promise<User[]> => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    /*
    If data exists:
    - JSON.parse turns text into array of users

    If data does not exist:
    - return empty array
    */
    return stored ? JSON.parse(stored) : [];
  };

  /*
  Verifies old password before allowing reset.

  What happens here:
  1. Check input fields
  2. Find user by email
  3. Compare old password with saved password
  */
  const checkOldPassword = async () => {

    /* Basic validation */
    if (!email || !oldPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    /* Get all users */
    const users = await getUsers();

    /*
    .find() explanation:
    - Loops through users array
    - Returns the FIRST user that matches condition
    - Returns undefined if not found
    */
    const user = users.find(u => u.email === email);

    if (!user) {
      Alert.alert('Error', 'Email not found');
      return;
    }

    /*
    Password similarity logic.

    Goal:
    - Allow reset even if user remembers most of password
    - 60% similarity required
    */

    let matches = 0;

    /*
    Math.max:
    - Used to calculate similarity percentage safely
    */
    const len = Math.max(oldPassword.length, user.password.length);

    /*
    Loop compares characters one by one
    */
    for (let i = 0; i < Math.min(oldPassword.length, user.password.length); i++) {
      if (oldPassword[i] === user.password[i]) matches++;
    }

    /*
    matches / len gives similarity percentage
    */
    if (matches / len >= 0.6) {
      setCanReset(true);
      Alert.alert('Verified', 'You can now set a new password');
    } else {
      Alert.alert('Error', 'Old password incorrect');
    }
  };

  /*
  Handles final password reset.

  What it does:
  - Validates new password
  - Updates correct user
  - Saves updated list back to storage
  */
  const handleReset = async () => {

    /* Password length validation */
    if (!newPassword || newPassword.length < 7) {
      Alert.alert('Error', 'Password must be at least 7 characters');
      return;
    }

    /*
    Prevent using same password again
    */
    if (newPassword === oldPassword) {
      Alert.alert(
        'Invalid Password',
        'New password cannot be the same as your old password'
      );
      return;
    }

    const users = await getUsers();

    /*
    .map() explanation:
    - Loops through ALL users
    - Returns a NEW array
    - Updates only the matching user

    {...u} (spread operator):
    - Copies all existing properties of user
    - Prevents mutation (safe update)
    */
    const updatedUsers = users.map(u =>
      u.email === email ? { ...u, password: newPassword } : u
    );

    /*
    JSON.stringify:
    - Converts JS object → string
    - AsyncStorage can ONLY store strings
    */
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));

    Alert.alert('Success', 'Password updated successfully');

    /* Navigate back to login screen */
    router.replace('/');
  };

  /*
  UI Rendering.

  Conditional rendering used here:
  - !canReset → show old password verification
  - canReset → show new password input
  */
  return (
    <ScrollView contentContainerStyle={[styles.root,{justifyContent:'center'}]}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={[styles.label, {marginTop:25}]}>Email</Text>
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
