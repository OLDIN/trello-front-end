import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import fileApi, { IUploadResponse } from '../../services/api/endpoints/files';

interface IUseFileUpload {
  // onSuccess?: () => Promise<unknown> | unknown;
  onSuccess?: (data: IUploadResponse) => Promise<unknown> | unknown;
}

export default function useFileUpload({ onSuccess }: IUseFileUpload = {}) {
  return useMutation<IUploadResponse, AxiosError, FormData>({
    mutationFn: (data) => fileApi.upload(data),
    onSuccess,
  });
}
