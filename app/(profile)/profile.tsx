import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';

type User = {
  username: string;
  email: string;
  password: string;
  avatar?: string;
};

const USERS_KEY = 'APP_USERS';
const CURRENT_USER = 'CURRENT_USER';
const PRIMARY = '#23C762';

/* ---------------- AVATARS ---------------- */
const AVATARS: Record<string, any> = {
  male1: require('../avatar/male1.png'),
  female1: require('../avatar/female1.png'),
};

export default function ProfileScreen() {
  const { colors } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const email = await AsyncStorage.getItem(CURRENT_USER);
    if (!email) return router.replace('/');

    const data = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = data ? JSON.parse(data) : [];
    const found = users.find(u => u.email === email);

    if (found) {
      setUser(found);
      setName(found.username);
      setOriginalName(found.username);
    }
  };

  const saveName = async () => {
    if (!user || name.trim() === originalName) return;

    const data = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = data ? JSON.parse(data) : [];

    const updatedUsers = users.map(u =>
      u.email === user.email ? { ...u, username: name.trim() } : u
    );

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    setUser({ ...user, username: name.trim() });
    setOriginalName(name.trim());
  };

  const logout = async () => {
    await AsyncStorage.removeItem(CURRENT_USER);
    router.replace('/');
  };

  const saveAvatar = async (avatarKey: string) => {
    if (!user) return;

    const data = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = data ? JSON.parse(data) : [];

    const updatedUsers = users.map(u =>
      u.email === user.email ? { ...u, avatar: avatarKey } : u
    );

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    setUser({ ...user, avatar: avatarKey });
    setModalVisible(false);
  };

  if (!user) return null;

  const hasNameChanged = name.trim() !== originalName;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={colors.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Personal
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Profile Avatar */}
     <View style={styles.center}>
  <View
    style={[
      styles.avatarContainer,
      { borderColor: colors.card },
    ]}
  >
    <Image
      source={AVATARS[user.avatar || 'male1']}
      style={styles.avatar}
    />

    <Pressable
      style={[styles.editIcon, { backgroundColor: PRIMARY }]}
      onPress={() => setModalVisible(true)}
    >
      <MaterialIcons name="edit" size={18} color="#fff" />
    </Pressable>
  </View>

  {/* Edit Profile text */}
  <Pressable onPress={() => setModalVisible(true)}>
    <Text
      style={{
        marginTop: 12,
        fontSize: 13,
        fontWeight: '600',
        color: colors.icon,
      }}
    >
      Edit Profile
    </Text>
  </Pressable>
</View>


      {/* Form */}
      <View style={styles.form}>
        {/* Full Name (Editable) */}
        <Text style={[styles.label, { color: colors.text }]}>
          Full Name
        </Text>

        <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: colors.text }]}
            placeholder="Your name"
            placeholderTextColor={colors.icon}
          />
          <MaterialIcons name="person" size={20} color={colors.icon} />
        </View>

        {/* Email (Read-only) */}
        <Text style={[styles.label, { color: colors.text }]}>
          Email Address
        </Text>

        <View
          style={[
            styles.inputWrapper,
            { backgroundColor: colors.card, opacity: 0.7 },
          ]}
        >
          <Text style={{ color: colors.text }}>{user.email}</Text>
          <MaterialIcons name="mail-outline" size={20} color={colors.icon} />
        </View>
      </View>

      {/* Save Changes Button (ONLY when name changed) */}
      {hasNameChanged && (
        <Pressable
          style={[styles.saveBtn, { backgroundColor: PRIMARY }]}
          onPress={saveName}
        >
          <Text style={styles.saveText}>Save Changes</Text>
        </Pressable>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.secondaryBtn, { borderColor: colors.icon }]}
          onPress={() => router.replace('/(profile)/switch_profile')}
        >
          <MaterialIcons name="swap-horiz" size={22} color={colors.text} />
          <Text style={[styles.secondaryText, { color: colors.text }]}>
            Change Profile
          </Text>
        </Pressable>

        <Pressable
          style={[styles.logoutBtn, { backgroundColor: PRIMARY }]}
          onPress={logout}
        >
          <MaterialIcons name="logout" size={22} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>

      {/* Avatar Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalRoot}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Choose Your Avatar
            </Text>

            <FlatList
              data={Object.keys(AVATARS)}
              keyExtractor={item => item}
              horizontal
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => saveAvatar(item)}>
                  <Image source={AVATARS[item]} style={styles.avatarOption} />
                </TouchableOpacity>
              )}
            />

            <Pressable
              style={[styles.modalClose, { backgroundColor: PRIMARY }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 24,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },

  center: {
    alignItems: 'center',
    marginTop: 24,
  },

  avatarContainer: {
    position: 'relative',
    borderWidth: 4,
    borderRadius: 70,
    padding: 4,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 8,
    borderRadius: 20,
  },

  form: {
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },

  inputWrapper: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  saveBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  actions: {
    marginTop: 32,
    paddingHorizontal: 20,
    gap: 12,
  },

  secondaryBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
  },

  secondaryText: {
    fontWeight: '600',
  },

  logoutBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },

  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  modalClose: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
