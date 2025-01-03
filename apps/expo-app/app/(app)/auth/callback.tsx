import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { useCreateSessionFromUrl } from '@kit/auth';

export default function CallbackPage() {
  const createSessionFromUrl = useCreateSessionFromUrl();
  const url = Linking.useURL();

  void SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    (async () => {
      console.log('url', await Linking.parseInitialURLAsync());
      if (!url || !url.includes('callback')) {
        return;
      }

      const session = await createSessionFromUrl(url);
      console.log(session);
    })();

    return () => {
      void SplashScreen.hideAsync();
    };
  }, [createSessionFromUrl, url]);

  return <></>;
}
