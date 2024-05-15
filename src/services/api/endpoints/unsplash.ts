import axiosInstance from '../axios';

import { SearchPhotosResponse, UnsplashPhoto } from 'types/Unsplash-photo';

interface FetchAllPhotosQueryParams {
  page: number;
}

interface SearchPhotosQueryParams extends FetchAllPhotosQueryParams {
  search: string;
}

export default {
  fetchPhotos: ({ page }: FetchAllPhotosQueryParams) =>
    axiosInstance
      .get<UnsplashPhoto[]>('/v1/proxy/unsplash/collections/317099/photos', {
        params: {
          page,
          perPage: 30,
          orderBy: 'latest',
        },
      })
      .then((res) => res.data),
  searchPhotos: ({
    page,
    search,
  }: SearchPhotosQueryParams): Promise<SearchPhotosResponse['results']> =>
    axiosInstance
      .get<SearchPhotosResponse>('/v1/proxy/unsplash/search/photos', {
        params: {
          page,
          perPage: 30,
          orderBy: 'latest',
          query: search,
        },
      })
      .then((res) => res.data.results),
};
