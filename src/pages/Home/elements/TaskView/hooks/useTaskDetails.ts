import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import tasksApi, {
  ITaskDetainedResponse,
} from '../../../../../services/api/endpoints/tasks';
import { QueryKey } from 'enums/QueryKey.enum';
import { TaskLabel } from 'types/TaskLabel';

interface IUseTaskDetails {
  taskId: number;
}

interface IUseTaskDetailsResult {
  task: ITaskDetainedResponse | undefined;
  enabledLabels: TaskLabel[];
  isLoading: boolean;
  taskMembersIds: number[];
}

export function useTaskDetails({
  taskId,
}: IUseTaskDetails): IUseTaskDetailsResult {
  const { data: task, isLoading } = useQuery({
    queryKey: [QueryKey.GET_TASK_BY_ID, taskId],
    queryFn: () =>
      tasksApi.getById(taskId, {
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
            field: 'taskList',
          },
          {
            field: 'labels',
          },
          {
            field: 'comments',
          },
          {
            field: 'comments.reactions',
          },
          {
            field: 'comments.reactions.users',
            select: ['id', 'firstName', 'lastName'],
          },
          {
            field: 'comments.author',
          },
          {
            field: 'comments.author.photo',
          },
          {
            field: 'checklists',
          },
          {
            field: 'checklists.items',
          },
        ],
      }),
  });

  const enabledLabels = useMemo(() => {
    return task?.labels?.filter((label) => label.isEnable) ?? [];
  }, [task?.labels]);

  const taskMembersIds = useMemo(() => {
    return task?.assignees?.map((member) => member.id) ?? [];
  }, [task?.assignees]);

  return {
    task,
    enabledLabels,
    isLoading,
    taskMembersIds,
  };
}
