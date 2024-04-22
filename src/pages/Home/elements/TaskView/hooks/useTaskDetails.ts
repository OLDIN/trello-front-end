import { useQuery } from '@tanstack/react-query';

import tasksApi from '../../../../../services/api/endpoints/tasks';

interface IUseTaskDetails {
  taskId: number;
}

export function useTaskDetails({ taskId }: IUseTaskDetails) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () =>
      tasksApi.getById(taskId, {
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
            field: 'taskList',
          },
          {
            field: 'labels',
          },
          {
            field: 'comments',
          },
          {
            field: 'comments.author',
          },
        ],
      }),
  });
}
