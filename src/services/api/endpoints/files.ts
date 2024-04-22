import type { AxiosResponse } from 'axios';
import { IFile } from '../../../types/File';
import axios from '../axios';

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
};
