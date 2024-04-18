import { AxiosResponse } from 'axios';
import { TaskList } from '../../../types/TaskList';
import axios from '../axios';

export default {
  getAll: (boardId: number) =>
    axios
      .get<
        TaskList[],
        AxiosResponse<TaskList[]>
      >(`/v1/task-lists?filter=boardId||eq||${boardId}&join=tasks`)
      .then((res) => res.data),
};
