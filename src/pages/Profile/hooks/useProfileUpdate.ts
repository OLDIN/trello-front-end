import { useMutation } from '@tanstack/react-query';

import authApi from '../../../services/api/endpoints/auth';
import { IProfile } from '../../../types/Profile';

interface IUseProfileUpdate {
  onSuccess?: (data: IProfile) => Promise<unknown> | unknown;
}

export default function useProfileUpdate({
  onSuccess,
}: IUseProfileUpdate = {}) {
  return useMutation({
    mutationFn: (data: unknown) => authApi.updateProfile(data),
    onSuccess,
  });
}
