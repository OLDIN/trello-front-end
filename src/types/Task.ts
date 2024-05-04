import { Board } from './Board';
import { IFile } from './File';
import { TaskCheckList } from './TaskChecklist';
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
  taskListId: number;
  assignees?: IUser[];
  boardId: number;
  board?: Board;
  cover?: IFile;
  coverBgColor?: string;
  attachments?: IFile[];
  comments?: TaskComment[];
  taskList?: TaskList;
  labels?: TaskLabel[];
  checklists?: TaskCheckList[];
  watchers?: IUser[];
}
