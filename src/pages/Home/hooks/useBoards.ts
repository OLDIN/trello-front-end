import { useQuery } from '@tanstack/react-query';

import { boardsApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';

export function useBoards() {
  return useQuery({
    queryKey: [QueryKey.BOARDS],
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
