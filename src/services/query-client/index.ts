import { QueryClient } from '@tanstack/query-core';

export const defaultStaleTime = 5 * 60 * 1000; // 5 minutes
export const defaultCacheTime = 10 * 60 * 1000; // 10 minutes

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      staleTime: defaultStaleTime,
      gcTime: defaultCacheTime,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      retry: 5, // retry attempts on failed request
    },
  },
});
