import axios from '../axios';
import { AxiosResponse } from 'axios';

import { TaskList } from '../../../types/TaskList';

export default {
  getAll: (boardId: number) =>
    axios
      .get<
        TaskList[],
        AxiosResponse<TaskList[]>
      >(`/v1/task-lists?filter=boardId||eq||${boardId}`)
      .then((res) => res.data),
};
