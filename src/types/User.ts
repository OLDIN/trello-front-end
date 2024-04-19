import { IFile } from './File';

export interface IUserStatus {
  id: number;
  name: string;
}

export interface IUserRole {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  photo?: IFile;
  email: string;
  role?: IUserRole;
  status?: IUserStatus;
  createdAt: string;
  updatedAt: string;
  provider: string;
}
