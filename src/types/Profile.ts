export interface IProfile {
  id: number;
  firstName: string;
  lastName: string;
  photo?: {
    path: string;
    id: string;
  };
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
