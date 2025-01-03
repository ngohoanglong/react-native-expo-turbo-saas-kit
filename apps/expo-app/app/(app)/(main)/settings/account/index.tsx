import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AccountSettingsPage() {
  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Account',
          headerBackTitle: 'Settings',
          headerBackVisible: true,
          headerBackButtonMenuEnabled: true,
          headerShown: true,
        }}
      />
    </View>
  );
}
