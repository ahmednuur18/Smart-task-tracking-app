import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';

export default function TipsGuide() {
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
          borderBottomWidth: 1,
          borderBottomColor: colors.card,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ width: 48 }}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: colors.text }}>
          Tips & Tricks
        </Text>

        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>
          Boost Your Productivity
        </Text>

        <Text style={{ marginTop: 12, fontSize: 16, opacity: 0.75, color: colors.text }}>
          Learn simple strategies to manage your tasks more effectively.
        </Text>

        <GuideSection
          title="Organize Tasks"
          text="Group related tasks and prioritize them to stay on top of your work."
          colors={colors}
        />

        <GuideSection
          title="Set Deadlines"
          text="Assign due dates to tasks to maintain momentum and track progress."
          colors={colors}
        />

        <GuideSection
          title="Review Daily"
          text="Check your task list daily to plan ahead and avoid surprises."
          colors={colors}
        />

        <GuideSection
          title="Use Labels"
          text="Label tasks by type or project to easily filter and find them."
          colors={colors}
        />
      </ScrollView>
    </View>
  );
}

function GuideSection({ title, text, colors }: any) {
  return (
    <View
      style={{
        marginTop: 24,
        padding: 16,
        borderRadius: 20,
        backgroundColor: colors.card,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
        {title}
      </Text>
      <Text style={{ marginTop: 6, fontSize: 14, opacity: 0.7, color: colors.text }}>
        {text}
      </Text>
    </View>
  );
}
