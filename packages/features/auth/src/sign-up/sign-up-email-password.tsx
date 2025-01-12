import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, X } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { useSignUpWithEmailAndPassword } from '@kit/supabase';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Input,
  Text,
} from '@kit/ui';

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

  if (signUpMutation.isSuccess) {
    return <SuccessMessage />;
  }

  if (signUpMutation.isError) {
    return <ErrorMessage />;
  }

  const onSubmit = form.handleSubmit(async (data) => {
    await signUpMutation.mutateAsync({
      email: data.email,
      password: data.password,
      emailRedirectTo: deepLink,
    });
  });

  return (
    <View className={'flex-col justify-center gap-4 p-8'}>
      <View>
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

      <View>
        <Controller
          control={form.control}
          name={'password'}
          render={({ field }) => (
            <Input
              placeholder={'Password'}
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
          size={'lg'}
          disabled={signUpMutation.isPending}
          onPress={onSubmit}
        >
          <Text>Create Account</Text>
        </Button>
      </View>
    </View>
  );
}

function SuccessMessage() {
  return (
    <Alert className={'m-4'}>
      <AlertIcon>
        <CheckIcon
          className={
            'h-14 w-14 rounded-full border-8 border-green-100 bg-green-500 p-2 text-white'
          }
        />
      </AlertIcon>

      <AlertTitle> We have sent you an email.!</AlertTitle>

      <AlertDescription>
        Please verify your email address to complete your registration.
      </AlertDescription>
    </Alert>
  );
}

function ErrorMessage() {
  return (
    <Alert className={'m-4'}>
      <AlertIcon>
        <X
          className={
            'h-14 w-14 rounded-full border-8 border-red-100 bg-red-500 p-2 text-white'
          }
        />
      </AlertIcon>

      <AlertTitle>Sorry, Something went wrong.</AlertTitle>

      <AlertDescription>Please try again later.</AlertDescription>
    </Alert>
  );
}
