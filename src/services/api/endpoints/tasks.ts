import { AxiosResponse } from 'axios';
import { Task } from '../../../types/Task';
import axios from '../axios';

export type PartialUpdateTask = Partial<
  Pick<Task, 'name' | 'description' | 'taskListId' | 'id'>
>;

export default {
  partialUpdate: ({ id, ...data }: PartialUpdateTask) =>
    axios
      .patch<Task, AxiosResponse<Task>>(`/v1/tasks/${id}`, data)
      .then((res) => res.data),
};
