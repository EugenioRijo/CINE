import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Azul oscuro
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#90caf9', // Azul pastel
      light: '#c3fdff',
      dark: '#5d99c6',
      contrastText: '#000000',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a237e',
      secondary: '#455a64',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#1a237e',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#1a237e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(26, 35, 126, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

interface AppThemeProps {
  children: ReactNode;
  disableCustomTheme?: boolean;
}

export default function AppTheme({ children, disableCustomTheme }: AppThemeProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
} 