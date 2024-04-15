import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../../contexts/AuthContext';
import useProfile from '../../hooks/useProfile/useProfile';

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

  const setToken = useCallback(({ token, refreshToken }: ISetTokenData) => {
    setTokenData(token);

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
    setTokenData(token);

    await refetchProfile();

    setIsLoaded(true);
  }, []);

  const logOut = useCallback(() => {
    setTokenData(null);
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
