import { View } from 'react-native';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui';

import { UpdateEmailForm } from './update-email-form';
import { UpdatePasswordForm } from './update-password-form';

export function UpdateAccountContainer() {
  return (
    <View className={'flex-col justify-center'}>
      <UpdateEmailFormContainer />
      <UpdatePasswordFormContainer />
    </View>
  );
}

function UpdateEmailFormContainer() {
  return (
    <View className={'flex-col justify-center gap-4 p-4'}>
      <Card>
        <CardHeader>
          <CardTitle className={'text-base'}>Update your email</CardTitle>

          <CardDescription>
            Update your email. After updating your email, please verify it by
            clicking the link in the email we sent you.
          </CardDescription>
        </CardHeader>

        <CardContent className={'flex-col justify-center gap-4'}>
          <UpdateEmailForm />
        </CardContent>
      </Card>
    </View>
  );
}

function UpdatePasswordFormContainer() {
  return (
    <View className={'flex-col justify-center gap-4 p-4'}>
      <Card>
        <CardHeader>
          <CardTitle className={'text-base'}>Update your password</CardTitle>

          <CardDescription>
            Update your password. After updating your password, please verify it
            by clicking the link in the email we sent you.
          </CardDescription>
        </CardHeader>

        <CardContent className={'flex-col justify-center gap-4'}>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </View>
  );
}
