import React, { useEffect, useState } from 'react';
import './App.scss';
import Routers from './routes/Routes';
import { AuthContext } from './contexts/AuthContext';
import Header from './components/Header/Header';
import AxiosErrorHandler from './providers/AxiosErrorHandler/AxiosErrorHandler';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      setToken(token);
    }
    setIsLoaded(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isLoaded,
      }}
    >
      <AxiosErrorHandler>
        <Header />
        <Routers />
      </AxiosErrorHandler>
    </AuthContext.Provider>
  );
}

export default App;
