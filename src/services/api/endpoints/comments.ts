import axiosInstance from '../axios';
import { AxiosResponse } from 'axios';

import { TaskComment } from '../../../types/TaskComment';

import { CreateQueryParams, RequestQueryBuilder } from '@dataui/crud-request';

export interface ICreateCommentPayload {
  message: string;
}

export default {
  deleteById: (taskId: number, commentId: number) =>
    axiosInstance
      .delete(`/v1/tasks/${taskId}/comments/${commentId}`)
      .then((res) => res.data),
  create: (
    taskId: number,
    data: ICreateCommentPayload,
    query?: CreateQueryParams,
  ) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axiosInstance
      .post<
        TaskComment,
        AxiosResponse<TaskComment>
      >(`/v1/tasks/${taskId}/comments?${queryString}`, data)
      .then((res) => res.data);
  },
};
