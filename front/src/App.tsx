import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import MovieShowcase from './components/MovieShowcase';
import SignInSide from './SignInSide';
import { SnackBar } from './components/SnackBar';
import NotFound from './components/NotFound';
import BHMember from './components/BHMember';
import Payment from './components/Payment';
import MovieDetails from './components/MovieDetails';
import ContactForm from './components/ContactForm';
import Events from './components/Events';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Para un scroll suave
    });
  }, [pathname]);

  return null;
}

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
        <ScrollToTop />
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
            path="/bh-member"
            element={<BHMember mode={isDarkMode ? 'dark' : 'light'} onModeChange={handleModeChange} />}
          />
          <Route
            path="/payment"
            element={<Payment mode={isDarkMode ? 'dark' : 'light'} onModeChange={handleModeChange} />}
          />
          <Route
            path="/movie/:id"
            element={<MovieDetails mode={isDarkMode ? 'dark' : 'light'} onModeChange={handleModeChange} />}
          />
          <Route
            path="/contact"
            element={<ContactForm mode={isDarkMode ? 'dark' : 'light'} onModeChange={handleModeChange} />}
          />
          <Route
            path="/eventos"
            element={<Events mode={isDarkMode ? 'dark' : 'light'} onModeChange={handleModeChange} />}
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