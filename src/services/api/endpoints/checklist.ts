import axiosInstance from '../axios';
import { AxiosResponse } from 'axios';

import { TaskCheckList } from 'types/TaskChecklist';

export type ICreateChecklistPayload = Pick<TaskCheckList, 'name'>;

export default {
  deleteById: (taskId: number, checklistId: number) =>
    axiosInstance.delete(`/v1/tasks/${taskId}/checklists/${checklistId}`),
  create: (taskId: number, data: ICreateChecklistPayload) =>
    axiosInstance
      .post<
        TaskCheckList,
        AxiosResponse<TaskCheckList>
      >(`/v1/tasks/${taskId}/checklists`, data)
      .then((res) => res.data),
};
