import { useQuery } from '@tanstack/react-query';

import { taskListsApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';

interface IUseTaskLists {
  boardId: number;
}

export function useTaskLists({ boardId }: IUseTaskLists) {
  return useQuery({
    queryKey: [QueryKey.TASK_LISTS, { boardId }],
    queryFn: () => taskListsApi.getAll(boardId),
    enabled: !!boardId,
  });
}
