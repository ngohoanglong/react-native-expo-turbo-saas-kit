import { Redirect, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { HomeIcon, SettingsIcon } from 'lucide-react-native';

import {
  AuthProvider,
  AuthProviderLoading,
  AuthProviderSignedIn,
  AuthProviderSignedOut,
} from '@kit/supabase';

void SplashScreen.preventAutoHideAsync();

export default function MainLayout() {
  return (
    <AuthProvider>
      <AuthProviderLoading>
        <SplashScreenLoading />
      </AuthProviderLoading>

      <AuthProviderSignedIn>
        <MainLayoutTabs />
      </AuthProviderSignedIn>

      <AuthProviderSignedOut>
        <Redirect href={'/auth/sign-in'} />
      </AuthProviderSignedOut>
    </AuthProvider>
  );
}

function MainLayoutTabs() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <SettingsIcon color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

function SplashScreenLoading() {
  useEffect(() => {
    return () => {
      void SplashScreen.hideAsync();
    };
  });

  return null;
}
