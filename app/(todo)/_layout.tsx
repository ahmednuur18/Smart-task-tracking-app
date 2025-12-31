import { Stack, Redirect } from 'expo-router';

const isLoggedIn = true; // later replace with real auth

export default function AppLayout() {
  if (!isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
