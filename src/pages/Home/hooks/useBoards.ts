import { useQuery } from '@tanstack/react-query';
import { boardsApi } from 'services/api';

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: () =>
      boardsApi.getBoards({
        join: [
          {
            field: 'backgroundImage',
          },
        ],
      }),
  });
}
