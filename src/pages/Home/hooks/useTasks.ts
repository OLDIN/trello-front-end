import { useQuery } from '@tanstack/react-query';

import { tasksApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';

interface IUseTasksProps {
  boardId: number;
  assigneeId?: number;
}

export function useTasks({ boardId, assigneeId }: IUseTasksProps) {
  return useQuery({
    queryKey: [QueryKey.TASKS, { boardId, assigneeId }],
    queryFn: () =>
      tasksApi.list({
        filter: [
          {
            field: 'boardId',
            operator: 'eq',
            value: boardId,
          },
          ...(assigneeId
            ? [
                {
                  field: 'assigneeId',
                  operator: 'eq',
                  value: assigneeId,
                },
              ]
            : []),
        ],
        join: [
          {
            field: 'assignees',
          },
          {
            field: 'assignees.photo',
          },
          {
            field: 'cover',
          },
          {
            field: 'attachments',
          },
          {
            field: 'comments',
          },
          {
            field: 'labels',
          },
        ],
      }),
    enabled: !!boardId,
  });
}
