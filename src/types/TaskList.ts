import { Task } from './Task';

export interface TaskList {
  id: number;
  name: string;
  boardId: number;
  tasks: Task[];
}
