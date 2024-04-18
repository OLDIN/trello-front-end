import { AxiosResponse } from 'axios';
import { Board } from '../../../types/Board';
import axios from '../axios';

export default {
  getBoards: () =>
    axios
      .get<Board[], AxiosResponse<Board[]>>('/v1/boards')
      .then((res) => res.data),
};
