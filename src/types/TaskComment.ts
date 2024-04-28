import { IReaction } from './Reaction';
import { IUser } from './User';

export interface TaskComment {
  id: number;
  taskId: number;
  authorId: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  author: IUser;
  reactions?: IReaction[];
}
