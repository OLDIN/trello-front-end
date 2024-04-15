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
      retry: 0, // retry attempts on failed request
    },
  },
});
