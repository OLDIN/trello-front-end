import { createContext } from 'react';

interface IAuthContext {
  isLoaded: boolean;
  token: string | null;
  refreshToken: string | null;
  setToken: (data: {
    token: string | null;
    refreshToken: string | null;
  }) => void;
  logOut: () => void;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);
