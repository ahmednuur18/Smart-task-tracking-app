/*
====================================================
REACT NATIVE TASK SCREEN
====================================================

This screen allows users to create or edit tasks. It uses React Native with hooks, AsyncStorage, DateTimePicker, and dynamic theme support. Each main section below has a detailed explanation of what it does and how the lines inside it work together.

- React imports manage state and lifecycle.
- React Native imports handle UI, scrolling, keyboard avoidance, and alerts.
- MaterialIcons provides icons for buttons and indicators.
- expo-router handles navigation and route parameters (task id for editing).
- AsyncStorage stores tasks locally per user.
- DateTimePicker allows selecting date and time on mobile.
- useTheme dynamically applies colors for light/dark mode.
- Constants define colors, categories, storage prefixes, and styling.
- StoredTask type defines the structure of a task to ensure consistency when saving and loading.

*/

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/constants/ThemeContext';

const PRIMARY = '#23c762';
const TASK_KEY_PREFIX = 'TODAY_TASKS_';
const CATEGORIES = ['Work', 'Personal', 'Urgent'];
const SECTION_COLOR = 'rgba(139, 69, 19, 0.7)';

type StoredTask = {
  id: string;
  title: string;
  note?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate: string | null;
  time: string;
};

/*
====================================================
MAIN COMPONENT AND STATE
====================================================

This component manages the full task screen. We define all the states needed to handle user input, selections, and UI flags. 
- title and note store the text input values.
- priority and category store selected options for the task.
- dueDate and time store date and time information.
- showCalendar and showTime control visibility of native pickers.
- getKey retrieves a unique AsyncStorage key for the current user to isolate their tasks.

useEffect runs once when editing an existing task. It loads all tasks, finds the matching one by id, and sets all states so the form shows current values. This ensures editing works correctly.
*/

export default function NewTask() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('low');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [time, setTime] = useState({ hours: 0, minutes: 0 });
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const getKey = async () => {
    const email = await AsyncStorage.getItem('CURRENT_USER');
    return email ? TASK_KEY_PREFIX + email : null;
  };

  useEffect(() => {
    if (!id) return;

    (async () => {
      const key = await getKey();
      if (!key) return;

      const raw = await AsyncStorage.getItem(key);
      const tasks: StoredTask[] = raw ? JSON.parse(raw) : [];

      const task = tasks.find(t => t.id === id);
      if (!task) return;

      setTitle(task.title);
      setNote(task.note ?? '');
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);

      const [h, m] = task.time.split(':').map(Number);
      setTime({ hours: h, minutes: m });
    })();
  }, [id]);

  /*
  =====================================================
  DATE AND TIME HANDLERS
  =====================================================

  selectToday sets the task due date to the current date and time. 
  On web, we ask the user to enter the time because native pickers are not available.
  On mobile, we get hours and minutes from the current time and show the time picker.

  pickDate allows the user to manually choose date and time. On mobile, it shows the native calendar picker.
  On web, it prompts the user to enter date and time manually.
  These functions ensure tasks always have a valid date and time.
  */

  const selectToday = () => {
    const now = new Date();
    setDueDate(now);

    if (Platform.OS === 'web') {
      const t = prompt('Enter time (HH:MM)', '12:00');
      if (t) {
        const [h, m] = t.split(':').map(Number);
        setTime({ hours: h, minutes: m });
      }
      return;
    }

    setTime({ hours: now.getHours(), minutes: now.getMinutes() });
    setShowTime(true);
  };

  const pickDate = () => {
    if (Platform.OS === 'web') {
      const d = prompt('Enter date (YYYY-MM-DD)');
      if (!d) return;

      const t = prompt('Enter time (HH:MM)', '12:00');
      if (!t) return;

      const [h, m] = t.split(':').map(Number);
      setDueDate(new Date(d));
      setTime({ hours: h, minutes: m });
      return;
    }

    setShowCalendar(true);
  };

  /*
  =====================================================
  SAVE TASK FUNCTION
  =====================================================

  saveTask validates user input (title and date). If invalid, it shows an alert.
  It then loads the user's tasks from AsyncStorage.
  If editing, it updates the existing task, otherwise, it creates a new one.
  The task is then saved back to AsyncStorage using the user's unique key.
  Finally, the router navigates back to the previous screen.
  */

  const saveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Task title required');
      return;
    }

    if (!dueDate) {
      Alert.alert('Please select date & time');
      return;
    }

    const key = await getKey();
    if (!key) return;

    const raw = await AsyncStorage.getItem(key);
    const tasks: StoredTask[] = raw ? JSON.parse(raw) : [];

    const taskId = id ?? Date.now().toString();
    const index = tasks.findIndex(t => t.id === taskId);

    const task: StoredTask = {
      id: taskId,
      title: title.trim(),
      note: note.trim(),
      completed: index >= 0 ? tasks[index].completed : false,
      priority,
      category,
      dueDate: dueDate.toISOString(),
      time: `${time.hours.toString().padStart(2, '0')}:${time.minutes
        .toString()
        .padStart(2, '0')}`,
    };

    if (index >= 0) tasks[index] = task;
    else tasks.push(task);

    await AsyncStorage.setItem(key, JSON.stringify(tasks));
    router.back();
  };

  /*
  =====================================================
  UI RENDERING
  =====================================================

  The whole screen is wrapped in KeyboardAvoidingView to push content up when the keyboard appears.
  The header contains a back button, the title, and spacing for symmetry.
  ScrollView contains the main task form: title input, category selection, due date buttons, date/time pickers, and priority buttons.
  The bottom notes container is fixed, with a multiline TextInput and a send button. The TextInput scrolls internally if the content is large and stops expanding after max height.
  Styles handle layout, colors, padding, borders, and font sizes to make the page look clean and responsive.
  */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios-new" size={22} color={colors.text} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: colors.text, marginTop: 14 }]}>
            {id ? 'Edit Task' : 'New Task'}
          </Text>

          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors.text }]}>
            What needs to be done?
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={colors.icon}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          />

          <Text style={styles.section}>CATEGORY</Text>
          <View style={styles.row}>
            {CATEGORIES.map(cat => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.chip,
                  { backgroundColor: category === cat ? colors.text : colors.card },
                ]}
              >
                <Text
                  style={{
                    color: category === cat ? colors.background : colors.text,
                    fontWeight: '700',
                  }}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.section}>DUE DATE & TIME</Text>
          <View style={styles.row}>
            <Pressable onPress={selectToday} style={[styles.dateBtn, { backgroundColor: colors.card }]}>
              <MaterialIcons name="today" size={18} color={colors.text} />
              <Text style={{ fontWeight: '700', color: colors.text }}>Today</Text>
            </Pressable>

            <Pressable onPress={pickDate} style={[styles.dateBtn, { backgroundColor: colors.card }]}>
              <MaterialIcons name="event" size={18} color={colors.text} />
              <Text style={{ fontWeight: '700', color: colors.text }}>
                Pick Date & Time
              </Text>
            </Pressable>
          </View>

          {showCalendar && Platform.OS !== 'web' && (
            <DateTimePicker
              value={dueDate ?? new Date()}
              mode="date"
              onChange={(_, d) => {
                setShowCalendar(false);
                if (d) {
                  setDueDate(d);
                  setShowTime(true);
                }
              }}
            />
          )}

          {showTime && Platform.OS !== 'web' && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour
              onChange={(_, d) => {
                setShowTime(false);
                if (d) {
                  setTime({ hours: d.getHours(), minutes: d.getMinutes() });
                }
              }}
            />
          )}

          <Text style={styles.section}>PRIORITY</Text>
          <View style={styles.row}>
            {['high', 'medium', 'low'].map(p => (
              <Pressable
                key={p}
                onPress={() => setPriority(p as any)}
                style={[
                  styles.priority,
                  {
                    backgroundColor:
                      priority === p
                        ? p === 'high'
                          ? '#ef4444'
                          : p === 'medium'
                          ? '#eab308'
                          : PRIMARY
                        : 'transparent',
                    borderColor:
                      p === 'high'
                        ? '#ef4444'
                        : p === 'medium'
                        ? '#eab308'
                        : PRIMARY,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      priority === p
                        ? '#fff'
                        : p === 'high'
                        ? '#ef4444'
                        : p === 'medium'
                        ? '#eab308'
                        : PRIMARY,
                    fontWeight: '800',
                  }}
                >
                  {p.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
          <Text style={[styles.section, {marginLeft:18}]}>NOTES</Text>

        <View style={[styles.notesContainer, { backgroundColor: colors.background }]}>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            scrollEnabled={true}
            textAlignVertical="top"
            placeholder="Add details..."
            placeholderTextColor={colors.icon}
            style={[styles.notes, { backgroundColor: colors.card, color: colors.text }]}
          />
          <Pressable style={styles.sendBtn} onPress={saveTask}>
            <MaterialIcons name="send" size={22} color="#000" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 12,
  },

  section: {
    fontSize: 12,
    fontWeight: '700',
    color: SECTION_COLOR,
    marginBottom: 8,
  },

  input: {
    fontSize: 18,
    borderRadius: 16,
    padding: 14,
    marginBottom: 28,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 24,
  },

  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  dateBtn: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },

  priority: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
  },

  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  notes: {
    flex: 1,
    minHeight: 60,
    maxHeight: 110,
    borderRadius: 29,
    padding: 10,
    fontSize: 14,
  },

  sendBtn: {
    width: 55,
    height: 55,
    borderRadius: 24,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
