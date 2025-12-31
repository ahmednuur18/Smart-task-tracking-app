import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '../constants/ThemeContext'; // your ThemeContext



export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

/* ---------------- AppContent ---------------- */
function AppContent() {
  const { theme } = useTheme(); // get current theme

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(today)" options={{ headerShown: false }} />
        <Stack.Screen name="(todo)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        <Stack.Screen name="(profile)" options={{ headerShown: false }} />
      </Stack>

      <StatusBar
        style={theme === 'dark' ? 'light' : 'dark'}
        translucent
        backgroundColor="transparent"
      />
    </>
  );
}
