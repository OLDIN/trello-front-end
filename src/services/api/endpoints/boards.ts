import { CreateQueryParams, RequestQueryBuilder } from '@dataui/crud-request';
import { AxiosResponse } from 'axios';
import { Board } from '../../../types/Board';
import axios from '../axios';

export default {
  getBoards: (query?: CreateQueryParams) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();
    return axios
      .get<Board[], AxiosResponse<Board[]>>(`/v1/boards?${queryString}`)
      .then((res) => res.data);
  },
};
