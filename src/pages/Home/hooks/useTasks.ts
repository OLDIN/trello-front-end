import { useQuery } from '@tanstack/react-query';

import { tasksApi } from 'services/api';
import { QueryKey } from 'enums/QueryKey.enum';
// import useProfile from 'hooks/useProfile/useProfile';

interface IUseTasksProps {
  boardId: number;
  assigneeId?: number;
}

export function useTasks({ boardId, assigneeId }: IUseTasksProps) {
  // const { data: profile } = useProfile();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
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
            select: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            field: 'assignees.photo',
            select: ['path'],
          },
          {
            field: 'cover',
            select: ['path'],
          },
          {
            field: 'attachments',
            select: ['id'],
          },
          {
            field: 'comments',
            select: ['id'],
          },
          {
            field: 'labels',
            select: ['id', 'name', 'color'],
            on: [
              {
                field: 'labels.isEnable',
                operator: '$eq',
                value: true,
              },
            ],
          },
          {
            field: 'checklists',
            select: ['id'],
          },
          {
            field: 'checklists.items',
            select: ['isCompleted'],
          },
          // {
          //   field: 'watchers',
          //   select: ['id'],
          //   on: [
          //     {
          //       field: 'watchers.id',
          //       operator: '$eq',
          //       value: profile?.id,
          //     },
          //   ],
          // },
        ],
      }),
    enabled: !!boardId,
  });
}
