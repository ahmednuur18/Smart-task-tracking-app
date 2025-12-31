import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';

export default function GettingStartedFAQ() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Getting Started" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 15, lineHeight: 22, color: colors.text }}>
          Getting started with the app is easy. Create your account, set up your first project,
          and begin adding tasks right away.
        </Text>

        <Section title="Create an Account" colors={colors}>
          Sign up using your email and secure your account with a strong password.
        </Section>

        <Section title="First Project" colors={colors}>
          Projects help you organize tasks into meaningful groups for better focus.
        </Section>

        <Section title="Add Tasks" colors={colors}>
          Add tasks to your project, set priorities, and schedule them to manage your day effectively.
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
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 32 }}>
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
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, lineHeight: 20, opacity: 0.7, color: colors.text }}>
        {children}
      </Text>
    </View>
  );
}
