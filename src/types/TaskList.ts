import { IUser } from './User';

export interface TaskList {
  id: number;
  name: string;
  boardId: number;
  watchers: IUser[];
}
