import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { queryClient } from './services/query-client';
import { AuthProvider } from './providers/AuthProvider/AuthProvider';
import AxiosErrorHandler from './providers/AxiosErrorHandler/AxiosErrorHandler';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
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
