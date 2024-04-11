import { useMutation } from '@tanstack/react-query';

import authApi from '../../../services/api/endpoints/auth';

interface IUseProfileUpdate {
  onSuccess?: () => Promise<unknown> | unknown;
}

export default function useProfileUpdate({
  onSuccess,
}: IUseProfileUpdate = {}) {
  return useMutation({
    mutationFn: (data: unknown) => authApi.updateProfile(data),
    onSuccess,
  });
}
