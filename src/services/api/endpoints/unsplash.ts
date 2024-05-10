import axiosInstance from '../axios';

import { UnsplashPhoto } from 'types/Unsplash-photo';

export default {
  fetchPhotos: () =>
    axiosInstance
      .get<UnsplashPhoto[]>('/v1/proxy/unsplash/collections/317099/photos', {
        params: {
          page: 1,
          perPage: 30,
          orderBy: 'latest',
        },
      })
      .then((res) => res.data),
};
