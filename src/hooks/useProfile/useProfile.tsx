import { useQuery } from '@tanstack/react-query';

import authApi from '../../services/api/endpoints/auth';
import { QueryKey } from 'enums/QueryKey.enum';

import useAuth from '../useAuth';

export default function useProfile({ enabled = true } = {}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: [QueryKey.ME],
    queryFn: authApi.getProfile,
    enabled: !!token && enabled,
  });
}
