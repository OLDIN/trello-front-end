import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/query-client';
import { AuthProvider } from './providers/AuthProvider/AuthProvider';
import AxiosErrorHandler from './providers/AxiosErrorHandler/AxiosErrorHandler';
import { SnackbarProvider } from 'notistack';

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
