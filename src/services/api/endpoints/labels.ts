import axiosInstance from '../axios';
import { AxiosResponse } from 'axios';

import { TaskLabel } from 'types/TaskLabel';

import { CreateQueryParams, RequestQueryBuilder } from '@dataui/crud-request';

export type PartialUpdateLabel = Partial<
  Pick<TaskLabel, 'color' | 'name' | 'isEnable'>
>;

export default {
  partialUpdate: (labelId: number, data: PartialUpdateLabel) =>
    axiosInstance
      .patch<TaskLabel, AxiosResponse<TaskLabel>>(`/v1/labels/${labelId}`, data)
      .then((res) => res.data),
  fetchOneById: (labelId: number) =>
    axiosInstance
      .get<TaskLabel, AxiosResponse<TaskLabel>>(`/v1/labels/${labelId}`)
      .then((res) => res.data),
  fetchAll: (query?: CreateQueryParams) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axiosInstance
      .get<TaskLabel[]>(`/v1/labels?${queryString}`)
      .then((res) => res.data);
  },
};
