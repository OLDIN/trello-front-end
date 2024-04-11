import type { AxiosResponse } from 'axios';
import axios from '../axios';

export interface IUploadData {
  file: File;
}

export interface IUploadResponse {
  file: {
    path: string;
    id: string;
  };
}

export default {
  upload: (data: FormData) =>
    axios
      .post<
        IUploadResponse,
        AxiosResponse<IUploadResponse>,
        FormData
      >('/v1/files/upload', data)
      .then((res) => res.data),
};
