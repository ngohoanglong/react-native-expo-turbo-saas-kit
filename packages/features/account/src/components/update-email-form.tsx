import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { useUpdateUser } from '@kit/supabase';
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

import { UpdateUserSchema } from '../lib/hooks/use-update-user';

export function UpdateEmailForm() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const updateEmailMutation = useUpdateUser();

  const form = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <View className="flex flex-col space-y-4">
      {showSuccessMessage && <UpdateEmailAlert type="success" />}

      {updateEmailMutation.error && (
        <UpdateEmailAlert
          type="error"
          message={updateEmailMutation.error.message}
        />
      )}

      <Controller
        control={form.control}
        name="email"
        render={({ field }) => (
          <Input inputMode={'email'} placeholder="Email" {...field} />
        )}
      />

      <Button
        disabled={updateEmailMutation.isPending}
        onPress={form.handleSubmit((data) => {
          updateEmailMutation.mutate(
            {
              ...data,
              redirectTo: `${window.location.origin}`,
            },
            {
              onSuccess: () => {
                setShowSuccessMessage(true);
                form.reset();
              },
              onError: () => {
                setShowSuccessMessage(false);
              },
            },
          );
        })}
      >
        <Text>
          {updateEmailMutation.isPending ? 'Updating...' : 'Update Email'}
        </Text>
      </Button>
    </View>
  );
}

function UpdateEmailAlert({
  type,
  message,
}: {
  type: 'error' | 'success';
  message?: string;
}) {
  if (type === 'success') {
    return (
      <Alert className={'m-4'}>
        <AlertTitle>Verification Required</AlertTitle>

        <AlertDescription>
          We've sent a confirmation link to your new email address. Please check
          your inbox and click the link to complete the email change.
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

        <AlertDescription>Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return null;
}
