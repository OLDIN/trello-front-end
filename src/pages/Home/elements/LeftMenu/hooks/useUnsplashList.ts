import { DefaultError, InfiniteData } from '@tanstack/react-query';

import { unsplashApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import { useInfinityList } from 'hooks/useInfiniteQuery';
import { SearchPhotosResponse, UnsplashPhoto } from 'types/Unsplash-photo';

interface PhotosListContentProps {
  search?: string;
}

export const useUnsplashList = ({ search }: PhotosListContentProps = {}) => {
  const {
    data: { pages: collectionPhotoPages = [] } = { pages: [], pageParams: [] },
    observerElem: observerElemList,
    isFetchingNextPage: isFetchingNextPageList,
  } = useInfinityList<
    UnsplashPhoto[],
    DefaultError,
    InfiniteData<UnsplashPhoto[], number>,
    [QueryKey.UNSPLASH_PHOTOS]
  >({
    queryKey: [QueryKey.UNSPLASH_PHOTOS],
    queryFn: ({ pageParam }) => unsplashApi.fetchPhotos({ page: pageParam }),
    initialPageParam: 1,
    enabled: !search?.length,
  });

  const {
    data: { pages: searchPhotoPages = [] } = { pages: [], pageParams: [] },
    observerElem: observerElemSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
  } = useInfinityList<
    SearchPhotosResponse['results'],
    DefaultError,
    InfiniteData<SearchPhotosResponse['results'], number>,
    [QueryKey.UNSPLASH_PHOTOS, { search: string }]
  >({
    queryKey: [QueryKey.UNSPLASH_PHOTOS, { search: search ?? '' }],
    queryFn: ({ pageParam }) =>
      unsplashApi.searchPhotos({ page: pageParam, search: search ?? '' }),
    initialPageParam: 1,
    enabled: !!search?.length,
  });

  return {
    observerElem: search?.length ? observerElemSearch : observerElemList,
    photoPages: search?.length ? searchPhotoPages : collectionPhotoPages,
    isFetchingNextPage: search?.length
      ? isFetchingNextPageSearch
      : isFetchingNextPageList,
  };
};
