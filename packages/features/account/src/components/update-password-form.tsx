import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Input,
  Text,
  X,
} from '@kit/ui';

import {
  UpdatePasswordFormValues,
  updatePasswordSchema,
  useUpdatePassword,
} from '../lib/hooks/use-update-password';

export function UpdatePasswordForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const updatePasswordMutation = useUpdatePassword();

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <View className="flex flex-col space-y-4">
      {showSuccessMessage && <UpdatePasswordAlert type="success" />}

      {updatePasswordMutation.error && (
        <UpdatePasswordAlert
          type="error"
          message={updatePasswordMutation.error.message}
        />
      )}

      <Controller
        control={form.control}
        name="password"
        render={({ field }) => (
          <Input
            secureTextEntry
            placeholder="Enter your new password"
            {...field}
          />
        )}
      />

      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <Input
            secureTextEntry
            placeholder="Confirm your new password"
            {...field}
          />
        )}
      />

      <Button
        disabled={updatePasswordMutation.isPending}
        onPress={form.handleSubmit((values) => {
          updatePasswordMutation.mutate(values, {
            onSuccess: () => {
              setShowSuccessMessage(true);
              form.reset();
            },
            onError: () => {
              setShowSuccessMessage(false);
            },
          });
        })}
      >
        <Text>
          {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
        </Text>
      </Button>
    </View>
  );
}

function UpdatePasswordAlert({
  type,
  message,
}: {
  type: 'error' | 'success';
  message?: string;
}) {
  if (type === 'success') {
    return (
      <Alert className={'m-4'}>
        <AlertTitle>Password Updated</AlertTitle>
        <AlertDescription>
          Your password has been successfully updated. You can use your new
          password the next time you sign in.
        </AlertDescription>
      </Alert>
    );
  }

  if (type === 'error' && message) {
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
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return null;
}
