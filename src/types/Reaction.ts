import { IUser } from './User';

export interface IReaction {
  id: number;
  reaction: string;
  qty: number;
  commentId: number;
  users?: Pick<IUser, 'id' | 'firstName' | 'lastName'>[];
}
