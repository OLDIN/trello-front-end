import axiosInstance from '../axios';

import { TaskCheckListItem } from 'types/TaskChecklist';

export type PartialUpdateChecklistItemData = Pick<
  TaskCheckListItem,
  'isCompleted'
>;

export type CreateChecklistItemData = Pick<TaskCheckListItem, 'name'>;

export default {
  partialUpdate: (
    taskId: number,
    checklistId: number,
    itemId: number,
    data: PartialUpdateChecklistItemData,
  ) =>
    axiosInstance.patch(
      `/v1/tasks/${taskId}/checklists/${checklistId}/items/${itemId}`,
      data,
    ),
  create: (
    taskId: number,
    checklistId: number,
    data: CreateChecklistItemData,
  ) =>
    axiosInstance
      .post(`/v1/tasks/${taskId}/checklists/${checklistId}/items`, data)
      .then((res) => res.data),
};
