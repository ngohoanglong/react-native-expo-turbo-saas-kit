import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { GlobalThemeProvider } from './theme-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalThemeProvider>{children}</GlobalThemeProvider>
    </QueryClientProvider>
  );
}
