import {
  DefaultError,
  MutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { taskListsApi } from 'services/api';
import { IPartialUpdateTaskListPayload } from 'services/api/endpoints/task-lists';
import { QueryKey } from 'enums/QueryKey.enum';
import { TaskList } from 'types/TaskList';

interface IUsePartialUpdateTaskListProps<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> extends Omit<
    MutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  > {
  boardId: number;
  taskListId: number;
}

export function usePartialUpdateTaskList({
  taskListId,
  boardId,
  ...options
}: IUsePartialUpdateTaskListProps<
  TaskList,
  DefaultError,
  IPartialUpdateTaskListPayload
>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: IPartialUpdateTaskListPayload) =>
      taskListsApi.partialUpdate(taskListId, data),
    onSuccess: (data) => {
      queryClient.setQueryData<TaskList[]>(
        [QueryKey.TASK_LISTS, { boardId }],
        (oldTaskLists) => {
          if (!oldTaskLists) return oldTaskLists;

          return oldTaskLists.map((taskList) =>
            taskList.id === taskListId ? data : taskList,
          );
        },
      );
    },
  });
}
