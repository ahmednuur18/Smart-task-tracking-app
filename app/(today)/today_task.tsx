/*
====================================================
TODAY TASKS SCREEN
====================================================

This screen shows all tasks for the current user. Users can see tasks by priority, upcoming, and completed sections. 
It also provides features like searching, category filtering, toggling task completion, reminders, deleting tasks, and opening tasks for editing. 

- React and React Native hooks manage state, side-effects, and refs.
- AsyncStorage stores users and tasks locally.
- Animated and Modal handle notifications and custom delete modal.
- MaterialIcons displays icons for buttons and indicators.
- useTheme applies dynamic colors for light/dark mode.
- CATEGORIES, AVATARS, and constants define UI options.
- Each section below has a detailed explanation of what it does and how it works.
*/

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  Animated,
  Modal,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/constants/ThemeContext';

const PRIMARY = '#23C762';
const TASK_KEY_PREFIX = 'TODAY_TASKS_';
const USERS_KEY = 'APP_USERS';
const CURRENT_USER = 'CURRENT_USER';

const AVATARS: Record<string, any> = {
  male1: require('../avatar/male1.png'),
  female1: require('../avatar/female1.png'),
};

const CATEGORIES = ['All', 'Work', 'Personal', 'Urgent'];

type Task = {
  id: string;
  title: string;
  note?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate: string | null;
  time: string;
};

type User = {
  username: string;
  email: string;
  avatar?: string;
};

/*
====================================================
HELPER FUNCTIONS
====================================================

These functions are reusable utilities to simplify task rendering and logic:

1. formatDate: Converts ISO date string to readable format (e.g., "Mon, 2 Jan") for display.
2. priorityColor: Returns color based on task priority for UI highlighting.
3. getTaskDateTime: Combines a task’s dueDate and time into a single Date object for reminders and comparisons.
*/

const formatDate = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

const priorityColor = (p: Task['priority']) =>
  p === 'high' ? '#ef4444' : p === 'medium' ? '#eab308' : PRIMARY;

const getTaskDateTime = (task: Task) => {
  if (!task.dueDate) return null;
  const d = new Date(task.dueDate);
  const [h, m] = task.time.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};

/*
====================================================
MAIN COMPONENT
====================================================

TodayTasks component manages the entire screen:

- State hooks handle tasks, user profile, search query, selected category, notification banner, and delete modal.
- bannerAnim and showBanner manage the animated notification banner for reminders.
- getTaskKey returns unique AsyncStorage key for the current user.
- loadProfile fetches user info (avatar, username) from storage.
- loadTasks fetches current user's tasks from storage.
- useFocusEffect reloads profile and tasks every time screen is focused.
- Reminder timer checks every 30 seconds for tasks past due and shows banner once.
- toggleTask toggles completion of a task and updates AsyncStorage.
- deleteTask removes a task from list and storage.
- filteredTasks filters by category and search query.
- sortByPriority orders tasks by priority for display.
- priorityTasks, upcomingTasks, doneTasks categorize tasks for sections.
- openTask navigates to task editing screen.
- renderTask displays a single task card with all details, icons, and press actions.
*/

export default function TodayTasks() {
  const { colors } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  /* 🔔 Notification banner animation setup */
  const bannerAnim = useRef(new Animated.Value(-90)).current;
  const [bannerText, setBannerText] = useState('');
  const alertedRef = useRef<Set<string>>(new Set());

  const showBanner = (title: string) => {
    setBannerText(title);
    Animated.sequence([
      Animated.timing(bannerAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(bannerAnim, {
        toValue: -90,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* 🗑 Delete modal state */
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getTaskKey = async () => {
    const email = await AsyncStorage.getItem(CURRENT_USER);
    return email ? TASK_KEY_PREFIX + email : null;
  };

  const loadProfile = async () => {
    const email = await AsyncStorage.getItem(CURRENT_USER);
    if (!email) return;

    const raw = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = raw ? JSON.parse(raw) : [];
    const found = users.find(u => u.email === email);
    if (found) setProfile(found);
  };

  const loadTasks = async () => {
    const key = await getTaskKey();
    if (!key) return;
    const raw = await AsyncStorage.getItem(key);
    setTasks(raw ? JSON.parse(raw) : []);
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
      loadTasks();
    }, [])
  );

  /*
  =====================================================
  REMINDER TIMER
  =====================================================

  Checks every 30 seconds for incomplete tasks that are past due.
  Ensures banner shows only once per task using alertedRef.
  This gives a visual reminder to the user when a task's due date/time is reached.
  */

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      tasks.forEach(task => {
        if (task.completed || alertedRef.current.has(task.id)) return;
        const time = getTaskDateTime(task);
        if (time && now >= time.getTime()) {
          alertedRef.current.add(task.id);
          showBanner(task.title);
        }
      });
    }, 30000);

    return () => clearInterval(timer);
  }, [tasks]);

  /*
  =====================================================
  TASK ACTIONS
  =====================================================

  toggleTask: Toggles task completion and updates storage.
  deleteTask: Deletes selected task and updates storage.
  filteredTasks: Filters tasks by selected category and search query.
  sortByPriority: Sorts tasks by priority for display.
  priorityTasks, upcomingTasks, doneTasks: Categorize tasks for sections.
  openTask: Opens a task in the NewTask screen.
  renderTask: Returns a Pressable card for a single task, with completion toggle, note, due date/time, and styles.
  */

  const toggleTask = async (id: string) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);

    const key = await getTaskKey();
    if (key) await AsyncStorage.setItem(key, JSON.stringify(updated));
  };

  const deleteTask = async () => {
    if (!deleteId) return;
    const filtered = tasks.filter(t => t.id !== deleteId);
    setTasks(filtered);
    setDeleteId(null);

    const key = await getTaskKey();
    if (key) await AsyncStorage.setItem(key, JSON.stringify(filtered));
  };

  const filteredTasks = tasks
    .filter(t => selectedCategory === 'All' || t.category === selectedCategory)
    .filter(t => t.title.toLowerCase().includes(query.toLowerCase()));

  const sortByPriority = (arr: Task[]) => {
    const rank = { high: 3, medium: 2, low: 1 };
    return [...arr].sort((a, b) => rank[b.priority] - rank[a.priority]);
  };

  const priorityTasks = filteredTasks.filter(
    t => !t.completed && t.priority === 'high'
  );
  const upcomingTasks = sortByPriority(
    filteredTasks.filter(t => !t.completed && t.priority !== 'high')
  );
  const doneTasks = filteredTasks.filter(t => t.completed);

  const countCategory = (cat: string) =>
    tasks.filter(t => t.category === cat).length;

  const openTask = (task: Task) => {
    router.push({
      pathname: '/(todo)/new_task',
      params: { id: task.id },
    });
  };

  const renderTask = (task: Task) => (
    <Pressable
      key={task.id}
      onPress={() => openTask(task)}
      onLongPress={() => setDeleteId(task.id)}
      style={[
        styles.card,
        { backgroundColor: colors.card, opacity: task.completed ? 0.6 : 1 },
      ]}
    >
      <Pressable onPress={() => toggleTask(task.id)}>
        <MaterialIcons
          name={task.completed ? 'check-circle' : 'radio-button-unchecked'}
          size={26}
          color={task.completed ? PRIMARY : priorityColor(task.priority)}
        />
      </Pressable>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            task.completed && styles.completed,
          ]}
        >
          {task.title}
        </Text>

        {task.note && (
          <Text style={[styles.note, { color: colors.icon }]}>{task.note}</Text>
        )}

        {!task.completed && task.dueDate && (
          <View style={styles.timeRow}>
            <MaterialIcons name="event" size={14} color={colors.icon} />
            <Text style={{ color: colors.icon, marginLeft: 4 }}>
              {formatDate(task.dueDate)}
            </Text>
            <MaterialIcons
              name="access-time"
              size={14}
              color={colors.icon}
              style={{ marginLeft: 8 }}
            />
            <Text style={{ color: colors.icon, marginLeft: 4 }}>
              {task.time}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  /*
  =====================================================
  UI RENDERING
  =====================================================

  - Animated notification banner slides down when task reminder occurs.
  - Header shows user avatar, screen title, and settings button.
  - Search box filters tasks by title.
  - Categories horizontally scrollable; shows count badge for each category.
  - Task sections display priority, upcoming, and done tasks.
  - Floating Add button navigates to NewTask screen.
  - Delete modal confirms task deletion with Cancel/Remove options.
  */

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.banner,
          { transform: [{ translateY: bannerAnim }] },
        ]}
      >
        <MaterialIcons name="notifications-active" size={22} color="#fff" />
        <Text style={styles.bannerText} numberOfLines={1}>
          {bannerText}
        </Text>
      </Animated.View>

      <View style={styles.header}>
        {profile?.avatar ? (
          <Pressable onPress={() => router.push('/(profile)/profile')}>
            <Image source={AVATARS[profile.avatar]} style={styles.avatar} />
          </Pressable>
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Today’s Tasks
        </Text>

        <Pressable onPress={() => router.push('/(settings)/settings')}>
          <MaterialIcons name="settings" size={28} color={colors.text} />
        </Pressable>
      </View>

      <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
        <MaterialIcons name="search" size={20} color={colors.icon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search tasks"
          placeholderTextColor={colors.icon}
          style={{ flex: 1, color: colors.text }}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {CATEGORIES.map(c => (
          <Pressable
            key={c}
            onPress={() => setSelectedCategory(c)}
            style={[
              styles.categoryBtn,
              { backgroundColor: selectedCategory === c ? PRIMARY : colors.card },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === c ? '#fff' : colors.text },
              ]}
            >
              {c}
            </Text>

            {c !== 'All' && (
              <View style={[styles.countBadge, { backgroundColor: PRIMARY }]}>
                <Text style={[styles.countText, { color: '#fff' }]}>
                  {countCategory(c)}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1, paddingBottom: 630 }}>
        {priorityTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }, {marginLeft:14},]}>
              Priority
            </Text>
            {priorityTasks.map(renderTask)}
          </View>
        )}

        {upcomingTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }, {marginLeft:14},]}>
              Upcoming
            </Text>
            {upcomingTasks.map(renderTask)}
          </View>
        )}

        {doneTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Done
            </Text>
            {doneTasks.map(renderTask)}
          </View>
        )}
      </ScrollView>

      <Pressable
        style={[styles.fab, { backgroundColor: PRIMARY }]}
        onPress={() => router.push('/(todo)/new_task')}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </Pressable>

      <Modal transparent visible={!!deleteId} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Delete task?
            </Text>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setDeleteId(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable onPress={deleteTask}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  root: { flex: 1 },

  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    paddingTop: 28,
    paddingHorizontal: 16,
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 100,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 24,
  },
  headerTitle: { fontSize: 32, fontWeight: '700' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 18,
    height: 44,
    marginBottom: 12,
  },

  categories: { paddingHorizontal: 16, marginBottom: 12 },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    marginRight: 8,
  },
  categoryText: { fontWeight: '700' },
  countBadge: { borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2 },
  countText: { fontSize: 12, fontWeight: '700' },

  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  title: { fontSize: 16, fontWeight: '700' },
  note: { fontSize: 13, marginTop: 2 },
  completed: { textDecorationLine: 'line-through', opacity: 0.6 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '75%',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  removeText: {
    color: '#dc2626',
    fontWeight: '700',
  },
});
