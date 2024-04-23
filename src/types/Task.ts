import { Board } from './Board';
import { IFile } from './File';
import { TaskComment } from './TaskComment';
import { TaskLabel } from './TaskLabel';
import { TaskList } from './TaskList';
import { IUser } from './User';

export enum TaskPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface ITask {
  id: number;
  name: string;
  position: number;
  description: string;
  priority: TaskPriorityEnum;
  createdAt: string;
  updatedAt: string;
  assigneeId?: number;
  taskListId: number;
  assignee?: IUser;
  boardId: number;
  board?: Board;
  cover?: IFile;
  attachments?: IFile[];
  comments?: TaskComment[];
  taskList?: TaskList;
  labels?: TaskLabel[];
}
