import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';

export default function TroubleshootingFAQ() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Troubleshooting" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 15, lineHeight: 22, color: colors.text }}>
          If something isn’t working as expected, try these common fixes before contacting support.
        </Text>

        <Section title="Sync Issues" colors={colors}>
          Make sure you have a stable internet connection and try restarting the app.
        </Section>

        <Section title="Login Problems" colors={colors}>
          Double-check your credentials and reset your password if necessary.
        </Section>

        <Section title="Performance Issues" colors={colors}>
          Close background apps and ensure you are running the latest version.
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
