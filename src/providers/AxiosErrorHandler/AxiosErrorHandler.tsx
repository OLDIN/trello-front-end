import { useQueryClient } from '@tanstack/react-query';
import React, { FC, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../services/api/axios';
import Cookies from 'js-cookie';

let isRefreshTokenInProgress = false;

interface AxiosErrorHandlerProps {
  children: React.ReactNode;
}

const AxiosErrorHandler: FC<AxiosErrorHandlerProps> = ({ children }) => {
  const { setToken, logOut } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const refreshToken = Cookies.get('refreshToken');

        if (!isRefreshTokenInProgress) {
          isRefreshTokenInProgress = true;
          if (
            error.response.status === 401 &&
            error.config.headers.Authorization &&
            refreshToken
          ) {
            try {
              const { data } = await axiosInstance.post(
                '/v1/auth/refresh',
                null,
                {
                  headers: {
                    Authorization: `Bearer ${refreshToken}`,
                  },
                },
              );

              setToken({
                token: data.token,
                refreshToken: data.refreshToken,
              });
            } catch (refreshError) {
              logOut();

              return Promise.reject(error);
            } finally {
              isRefreshTokenInProgress = false;
            }
          }
        }
      },
    );

    return () => {
      const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          queryClient.setQueryData(['me'], null);
        },
      );
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [setToken]);

  return <>{children}</>;
};

export default AxiosErrorHandler;
