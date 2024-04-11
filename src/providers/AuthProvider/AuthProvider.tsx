import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../../contexts/AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider(props: AuthProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setTokenData] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const setToken = useCallback((token: string | null) => {
    setTokenData(token);

    if (token) {
      Cookies.set('token', token);
    } else {
      Cookies.remove('token');
    }
  }, []);

  const loadData = useCallback(() => {
    const token = Cookies.get('token') ?? null;
    setTokenData(token);
  }, []);

  const logOut = useCallback(() => {
    setTokenData(null);
  }, [setToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
