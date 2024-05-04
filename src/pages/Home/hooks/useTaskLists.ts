import { useQuery } from '@tanstack/react-query';

import { taskListsApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
import useProfile from 'hooks/useProfile/useProfile';

interface IUseTaskLists {
  boardId: number;
}

export function useTaskLists({ boardId }: IUseTaskLists) {
  const { data: profile } = useProfile();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [QueryKey.TASK_LISTS, { boardId }],
    queryFn: () =>
      taskListsApi.getAll({
        filter: [
          {
            field: 'boardId',
            operator: '$eq',
            value: boardId,
          },
        ],
        join: [
          {
            field: 'watchers',
            select: ['id'],
            on: [
              {
                field: 'watchers.id',
                operator: '$eq',
                value: profile?.id,
              },
            ],
          },
        ],
      }),
    enabled: !!boardId,
  });
}
