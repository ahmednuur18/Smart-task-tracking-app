import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';
import { useState, useMemo } from 'react';

const PRIMARY = '#23c762';

type Category = 'All' | 'Tasks' | 'Account' | 'Data';

export default function FAQScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const faqs = [
    {
      q: 'How do I create a new task?',
      a: 'Tap the + button on the Today Tasks screen. Enter a title, choose a category, set priority, and optionally add a due date and time.',
      category: 'Tasks',
    },
    {
      q: 'How do I edit an existing task?',
      a: 'Tap on any task from the list. The task will open in edit mode where you can update its details.',
      category: 'Tasks',
    },
    {
      q: 'How do I mark a task as completed?',
      a: 'Tap the circle icon on the left side of a task to mark it as completed or undo it.',
      category: 'Tasks',
    },
    {
      q: 'How do I delete a task?',
      a: 'Long press on a task and confirm deletion from the prompt.',
      category: 'Tasks',
    },
    {
      q: 'What do task priorities mean?',
      a: 'High priority tasks appear first. Medium and low priority tasks are ordered below based on importance.',
      category: 'Tasks',
    },
    {
      q: 'How do categories work?',
      a: 'Tasks can be grouped into Work, Personal, or Urgent categories. Use category tabs to filter tasks quickly.',
      category: 'Tasks',
    },
    {
      q: 'Is my data saved automatically?',
      a: 'Yes. All tasks and profile data are saved automatically on your device.',
      category: 'Data',
    },
    {
      q: 'Can I use multiple accounts?',
      a: 'Yes. You can switch between profiles from the Manage Account option in Settings.',
      category: 'Account',
    },
    {
      q: 'Where is my data stored?',
      a: 'All data is stored locally on your device and is linked to the currently active profile.',
      category: 'Data',
    },
    {
      q: 'Does deleting the app remove my data?',
      a: 'Yes. Uninstalling the app will remove all locally stored data.',
      category: 'Data',
    },
    {
      q: 'Can I change my profile details?',
      a: 'Yes. Go to Settings > Profile Details to update your information.',
      category: 'Account',
    },
    {
      q: 'Does the app support dark mode?',
      a: 'Yes. You can enable or disable dark mode from the Appearance section in Settings.',
      category: 'Account',
    },
  ];

  /** ---------- FILTER LOGIC ---------- */
  const filteredFaqs = useMemo(() => {
    return faqs.filter(item => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;

      const matchesSearch =
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 32,
          paddingBottom: 12,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ width: 40 }}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: '700',
            color: colors.text,
          }}
        >
          Help & FAQs
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Search */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 999,
            paddingHorizontal: 16,
            marginBottom: 20,
          }}
        >
          <MaterialIcons name="search" size={22} color={colors.icon} />
          <TextInput
            placeholder="Search help..."
            placeholderTextColor={colors.icon}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              height: 52,
              marginLeft: 10,
              fontSize: 16,
              color: colors.text,
            }}
          />
        </View>

        {/* Category Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {(['All', 'Tasks', 'Account', 'Data'] as Category[]).map(cat => {
            const active = activeCategory === cat;

            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.85}
                style={{
                  paddingHorizontal: 20,
                  height: 40,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? PRIMARY : colors.card,
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: active ? '700' : '500',
                    color: active ? '#0b1f14' : colors.text,
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FAQ List */}
        {filteredFaqs.length === 0 ? (
          <Text style={{ fontSize: 14, opacity: 0.6, color: colors.text }}>
            No results found.
          </Text>
        ) : (
          filteredFaqs.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                marginBottom: 14,
                padding: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.text,
                  marginBottom: 6,
                }}
              >
                {item.q}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 22,
                  opacity: 0.7,
                  color: colors.text,
                }}
              >
                {item.a}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
