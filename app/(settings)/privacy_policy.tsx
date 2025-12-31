import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';

export default function PrivacyPolicy() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
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
          <MaterialIcons
            name="arrow-back-ios-new"
            size={24}
            color={colors.text}
          />
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
          Privacy Policy
        </Text>

        <View style={{ width: 48 }} />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Your Privacy Matters" colors={colors}>
          This Privacy Policy explains how we collect, use, and protect your
          information when you use this application. Your trust is important to
          us, and we are committed to safeguarding your data.
        </Section>

        <Section title="Information We Collect" colors={colors}>
          We only collect information necessary for the app to function properly:
          {"\n\n"}• Account information (such as username and email)
          {"\n"}• Tasks and preferences you create inside the app
          {"\n"}• Avatar and profile customization choices
          {"\n\n"}All data is stored locally on your device unless otherwise
          stated.
        </Section>

        <Section title="How We Use Your Data" colors={colors}>
          Your data is used strictly to:
          {"\n\n"}• Provide core app functionality
          {"\n"}• Personalize your experience
          {"\n"}• Improve usability and performance
          {"\n\n"}We do not sell, rent, or share your personal information with
          third parties.
        </Section>

        <Section title="Data Storage & Security" colors={colors}>
          Your information is stored securely on your device using local storage.
          We take reasonable measures to protect your data from unauthorized
          access, alteration, or loss.
        </Section>

        <Section title="Third-Party Services" colors={colors}>
          This app does not integrate with third-party analytics, advertising,
          or tracking services. Any future integrations will be clearly disclosed
          and updated in this policy.
        </Section>

        <Section title="Your Rights" colors={colors}>
          You have full control over your data:
          {"\n\n"}• Edit or delete your profile information
          {"\n"}• Remove tasks and app content at any time
          {"\n"}• Uninstalling the app removes all locally stored data
        </Section>

        <Section title="Policy Updates" colors={colors}>
          We may update this Privacy Policy from time to time. Any changes will
          be reflected on this page with an updated revision date.
        </Section>

        <Section title="Contact Us" colors={colors}>
          If you have any questions or concerns about this Privacy Policy, please
          contact us through the app support section.
        </Section>

        {/* Footer */}
        <Text
          style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 12,
            color: colors.icon,
          }}
        >
          Last updated: January 2026
        </Text>
      </ScrollView>
    </View>
  );
}

/* ---------- Section Component ---------- */

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View
      style={{
        marginBottom: 20,
        padding: 16,
        borderRadius: 18,
        backgroundColor: colors.card,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 8,
          color: colors.text,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontSize: 14,
          lineHeight: 22,
          color: colors.text,
          opacity: 0.85,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
