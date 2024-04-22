import React, { FC, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import axiosInstance from '../../services/api/axios';

import useAuth from '../../hooks/useAuth';

import { Alert, Snackbar } from '@mui/material';

let isRefreshTokenInProgress = false;

interface AxiosErrorHandlerProps {
  children: React.ReactNode;
}

const AxiosErrorHandler: FC<AxiosErrorHandlerProps> = ({ children }) => {
  const { setToken, logOut } = useAuth();
  const queryClient = useQueryClient();
  const [snackbarSettings, setSnackbarSettings] = React.useState<{
    open: boolean;
    message: string | null;
  }>({
    open: false,
    message: null,
  });

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        const refreshToken = Cookies.get('refreshToken');

        console.log({
          isRefreshTokenInProgress,
          status: error.response.status === 401,
          Authorization: error.config.headers.Authorization,
          refreshToken,
        });

        if (
          error.response.status === 401 &&
          error.config.headers.Authorization &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          if (!isRefreshTokenInProgress) {
            isRefreshTokenInProgress = true;

            if (refreshToken) {
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
                originalRequest.headers.Authorization = `Bearer ${data.token}`;
                return axiosInstance(originalRequest);
              } catch (refreshError) {
                logOut();

                return Promise.reject(error);
              } finally {
                isRefreshTokenInProgress = false;
              }
            }
          }
        }

        if (error.response?.status === 422) {
          setSnackbarSettings({
            open: true,
            message: Object.entries(error.response.data.errors)
              .map(([_, value]) => value)
              .join(', '), // This will join all the error messages with a comma
          });
        }
      },
    );

    return () => {
      const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        async () => {
          console.log('interceptor');
          queryClient.setQueryData(['me'], null);
        },
      );
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Snackbar
        open={snackbarSettings.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() =>
          setSnackbarSettings({
            open: false,
            message: null,
          })
        }
      >
        <Alert
          onClose={() =>
            setSnackbarSettings({
              open: false,
              message: null,
            })
          }
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarSettings.message}
        </Alert>
      </Snackbar>
      {children}
    </>
  );
};

export default AxiosErrorHandler;
