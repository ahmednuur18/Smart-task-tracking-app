    import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
    import { MaterialIcons } from '@expo/vector-icons';
    import { useRouter } from 'expo-router';
    import { useTheme } from '@/constants/ThemeContext';

    export default function BasicsGuide() {
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
            The Basics
            </Text>

            <View style={{ width: 48 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>
            Getting Started
            </Text>

            <Text style={{ marginTop: 12, fontSize: 16, opacity: 0.75, color: colors.text }}>
            Learn how to create tasks, set due dates, and manage your daily to-do list efficiently.
            </Text>

            <GuideSection
            title="Create a Task"
            text="Tap the + button, enter your task title, and save it. Keep titles short and clear."
            colors={colors}
            />

            <GuideSection
            title="Set Due Dates"
            text="Assign a due date to stay on track and prioritize what matters most."
            colors={colors}
            />

            <GuideSection
            title="Mark as Done"
            text="Tap the checkbox to complete tasks and keep your list clean."
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
