import { createContext } from 'react';

interface IAuthContext {
  isLoaded: boolean;
  user: unknown | null;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<unknown | null>>;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);
