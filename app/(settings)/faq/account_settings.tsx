import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';

export default function AccountSettingsFAQ() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Account Settings" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 15, lineHeight: 22, color: colors.text }}>
          Manage your account information, preferences, and security settings.
        </Text>

        <Section title="Profile Information" colors={colors}>
          Update your name, avatar, and personal details from the account section.
        </Section>

        <Section title="Password & Security" colors={colors}>
          Change your password regularly and enable additional security options if available.
        </Section>

        {/* Privacy Policy Section */}
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/(settings)/privacy_policy' })}
        >
          <Section title="Privacy Policy" colors={colors}>
            Learn how we collect, store, and handle your personal data.
          </Section>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- Helpers ---------- */

function Header({ title }: any) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 16,
      }}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ width: 48 }}>
        <MaterialIcons name="arrow-back-ios-new" size={24} color={colors.text} />
      </TouchableOpacity>

      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
        }}
      >
        {title}
      </Text>

      <View style={{ width: 48 }} />
    </View>
  );
}

function Section({ title, children, colors }: any) {
  return (
    <View style={{ marginTop: 24 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 6,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 20,
          opacity: 0.7,
          color: colors.text,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
