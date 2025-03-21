import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

declare module '@mui/material/styles' {
  interface Theme {
    applyStyles?: (mode: string, styles: any) => any;
  }
  interface ThemeOptions {
    applyStyles?: (mode: string, styles: any) => any;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#7B68EE',
      light: '#9683F0',
      dark: '#6A5ACD',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF69B4',
      light: '#FFB6C1',
      dark: '#FF1493',
      contrastText: '#ffffff',
    },
    background: {
      default: 'rgba(26, 45, 216, 0.4)',
      paper: 'rgba(13, 22, 110, 0.35)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.85)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#ffffff',
      marginBottom: '24px',
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    body1: {
      color: '#ffffff',
      fontSize: '0.875rem',
    },
    body2: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.875rem',
    },
    subtitle1: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.875rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '0.875rem',
          padding: '10px 24px',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(45deg, #7B68EE 30%, #FF69B4 90%)',
          color: '#ffffff',
          boxShadow: '0 3px 5px 2px rgba(123, 104, 238, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #6A5ACD 30%, #FF1493 90%)',
            boxShadow: '0 4px 6px 2px rgba(123, 104, 238, 0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(123, 104, 238, 0.1)',
            borderColor: '#7B68EE',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(13, 22, 110, 0.25)',
            backdropFilter: 'blur(8px)',
            '& fieldset': {
              borderColor: 'rgba(123, 104, 238, 0.2)',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: '#7B68EE',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF69B4',
            },
            '& input': {
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '0.875rem',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem',
            '&.Mui-focused': {
              color: '#FF69B4',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(13, 22, 110, 0.22)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(123, 104, 238, 0.15)',
          borderRadius: 16,
          maxWidth: '400px',
          margin: '0 auto',
          padding: '40px 0',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '0 32px',
          '&:last-child': {
            paddingBottom: 0,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-checked': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: '-11px',
        },
        label: {
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '24px 0',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          '&::before, &::after': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
  },
  applyStyles: (mode, styles) => (mode === 'dark' ? styles : {}),
});

interface AppThemeProps {
  children: ReactNode;
  disableCustomTheme?: boolean;
}

export default function AppTheme({ children, disableCustomTheme }: AppThemeProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
} 