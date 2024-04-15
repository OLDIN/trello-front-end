import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import './App.scss';
import Routers from './routes/Routes';
import Header from './components/Header/Header';
import { orange } from '@mui/material/colors';

const theme = createTheme({
  // status: {
  //   danger: orange[500],
  // },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
      <Header />
      <Routers />
    </ThemeProvider>
  );
}

export default App;
