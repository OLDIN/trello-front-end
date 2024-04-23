import { useQuery } from '@tanstack/react-query';

import tasksApi from '../../../../../services/api/endpoints/tasks';
import { QueryKey } from 'enums/QueryKey.enum';

interface IUseTaskDetails {
  taskId: number;
}

export function useTaskDetails({ taskId }: IUseTaskDetails) {
  return useQuery({
    queryKey: [QueryKey.TASKS, taskId],
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
