import { useEffect } from 'react';

import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { useCreateSessionFromUrl } from '@kit/auth';

export default function CallbackPage() {
  const createSessionFromUrl = useCreateSessionFromUrl();
  const url = Linking.useURL();

  void SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    (async () => {
      if (!url || !url.includes('callback')) {
        return;
      }

      const session = await createSessionFromUrl(url);

      if (session) {
        return router.replace('/');
      }
    })();

    return () => {
      void SplashScreen.hideAsync();
    };
  }, [createSessionFromUrl, url]);

  return null;
}
