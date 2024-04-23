import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from './services/query-client';

import { SnackbarProvider } from 'notistack';

import App from './App';
import { AuthProvider } from './providers/AuthProvider/AuthProvider';
import AxiosErrorHandler from './providers/AxiosErrorHandler/AxiosErrorHandler';
import reportWebVitals from './reportWebVitals';

import './index.scss';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AxiosErrorHandler>
          <Router>
            <SnackbarProvider maxSnack={3}>
              <App />
            </SnackbarProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </Router>
        </AxiosErrorHandler>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
