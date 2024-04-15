import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../../contexts/AuthContext';
import useProfile from '../../hooks/useProfile/useProfile';
import { useQueryClient } from '@tanstack/react-query';
import { getPersistUser, setPersistUser } from './helpers';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface ISetTokenData {
  token: string | null;
  refreshToken: string | null;
}

export function AuthProvider(props: AuthProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setTokenData] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const { refetch: refetchProfile } = useProfile({ enabled: false });
  const queryClient = useQueryClient();

  const setToken = useCallback(({ token, refreshToken }: ISetTokenData) => {
    setTokenData(token);
    setRefreshToken(refreshToken);

    if (token) {
      Cookies.set('token', token);
    } else {
      Cookies.remove('token');
    }

    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken);
    } else {
      Cookies.remove('refreshToken');
    }
  }, []);

  const loadData = useCallback(async () => {
    const token = Cookies.get('token') ?? null;
    const persistUser = getPersistUser();

    setTokenData(token);

    if (persistUser) {
      queryClient.setQueryData(['me'], persistUser);
    }

    await refetchProfile();

    setIsLoaded(true);
  }, []);

  const logOut = useCallback(() => {
    setToken({
      token: null,
      refreshToken: null,
    });
    setPersistUser(null);
    queryClient.setQueryData(['me'], null);
  }, [setToken]);

  useEffect(() => {
    loadData();
  }, []);

  const contextValue = useMemo(
    () => ({
      token,
      isLoaded,
      setToken,
      logOut,
      refreshToken,
    }),
    [token, isLoaded, setToken, logOut, refreshToken],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}
