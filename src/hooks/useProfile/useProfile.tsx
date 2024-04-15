import { useQuery } from '@tanstack/react-query';

import useAuth from '../useAuth';
import authApi from '../../services/api/endpoints/auth';

export default function useProfile({ enabled = true } = {}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.getProfile,
    enabled: !!token && enabled,
  });
}
