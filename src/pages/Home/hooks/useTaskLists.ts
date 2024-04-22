import { useQuery } from '@tanstack/react-query';

import { taskListsApi } from 'services/api';

interface IUseTaskLists {
  boardId: number;
}

export function useTaskLists({ boardId }: IUseTaskLists) {
  return useQuery({
    queryKey: ['taskLists', { boardId }],
    queryFn: () => taskListsApi.getAll(boardId),
    enabled: !!boardId,
  });
}
