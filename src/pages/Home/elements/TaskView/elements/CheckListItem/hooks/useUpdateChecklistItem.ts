import { useMutation, useQueryClient } from '@tanstack/react-query';

import { checklistItemsApi } from 'services/api';
import { PartialUpdateChecklistItemData } from 'services/api/endpoints/checklist-items';
import { QueryKey } from 'enums/QueryKey.enum';
import { ITask } from 'types/Task';
import { TaskCheckListItem } from 'types/TaskChecklist';

interface IUseUpdateCheckListItem {
  taskId: number;
  checklistId: number;
  item: TaskCheckListItem;
}

export function useUpdateCheckListItem({
  taskId,
  checklistId,
  item,
}: IUseUpdateCheckListItem) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartialUpdateChecklistItemData) =>
      checklistItemsApi.partialUpdate(taskId, checklistId, item.id, data),
    onSuccess: (data) => {
      queryClient.setQueryData<ITask>(
        [QueryKey.GET_TASK_BY_ID, taskId],
        (oldTask) => {
          if (!oldTask || !oldTask.checklists) return oldTask;
          return {
            ...oldTask,
            checklists: oldTask.checklists.map((checklist) => {
              if (!checklist.items) return checklist;

              if (checklist.id === checklistId) {
                return {
                  ...checklist,
                  items: checklist.items.map((i) => {
                    if (i.id === item.id) {
                      return data;
                    }
                    return i;
                  }),
                };
              }
              return checklist;
            }),
          };
        },
      );
    },
  });
}
