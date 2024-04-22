import { useQuery } from '@tanstack/react-query';
import { tasksApi } from 'services/api';

interface IUseTasksProps {
  boardId: number;
  assigneeId?: number;
}

export function useTasks({ boardId, assigneeId }: IUseTasksProps) {
  return useQuery({
    queryKey: ['tasks', { boardId, assigneeId }],
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
            field: 'assignee',
          },
          {
            field: 'assignee.photo',
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
        ],
      }),
    enabled: !!boardId,
  });
}
