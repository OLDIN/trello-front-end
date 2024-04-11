import React from 'react';
import './App.scss';
import Routers from './routes/Routes';
import Header from './components/Header/Header';

function App() {
  return (
    <>
      <Header />
      <Routers />
    </>
  );
}

export default App;
