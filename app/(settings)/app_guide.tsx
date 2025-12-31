import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';
import { useMemo, useState } from 'react';

type GuideItem = {
  id: string;
  title: string;
  description: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  image?: string;
  route: '/(settings)/guide_basics' | '/(settings)/guide_organizing' | '/(settings)/guide_tips';
};

export default function AppGuideScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const guides: GuideItem[] = [
    {
      id: 'basics',
      title: 'The Basics',
      description: 'Learn how to create and complete tasks.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
      route: '/(settings)/guide_basics',
    },
    {
      id: 'organizing',
      title: 'Organizing',
      description: 'Keep your tasks clean and structured.',
      icon: 'folder-copy',
      route: '/(settings)/guide_organizing',
    },
    {
      id: 'tips',
      title: 'Tips & Tricks',
      description: 'Maximize your productivity with smart task habits.',
      icon: 'lightbulb',
      route: '/(settings)/guide_tips', // new page you can create
    },
  ];

  const filteredGuides = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return guides;
    return guides.filter(
      g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.card,
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 48 }}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: colors.text }}>
          App Guide
        </Text>

        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Hero */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <Text style={{ fontSize: 36, fontWeight: '800', lineHeight: 40, color: colors.text }}>
            Master Your{'\n'}Tasks
          </Text>
          <Text style={{ marginTop: 8, fontSize: 16, opacity: 0.7, color: colors.text }}>
            Learn how to use the app effectively.
          </Text>
        </View>

        {/* Search */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 24,
            paddingHorizontal: 14,
          }}>
            <MaterialIcons name="search" size={22} color={colors.icon} />
            <TextInput
              placeholder="Search topics..."
              placeholderTextColor={colors.icon}
              value={search}
              onChangeText={setSearch}
              style={{
                flex: 1,
                height: 52,
                marginLeft: 8,
                fontSize: 16,
                color: colors.text,
              }}
            />
          </View>
        </View>

        {/* Guides */}
        <View style={{ paddingHorizontal: 20, marginTop: 28, gap: 20 }}>
          {filteredGuides.length === 0 && (
            <Text style={{ textAlign: 'center', opacity: 0.6, color: colors.text }}>
              No results found
            </Text>
          )}

          {filteredGuides.map(item =>
            item.image ? (
              <GuideCard
                key={item.id}
                title={item.title}
                description={item.description}
                image={item.image}
                onPress={() => router.push({ pathname: item.route })}
                colors={colors}
              />
            ) : (
              <SimpleGuideCard
                key={item.id}
                icon={item.icon!}
                title={item.title}
                description={item.description}
                onPress={() => router.push({ pathname: item.route })}
                colors={colors}
              />
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Components ---------- */

function GuideCard({ title, description, image, onPress, colors }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}
      style={{ backgroundColor: colors.card, borderRadius: 24, overflow: 'hidden' }}>
      <Image source={{ uri: image }} style={{ height: 140, width: '100%' }} />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{title}</Text>
        <Text style={{ marginTop: 6, fontSize: 14, opacity: 0.7, color: colors.text }}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

function SimpleGuideCard({ icon, title, description, onPress, colors }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}
      style={{
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(35,199,98,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <MaterialIcons name={icon} size={28} color={colors.tint} />
      </View>

      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{title}</Text>
        <Text style={{ marginTop: 4, fontSize: 14, opacity: 0.7, color: colors.text }}>{description}</Text>
      </View>

      <MaterialIcons name="chevron-right" size={22} color={colors.icon} />
    </TouchableOpacity>
  );
}
