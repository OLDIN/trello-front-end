import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { QueryKey } from 'enums/QueryKey.enum';

import useProfile from '../../hooks/useProfile/useProfile';

import { AuthContext } from '../../contexts/AuthContext';
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
  const navigate = useNavigate();

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
    const refreshToken = Cookies.get('refreshToken') ?? null;
    const persistUser = getPersistUser();

    setToken({
      token,
      refreshToken,
    });

    if (persistUser) {
      queryClient.setQueryData([QueryKey.ME], persistUser);
    }

    await refetchProfile();

    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logOut = useCallback(() => {
    setToken({
      token: null,
      refreshToken: null,
    });
    setPersistUser(null);
    queryClient.clear();
    navigate('/login', { replace: true });
  }, [navigate, queryClient, setToken]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
