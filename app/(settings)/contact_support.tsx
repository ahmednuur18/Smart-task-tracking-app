/*
====================================================
CONTACT SUPPORT SCREEN
====================================================

This screen allows the user to contact support by:

1. Selecting one or more predefined issues.
2. Writing a message describing the problem.
3. Sending the selected issues and message to support (currently logged in console).

Key features:

- KeyboardAvoidingView ensures the input field is visible above the keyboard.
- FlatList displays the list of issues in two columns.
- Selected issues are highlighted.
- Bottom input bar supports multiline messages.
- Send button is enabled only when at least one issue is selected and message is not empty.
- Uses useState to manage selected issues and message.
- ThemeContext is used for consistent colors across the app.
*/

import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';
import { useState } from 'react';

/* ---------- constants ---------- */
const ISSUES = [
  'Login problem',
  'Tasks not saving',
  'Sync issue',
  'Notifications not working',
  'Focus mode problem',
  'Organizing / lists issue',
  'Performance issue',
  'Feature request',
  'Account & data',
  'Other',
];

const GREEN = '#23C762';

/*
====================================================
MAIN COMPONENT
====================================================

ContactSupportScreen handles:

1. selectedIssues - array of issues the user selects.
2. message - text typed by the user describing the problem.
3. toggleIssue function to add/remove issues from selection.
4. canSend boolean to determine if the send button should be active.
*/

export default function ContactSupportScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev =>
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const canSend = selectedIssues.length > 0 && message.trim().length > 0;

  /*
  =====================================================
  RENDERING
  =====================================================

  1. KeyboardAvoidingView ensures bottom input is visible when keyboard opens.
  2. Header: back button and screen title.
  3. FlatList displays selectable issues in two columns with highlights for selected items.
  4. Bottom input bar contains:
     - TextInput for user message.
     - Send button, which is disabled if no issues or empty message.
  5. Styling and colors are consistent with theme.
  */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
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

        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
          }}
        >
          Contact Support
        </Text>

        <View style={{ width: 48 }} />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={ISSUES}
          keyExtractor={(item) => item}
          ListHeaderComponent={
            <>
              {/* Title */}
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: '800',
                  lineHeight: 36,
                  color: colors.text,
                  padding: 20,
                  paddingBottom: 0,
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
                  paddingHorizontal: 20,
                  paddingBottom: 12,
                }}
              >
                Select one or more issues and describe your problem.
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  marginBottom: 12,
                  paddingHorizontal: 20,
                  color: colors.text,
                }}
              >
                Select issues
              </Text>
            </>
          }
          renderItem={({ item }) => {
            const active = selectedIssues.includes(item);
            return (
              <TouchableOpacity
                onPress={() => toggleIssue(item)}
                activeOpacity={0.85}
                style={{
                  marginHorizontal: 10,
                  marginBottom: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: active ? 'rgba(35,199,98,0.22)' : colors.card,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: active ? GREEN : colors.text }}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
          numColumns={2}
        />
      </View>

      {/* Bottom input bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: colors.card,
          backgroundColor: colors.background,
        }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          multiline
          scrollEnabled
          placeholder="Tell us more about the problem..."
          placeholderTextColor={colors.icon}
          style={{
            flex: 1,
            minHeight: 40,
            maxHeight: 150,
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: colors.card,
            borderRadius: 20,
            fontSize: 15,
            color: colors.text,
          }}
          textAlignVertical="top"
        />

        <TouchableOpacity
          onPress={() => {
            if (canSend) {
              // Currently just logs to console
              console.log({ selectedIssues, message });
              setMessage('');
              setSelectedIssues([]);
            }
          }}
          disabled={!canSend}
          style={{
            marginLeft: 8,
            height: 44,
            width: 44,
            borderRadius: 22,
            backgroundColor: GREEN,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: canSend ? 1 : 0.6,
          }}
        >
          <MaterialIcons name="send" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
