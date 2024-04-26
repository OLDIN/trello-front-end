import { ITask } from './Task';

export interface TaskCheckListItem {
  id: number;
  name: string;
  isCompleted: boolean;
}

export interface TaskCheckList {
  id: number;
  name: string;
  items?: TaskCheckListItem[];
  task?: ITask;
  taskId: number;
}
