import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import MovieShowcase from './components/MovieShowcase';
import SignInSide from './SignInSide';
import { SnackBar } from './components/SnackBar';
import NotFound from './components/NotFound';

const AppContent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#03b5fc' : '#ff8c32',
      },
      secondary: {
        main: isDarkMode ? '#1a2dd8' : '#ffaa50',
      },
      background: {
        default: isDarkMode ? '#0a192f' : '#f0f8ff',
        paper: isDarkMode ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: isDarkMode
              ? 'linear-gradient(135deg, #0a192f 0%, #000000 100%)'
              : 'linear-gradient(135deg, #f0f8ff 0%, #87ceeb 100%)',
            minHeight: '100vh',
            margin: 0,
            padding: 0,
          },
        },
      },
    },
  });

  const handleModeChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleStartJourney = () => {
    navigate('/cartelera');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route
            path="/"
            element={<WelcomePage mode={isDarkMode ? 'dark' : 'light'} onStartJourney={handleStartJourney} onModeChange={handleModeChange} />}
          />
          <Route
            path="/cartelera"
            element={<MovieShowcase mode={isDarkMode ? 'dark' : 'light'} onModeChange={handleModeChange} />}
          />
          <Route
            path="/login"
            element={<SignInSide mode={isDarkMode ? 'dark' : 'light'} onModeChange={handleModeChange} />}
          />
          <Route
            path="*"
            element={<NotFound mode={isDarkMode ? 'dark' : 'light'} />}
          />
        </Routes>
      </Box>
      <SnackBar mode={isDarkMode ? 'dark' : 'light'} />
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
} 