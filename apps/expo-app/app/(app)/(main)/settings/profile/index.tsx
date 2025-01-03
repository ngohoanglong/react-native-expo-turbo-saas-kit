import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function ProfileSettingsPage() {
  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerBackVisible: true,
          headerBackTitle: 'Settings',
          headerBackButtonMenuEnabled: true,
        }}
      />
    </View>
  );
}
