import { IFile } from './File';

export interface IProfile {
  id: number;
  firstName: string;
  lastName: string;
  photo?: IFile;
  email: string;
  role: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  provider: string;
}
