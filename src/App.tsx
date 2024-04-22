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
  Box,
} from '@mui/material';

import './App.scss';
import Routers from './routes/Routes';
import Header from './components/Header/Header';
import { useBoardStore } from './store/boards/board.store';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    text: {
      primary: '#44546f',
    },
    primary: {
      main: 'hsl(206,14.1%,73%)',
    },
  },
  typography: {
    fontFamily:
      '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif',
    fontSize: 14,
  },
  // status: {
  //   danger: orange[500],
  // },
});

function App() {
  const { selectedBoardBackgroundImagePath } = useBoardStore();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { WebkitFontSmoothing: 'auto' },
          body: {
            overflow: 'hidden',
          },
        }}
      />
      <Box
        sx={{
          backgroundImage: selectedBoardBackgroundImagePath
            ? `url(${selectedBoardBackgroundImagePath})`
            : 'none',
        }}
      >
        <Header />
        <Routers />
      </Box>
    </ThemeProvider>
  );
}

export default App;
