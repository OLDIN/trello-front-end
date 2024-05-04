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
    MutationOptions<ITask, DefaultError, IPartialUpdateTask>,
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
      tasksApi.partialUpdate(taskId, data),
    onSuccess: (result, variables, context) => {
      queryClient.setQueryData([QueryKey.TASKS, taskId], (oldTask) => {
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
