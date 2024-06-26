import React from 'react';

import { useBoardStore } from './store/boards/board.store';
import { AppWrapper } from 'styles';

import Header from './components/Header/Header';

import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
} from '@mui/material';

import Routers from './routes/Routes';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.scss';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
      defaultProps: {
        variant: 'contained',
        size: 'small',
        disableElevation: true,
        color: 'primary',
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
    MuiAvatar: {
      defaultProps: {
        variant: 'circular',
        alt: 'Avatar',
      },
      styleOverrides: {},
    },
    MuiCheckbox: {
      defaultProps: {
        color: 'primary',
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          '&.Mui-checked': {
            color: '#0075ff',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            borderRadius: '8px',
            backgroundColor: '#091e4224',
            color: '#44546f',
            textDecoration: 'none',
          },
        },
        sizeSmall: {
          fontSize: '16px',
          width: '32px',
          height: '32px',

          '& .MuiSvgIcon-root': {
            fontSize: '16px',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    text: {
      primary: '#172b4d',
      secondary: '#44546f',
    },
    primary: {
      main: 'hsl(206,14.1%,73%)',
      light: '#44546f',
      dark: '#172b4d',
    },
    secondary: {
      main: '#44546f',
    },
    divider: '#091e4224',
  },
  typography: {
    fontFamily:
      '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif',
    fontSize: 14,
    caption: {
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  // status: {
  //   danger: orange[500],
  // },
});

function App() {
  const { selectedBoard } = useBoardStore();

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
      <AppWrapper
        className={[
          'BackGroup-color',
          selectedBoard?.backgroundType === 'simple_color'
            ? selectedBoard?.background
            : '',
        ].join(' ')}
        background={selectedBoard?.background}
        backgroundType={selectedBoard?.backgroundType}
      >
        <Header />
        <Routers />
      </AppWrapper>
    </ThemeProvider>
  );
}

export default App;
