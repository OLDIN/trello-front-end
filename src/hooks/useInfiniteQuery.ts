import { useCallback, useEffect, useRef } from 'react';
import {
  DefaultError,
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  WithRequired,
} from '@tanstack/react-query';

interface useInfinityListProps<
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
> extends WithRequired<
    Omit<
      UseInfiniteQueryOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey,
        number
      >,
      'getNextPageParam'
    >,
    'queryKey'
  > {
  limit?: number;
}

export const useInfinityList = <
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
>({
  limit,
  queryKey,
  queryFn,
  initialPageParam,
  ...restParams
}: useInfinityListProps<TQueryFnData, TError, TData, TQueryKey>) => {
  const observerElem = useRef(null);

  // eslint-disable-next-line @tanstack/query/no-rest-destructuring
  const { fetchNextPage, hasNextPage, ...rest } = useInfiniteQuery({
    ...restParams,
    queryKey,
    queryFn,
    getNextPageParam: (_lastPage, _pages, lastPageParam) => {
      return lastPageParam + 1;
    },
    initialPageParam: initialPageParam ?? 1,
    gcTime: 0,
    staleTime: 0,
  });

  const handleObserver = useCallback(
    (entries: any) => {
      const [target] = entries;
      if (target.isIntersecting) {
        fetchNextPage();
      }
    },
    [fetchNextPage],
  );

  useEffect(() => {
    const element = observerElem.current;
    const option = { threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (element) {
      observer.observe(element);
      return () => observer.unobserve(element);
    }
  }, [fetchNextPage, hasNextPage, handleObserver]);

  return {
    observerElem,
    hasNextPage,
    fetchNextPage,
    ...rest,
  };
};
