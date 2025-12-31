import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';

export default function ManagingTasksFAQ() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Managing Tasks" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 15, lineHeight: 22, color: colors.text }}>
          Tasks are the core of your workflow. Learn how to create, manage, and complete tasks efficiently.
        </Text>

        <Section title="Creating Tasks" colors={colors}>
          Use the add task button to create tasks with titles, due dates, and priorities.
        </Section>

        <Section title="Editing Tasks" colors={colors}>
          Tap on any task to update its details, change deadlines, or reassign it.
        </Section>

        <Section title="Completing Tasks" colors={colors}>
          Mark tasks as complete to track progress and keep your workspace clean.
        </Section>
      </ScrollView>
    </View>
  );
}

/* ---------- Helpers ---------- */

function Header({ title }: any) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 32, paddingBottom: 16 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ width: 48 }}>
        <MaterialIcons name="arrow-back-ios-new" size={24} color={colors.text} />
      </TouchableOpacity>

      <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: colors.text }}>
        {title}
      </Text>

      <View style={{ width: 48 }} />
    </View>
  );
}

function Section({ title, children, colors }: any) {
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, lineHeight: 20, opacity: 0.7, color: colors.text }}>
        {children}
      </Text>
    </View>
  );
}
