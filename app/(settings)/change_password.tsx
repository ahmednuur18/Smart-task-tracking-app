import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'APP_USERS';
const CURRENT_USER = 'CURRENT_USER';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userPassword, setUserPassword] = useState('');

  useEffect(() => {
    loadUserPassword();
  }, []);

  const loadUserPassword = async () => {
    const email = await AsyncStorage.getItem(CURRENT_USER);
    if (!email) return;

    const data = await AsyncStorage.getItem(USERS_KEY);
    const users = data ? JSON.parse(data) : [];
    const user = users.find((u: any) => u.email === email);
    if (user) setUserPassword(user.password);
  };

  const handleChangePassword = async () => {
    if (currentPassword !== userPassword) {
      Alert.alert('Error', 'Current password is incorrect');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'New password cannot be empty');
      return;
    }

    const email = await AsyncStorage.getItem(CURRENT_USER);
    if (!email) return;

    const data = await AsyncStorage.getItem(USERS_KEY);
    const users = data ? JSON.parse(data) : [];

    const updatedUsers = users.map((u: any) =>
      u.email === email ? { ...u, password: newPassword } : u
    );

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    Alert.alert('Success', 'Password changed successfully');
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ width: 48 }}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          placeholder="Current Password"
          placeholderTextColor={colors.text + '99'}
          secureTextEntry
          style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          placeholder="New Password"
          placeholderTextColor={colors.text + '99'}
          secureTextEntry
          style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          placeholder="Confirm New Password"
          placeholderTextColor={colors.text + '99'}
          secureTextEntry
          style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable
          style={[styles.btn, { backgroundColor: '#23c762' }]}
          onPress={handleChangePassword}
        >
          <Text style={styles.btnText}>Change Password</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },

  form: { padding: 16, marginTop: 32 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
