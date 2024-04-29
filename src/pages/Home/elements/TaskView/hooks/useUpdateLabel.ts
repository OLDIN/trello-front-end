import { useMutation, useQueryClient } from '@tanstack/react-query';

import { labelsApi } from 'services/api';
import { PartialUpdateLabel } from 'services/api/endpoints/labels';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';

interface IUseUpdateLabelProps {
  taskId: number;
  labelId: number;
  onSuccess?: (data: PartialUpdateLabel) => void;
}

export function useUpdateLabel({
  taskId,
  labelId,
  onSuccess,
}: IUseUpdateLabelProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartialUpdateLabel) =>
      labelsApi.partialUpdate(labelId, data),
    onSuccess: (data) => {
      queryClient.setQueryData([QueryKey.TASKS, taskId], (oldTask: ITask) => {
        if (!oldTask || !oldTask.labels) return oldTask;

        return {
          ...oldTask,
          labels: [
            ...oldTask.labels.map((label) =>
              label.id === labelId ? data : label,
            ),
          ],
        };
      });

      queryClient.setQueryData([QueryKey.LABELS, labelId], (oldLabel) => {
        if (!oldLabel) return oldLabel;

        return {
          ...oldLabel,
          ...data,
        };
      });

      onSuccess?.(data);
    },
  });
}
