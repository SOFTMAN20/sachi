import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/context/AppContext';
import RoleModal from '@/components/RoleModal';
import LoginModal from '@/components/LoginModal';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Expo Router auto-discovers all routes from files in app/ directory */}
      </Stack>
      <StatusBar style="auto" />
      <RoleModal />
      <LoginModal />
    </AppProvider>
  );
}
