import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';

type User = {
  username: string;
  email: string;
  password: string;
  avatar?: string; // avatar KEY
};

const USERS_KEY = 'APP_USERS';
const CURRENT_USER = 'CURRENT_USER';
const TASK_KEY_PREFIX = 'TODAY_TASKS_';

/* ---------------- AVATARS ---------------- */
const AVATARS: Record<string, any> = {
  male1: require('../avatar/male1.png'),
  female1: require('../avatar/female1.png'),
};

export default function SwitchProfileScreen() {
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [removeTarget, setRemoveTarget] = useState<User | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await AsyncStorage.getItem(USERS_KEY);
    setUsers(data ? JSON.parse(data) : []);
  };

  const switchAccount = async (user: User) => {
    Animated.sequence([
      Animated.timing(animScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(animScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(async () => {
      await AsyncStorage.setItem(CURRENT_USER, user.email);
      router.replace('/(profile)/profile');
    });
  };

 const removeAccount = async () => {
  if (!removeTarget) return;

  const updatedUsers = users.filter(
    u => u.email !== removeTarget.email
  );

  setUsers(updatedUsers);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  await AsyncStorage.removeItem(TASK_KEY_PREFIX + removeTarget.email);

  const current = await AsyncStorage.getItem(CURRENT_USER);
  if (current === removeTarget.email) {
    await AsyncStorage.removeItem(CURRENT_USER);
    router.replace('/');
  }

  setRemoveTarget(null);
};


  const renderItem = ({ item }: { item: User }) => (
    <Animated.View style={{ transform: [{ scale: animScale }] }}>
      <Pressable
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => !removeTarget && switchAccount(item)}
        onPressIn={() => {
          timerRef.current = setTimeout(() => setRemoveTarget(item), 1000);
        }}
        onPressOut={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
        }}
      >
        <View style={styles.row}>
          <Image
            source={AVATARS[item.avatar || 'male1']}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.username, { color: colors.text }]}>
              {item.username}
            </Text>
            <Text style={[styles.email, { color: colors.icon }]}>
              {item.email}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Switch Profile</Text>

      <FlatList
        data={users}
        keyExtractor={item => item.email}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      />

      {/* Remove Modal */}
      <Modal visible={!!removeTarget} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setRemoveTarget(null)}>
          <View style={styles.modalBackground}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalText, { color: colors.text }]}>
                Remove account {removeTarget?.username}?
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.icon,
                  marginBottom: 20,
                  textAlign: 'center',
                }}
              >
                this will delete all associated data.
              </Text>

              <View style={styles.modalButtons}>
                <Pressable onPress={() => setRemoveTarget(null)}>
                  <Text style={{ color: '#3b82f6', fontWeight: '700' }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={removeAccount}>
                  <Text style={{ color: '#ef4444', fontWeight: '700' }}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 24 },
  card: { padding: 14, borderRadius: 14, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  username: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 13, marginTop: 2 },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: { borderRadius: 14, padding: 20, width: '80%' },
  modalText: { fontSize: 16, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
});
