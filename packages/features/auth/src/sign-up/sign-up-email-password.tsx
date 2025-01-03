import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useSignUpWithEmailAndPassword } from '@kit/supabase';
import { Button, Input, Text } from '@kit/ui';
import { useCreateDeepLink } from '../lib/deep-links';
import { EmailPasswordSchema } from '../lib/schema';

export function SignUpEmailPassword() {
  const form = useForm({
    resolver: zodResolver(EmailPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpMutation = useSignUpWithEmailAndPassword();
  const deepLink = useCreateDeepLink();

  console.log('deepLink', deepLink);

  const [state, setState] = useState({
    loading: false,
    error: false,
    success: false,
  });

  if (state.success) {
    return (
      <View className={'flex-col justify-center gap-8 p-8'}>
        <Text>Successfully created account. You can now sign in.</Text>
      </View>
    );
  }

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

      <View className={'h-16'}>
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
      </View>

      <View>
        <Button
          disabled={state.loading}
          onPress={form.handleSubmit(async (data) => {
            try {
              await signUpMutation.mutateAsync({
                email: data.email,
                password: data.password,
                emailRedirectTo: deepLink,
              });

              setState({
                loading: false,
                error: false,
                success: true,
              });
            } catch (error) {
              setState({
                loading: false,
                error: true,
                success: false,
              });
            }
          })}
        >
          <Text>Create Account</Text>
        </Button>
      </View>
    </View>
  );
}
