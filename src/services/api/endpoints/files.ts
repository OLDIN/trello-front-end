import axios from '../axios';
import type { AxiosResponse } from 'axios';

import { IFile } from '../../../types/File';

export interface IUploadData {
  file: File;
}

export interface IUploadResponse {
  file: IFile;
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
  delete: (id: string) =>
    axios.delete(`/v1/files/${id}`).then((res) => res.data),
};
