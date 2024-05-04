import {
  DefaultError,
  MutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { tasksApi } from 'services/api';
import { IPartialUpdateTask } from 'services/api/endpoints/tasks';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

interface IUseUpdateTaskProps
  extends Omit<
    MutationOptions<
      ITask,
      DefaultError,
      IPartialUpdateTask,
      {
        previousTask: ITask | undefined;
      }
    >,
    'mutationFn'
  > {
  taskId: number;
}

export function useUpdateTask({
  taskId,
  onSuccess,
  ...props
}: IUseUpdateTaskProps) {
  const queryClient = useQueryClient();
  return useMutation({
    ...props,
    mutationFn: (data: IPartialUpdateTask) =>
      tasksApi.partialUpdate(taskId, data, {
        join: [
          {
            field: 'assignees',
          },
          {
            field: 'assignees.photo',
          },
        ],
      }),
    onMutate: async (data) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryClient.cancelQueries({
        queryKey: [QueryKey.GET_TASK_BY_ID, taskId],
      });

      const previousTask = queryClient.getQueryData<ITask>([
        QueryKey.GET_TASK_BY_ID,
        taskId,
      ]);

      queryClient.setQueryData([QueryKey.GET_TASK_BY_ID, taskId], (oldTask) => {
        if (!oldTask) return;

        return {
          ...oldTask,
          ...data,
        };
      });

      return { previousTask };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        [QueryKey.GET_TASK_BY_ID, taskId],
        context?.previousTask,
      );
    },
    onSuccess: (result, variables, context) => {
      queryClient.setQueryData([QueryKey.GET_TASK_BY_ID, taskId], (oldTask) => {
        if (!oldTask) return;

        return {
          ...oldTask,
          ...result,
        };
      });
      onSuccess?.(result, variables, context);
    },
  });
}
