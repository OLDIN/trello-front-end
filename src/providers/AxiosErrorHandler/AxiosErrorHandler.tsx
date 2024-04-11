import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../services/api/axios';

let isRefreshTokenInProgress = false;

const AxiosErrorHandler = ({ children }: any) => {
  const { setToken, token } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log('error = ', error);
        const refreshToken = localStorage.getItem('refreshToken');

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

              console.log('inter response data = ', data);

              // localStorage.setItem('refreshToken', data.refreshToken);
              setToken(data.token);
            } catch (refreshError) {
              setToken(null);
              // localStorage.removeItem('refreshToken');
              queryClient.setQueryData(['me'], null);

              return Promise.reject(error);
            } finally {
              isRefreshTokenInProgress = false;
            }
          }
        }
      },
    );
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        queryClient.setQueryData(['me'], null);
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [setToken]);

  return children;
};

export default AxiosErrorHandler;
