import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';

const PRIMARY = '#23C762';

/* ---------- Typed Routes ---------- */
type FAQRoute =
  | '/(settings)/faq/getting_started'
  | '/(settings)/faq/managing_tasks'
  | '/(settings)/faq/account_settings'
  | '/(settings)/faq/troubleshooting'
  | '/(settings)/app_guide'
  | '/(settings)/contact_support'
  | '/(settings)/faq';

const FAQS = [
  { title: 'Getting Started', route: '/(settings)/faq/getting_started' as const },
  { title: 'Managing Tasks', route: '/(settings)/faq/managing_tasks' as const },
  { title: 'Account Settings', route: '/(settings)/faq/account_settings' as const },
  { title: 'Troubleshooting', route: '/(settings)/faq/troubleshooting' as const },
];

export default function SupportScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const filteredFAQs = useMemo(() => {
    return FAQS.filter(f =>
      f.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

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
          Help & FAQ
        </Text>

        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Heading */}
        <Text
          style={{
            fontSize: 30,
            fontWeight: '800',
            lineHeight: 36,
            color: colors.text,
          }}
        >
          How can we{'\n'}help you?
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 15,
            opacity: 0.7,
            color: colors.text,
          }}
        >
          Select the category below to find answers you need.
        </Text>

        {/* Search */}
        <View
          style={{
            marginTop: 24,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 16,
            paddingHorizontal: 12,
          }}
        >
          <MaterialIcons name="search" size={22} color={colors.icon} />
          <TextInput
            placeholder="Search help topics..."
            placeholderTextColor={colors.icon}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              height: 48,
              marginLeft: 8,
              fontSize: 16,
              color: colors.text,
            }}
          />
        </View>

        {/* Quick Cards */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
          <QuickCard
            icon="quiz"
            label="FAQs"
            onPress={() => router.push('/(settings)/faq')}
            colors={colors}
          />
          <QuickCard
            icon="menu-book"
            label="App Guide"
            onPress={() => router.push('/(settings)/app_guide')}
            colors={colors}
          />
        </View>

        {/* FAQ Section */}
        <Text
          style={{
            marginTop: 32,
            marginBottom: 12,
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
          }}
        >
          FAQs
        </Text>

        {filteredFAQs.length === 0 ? (
          <Text
            style={{
              fontSize: 14,
              opacity: 0.6,
              color: colors.text,
            }}
          >
            No results found.
          </Text>
        ) : (
          filteredFAQs.map(item => (
            <TouchableOpacity
              key={item.title}
              onPress={() => router.push(item.route as FAQRoute)}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.text,
                }}
              >
                {item.title}
              </Text>
              <MaterialIcons name="chevron-right" size={22} color={colors.icon} />
            </TouchableOpacity>
          ))
        )}

        {/* Contact Support CARD */}
        <View
          style={{
            marginTop: 32,
            backgroundColor: '#000',
            borderRadius: 24,
            padding: 20,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 6,
            }}
          >
            Still need help?
          </Text>

          <Text
            style={{
              color: '#aaa',
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Our support team is available 24/7.
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/(settings)/contact_support')}
            activeOpacity={0.9}
            style={{
              backgroundColor: PRIMARY,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontWeight: '700', color: '#000' }}>
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Components ---------- */
function QuickCard({ icon, label, onPress, colors }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: 'rgba(35,199,98,0.15)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={icon} size={22} color={PRIMARY} />
      </View>
      <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
