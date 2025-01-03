import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useSignInWithEmailPassword } from '@kit/supabase';
import { Button, Input, Text } from '@kit/ui';
import { EmailPasswordSchema } from '../lib/schema';

export function SignInEmailPassword() {
  const form = useForm({
    resolver: zodResolver(EmailPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signIn = useSignInWithEmailPassword();

  return (
    <View className={'flex-col justify-center gap-8 p-8'}>
      <View className={'h-16'}>
        <Text>Email</Text>

        <Controller
          control={form.control}
          name={'email'}
          render={({ field }) => (
            <Input
              inputMode={'email'}
              placeholder="Email"
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
            />
          )}
        />
      </View>

      <View className={'h-24'}>
        <Text>Password</Text>

        <Controller
          control={form.control}
          name={'password'}
          render={({ field }) => (
            <Input
              secureTextEntry
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
            />
          )}
        />

        <Link className={'my-2.5'} href="/auth/password-reset">
          <Text className={'text-secondary-foreground'}>
            Forgot your password?
          </Text>
        </Link>
      </View>

      <View>
        <Button
          className={'w-full'}
          onPress={form.handleSubmit((data) => {
            signIn.mutate(data);
          })}
        >
          <Text>Sign in</Text>
        </Button>
      </View>
    </View>
  );
}
