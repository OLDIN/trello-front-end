import axiosInstance from '../axios';
import { AxiosResponse } from 'axios';

import { TaskCheckList, TaskCheckListItem } from 'types/TaskChecklist';

import { CreateQueryParams, RequestQueryBuilder } from '@dataui/crud-request';

export type ICreateChecklistPayload = Pick<TaskCheckList, 'name'> & {
  items?: Pick<TaskCheckListItem, 'name' | 'isCompleted'>[];
};

export default {
  deleteById: (taskId: number, checklistId: number) =>
    axiosInstance.delete(`/v1/tasks/${taskId}/checklists/${checklistId}`),
  create: (
    taskId: number,
    data: ICreateChecklistPayload,
    query?: CreateQueryParams,
  ) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axiosInstance
      .post<
        TaskCheckList,
        AxiosResponse<TaskCheckList>
      >(`/v1/tasks/${taskId}/checklists?${queryString}`, data)
      .then((res) => res.data);
  },
  fetchAll: (query?: CreateQueryParams) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();
    return axiosInstance
      .get<
        TaskCheckList[],
        AxiosResponse<TaskCheckList[]>
      >(`/v1/checklists?${queryString}`)
      .then((res) => res.data);
  },
};
