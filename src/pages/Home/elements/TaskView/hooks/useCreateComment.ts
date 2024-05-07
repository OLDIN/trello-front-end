import {
  DefaultError,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { commentsApi } from 'services/api';
import { ICreateCommentPayload } from 'services/api/endpoints/comments';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';
import { TaskComment } from 'types/TaskComment';

interface IUseCreateCommentProps
  extends Omit<
    UseMutationOptions<TaskComment, DefaultError, ICreateCommentPayload>,
    'mutationFn'
  > {
  taskId: number;
}

export function useCreateComment({
  taskId,
  onSuccess,
  ...props
}: IUseCreateCommentProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (data: ICreateCommentPayload) =>
      commentsApi.create(taskId, data, {
        join: [
          {
            field: 'author',
          },
          {
            field: 'author.photo',
          },
        ],
      }),
    onSuccess: (result, variables, context) => {
      queryClient.setQueryData<ITask>(
        [QueryKey.GET_TASK_BY_ID, taskId],
        (oldTask) => {
          if (!oldTask || !oldTask.comments) return oldTask;

          return {
            ...oldTask,
            comments: [result, ...oldTask.comments],
          };
        },
      );
      onSuccess?.(result, variables, context);
    },
  });
}
