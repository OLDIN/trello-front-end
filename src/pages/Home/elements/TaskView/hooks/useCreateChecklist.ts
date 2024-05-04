import {
  DefaultError,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { checklistApi } from 'services/api';
import { ICreateChecklistPayload } from 'services/api/endpoints/checklist';
import { QueryKey } from 'enums/QueryKey.enum';
import { TaskCheckList } from 'types/TaskChecklist';

interface IUseCreateChecklistProps
  extends Omit<
    UseMutationOptions<TaskCheckList, DefaultError, ICreateChecklistPayload>,
    'mutationFn'
  > {
  taskId: number;
}

export function useCreateChecklist({
  taskId,
  onSuccess,
  ...props
}: IUseCreateChecklistProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...props,
    mutationFn: (data: ICreateChecklistPayload) =>
      checklistApi.create(taskId, data, {
        join: [{ field: 'items' }],
      }),
    onSuccess: (result, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.CHECKLISTS, { taskId }],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_TASK_BY_ID, taskId],
      });
      onSuccess?.(result, variables, context);
    },
  });
}
