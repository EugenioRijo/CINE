import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import MovieShowcase from './components/MovieShowcase';
import SignInSide from './SignInSide';
import { Box } from '@mui/material';

const AppContent = () => {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#03b5fc' : '#ff8c32',
      },
      secondary: {
        main: mode === 'dark' ? '#1a2dd8' : '#ffaa50',
      },
      background: {
        default: mode === 'dark' ? '#0a192f' : '#f0f8ff',
        paper: mode === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: mode === 'dark'
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
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
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
            element={<WelcomePage mode={mode} onStartJourney={handleStartJourney} onModeChange={handleModeChange} />}
          />
          <Route
            path="/cartelera"
            element={<MovieShowcase mode={mode} onModeChange={handleModeChange} />}
          />
          <Route
            path="/login"
            element={<SignInSide mode={mode} onModeChange={handleModeChange} />}
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
} 