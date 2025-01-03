import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { FlatList, View } from 'react-native';
import { useSignOut } from '@kit/supabase';
import { Button, Text } from '@kit/ui';

const pages = [
  {
    name: 'profile',
    title: 'Profile',
    href: '/settings/profile' as const,
  },
  {
    name: 'account',
    title: 'Account',
    href: '/settings/account' as const,
  },
];

export default function SettingsPage() {
  return <SettingsPagesList />;
}

function SettingsPagesList() {
  return (
    <View className={'h-full w-full flex-1 flex-col space-y-8 p-4'}>
      <FlatList
        data={pages}
        ItemSeparatorComponent={() => (
          <View className={'h-px w-full bg-border'} />
        )}
        renderItem={({ item }) => (
          <Link className={'h-14'} href={item.href}>
            <View
              className={'h-full w-full flex-row items-center justify-between'}
            >
              <Text className={'text-lg'}>{item.title}</Text>
              <ChevronRight className={'h-5'} />
            </View>
          </Link>
        )}
      />

      <SignOutButton />
    </View>
  );
}

function SignOutButton() {
  const signOutMutation = useSignOut();

  return (
    <Button
      variant={'outline'}
      className={'mt-auto'}
      onPress={() => signOutMutation.mutate()}
    >
      <Text>Sign Out</Text>
    </Button>
  );
}
