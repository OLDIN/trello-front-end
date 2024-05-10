import { useMutation, useQueryClient } from '@tanstack/react-query';

import { labelsApi } from 'services/api';
import { PartialUpdateLabel } from 'services/api/endpoints/labels';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';
import { TaskLabel } from 'types/TaskLabel';

interface IUseUpdateLabelProps {
  boardId: number;
  taskId: number;
  labelId: number;
  onSuccess?: (data: PartialUpdateLabel) => void;
}

export function useUpdateLabel({
  boardId,
  taskId,
  labelId,
  onSuccess,
}: IUseUpdateLabelProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartialUpdateLabel) =>
      labelsApi.partialUpdate(labelId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(
        [QueryKey.GET_TASK_BY_ID, taskId],
        (oldTask: ITask) => {
          if (!oldTask || !oldTask.labels) return oldTask;

          return {
            ...oldTask,
            labels: [
              ...oldTask.labels.map((label) =>
                label.id === labelId ? data : label,
              ),
            ],
          };
        },
      );

      queryClient.setQueryData([QueryKey.LABELS, labelId], (oldLabel) => {
        if (!oldLabel) return oldLabel;

        return {
          ...oldLabel,
          ...data,
        };
      });

      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_TASKS],
      });

      queryClient.setQueryData<TaskLabel[]>(
        [QueryKey.LABELS, { taskId }],
        (oldLabels) => {
          if (!oldLabels) return oldLabels;

          return oldLabels.map((label) => {
            if (label.id === labelId) {
              return {
                ...label,
                ...data,
              };
            }

            return label;
          });
        },
      );

      onSuccess?.(data);
    },
  });
}
