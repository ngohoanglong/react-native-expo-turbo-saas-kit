import type { PropsWithChildren } from 'react';

import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { Spinner } from './spinner';

export function LoadingOverlay({
  children,
  className,
  fullPage = true,
  spinnerClassName,
}: PropsWithChildren<{
  className?: string;
  spinnerClassName?: string;
  fullPage?: boolean;
  displayLogo?: boolean;
}>) {
  return (
    <View
      className={cn(
        'flex flex-col items-center justify-center space-y-4',
        className,
        {
          [`bg-background fixed left-0 top-0 z-[100] h-screen w-screen`]:
            fullPage,
        },
      )}
    >
      <Spinner className={spinnerClassName} />

      <View className={'text-muted-foreground text-sm'}>{children}</View>
    </View>
  );
}
