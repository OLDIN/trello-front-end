import { useQuery } from '@tanstack/react-query';

import authApi from '../../services/api/endpoints/auth';

import useAuth from '../useAuth';

export default function useProfile({ enabled = true } = {}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.getProfile,
    enabled: !!token && enabled,
  });
}
