import { createContext } from 'react';

interface IAuthContext {
  isLoaded: boolean;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);
