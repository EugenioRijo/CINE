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
import SignInSide from './components/SignInSide';
import { SnackBar } from './components/SnackBar';
import NotFound from './components/NotFound';
import BHMember from './components/BHMember';
import Payment from './components/Payment';
import MovieDetails from './components/MovieDetails';
import ContactForm from './components/ContactForm';
import Events from './components/Events';
import { AuthProvider } from './contexts/AuthContext';
import AdminStats from './components/AdminStats';
import { PriceProvider } from './contexts/PriceContext';
import { BcvProvider } from './contexts/BcvContext';
import { MembershipProvider } from './contexts/MembershipContext';
import { AgeDiscountProvider } from './contexts/AgeDiscountContext';
import { EventDiscountProvider } from './contexts/EventDiscountContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

const AppContent = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
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
        paper: mode === 'dark' ? '#1a202c' : '#ffffff',
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

  const handleModeChange = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const handleStartJourney = () => {
    navigate('/cartelera');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MembershipProvider>
          <BcvProvider>
            <PriceProvider>
              <AgeDiscountProvider>
                <EventDiscountProvider>
                  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <ScrollToTop />
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <WelcomePage 
                            mode={mode === 'dark' ? 'dark' : 'light'} 
                            onStartJourney={handleStartJourney} 
                            onModeChange={handleModeChange} 
                          />
                        }
                      />
                      <Route
                        path="/cartelera"
                        element={<MovieShowcase mode={mode} onModeChange={handleModeChange} />}
                      />
                      <Route
                        path="/login"
                        element={<SignInSide mode={mode === 'dark' ? 'dark' : 'light'} onModeChange={handleModeChange} />}
                      />
                      <Route
                        path="/bh-member"
                        element={<BHMember mode={mode === 'dark' ? 'dark' : 'light'} onModeChange={handleModeChange} />}
                      />
                      <Route
                        path="/payment"
                        element={<Payment mode={mode === 'dark' ? 'dark' : 'light'} onModeChange={handleModeChange} />}
                      />
                      <Route
                        path="/movie/:id"
                        element={<MovieDetails mode={mode === 'dark' ? 'dark' : 'light'} onModeChange={handleModeChange} />}
                      />
                      <Route
                        path="/contact"
                        element={<ContactForm mode={mode === 'dark' ? 'dark' : 'light'} onModeChange={handleModeChange} />}
                      />
                      <Route
                        path="/eventos"
                        element={<Events mode={mode === 'dark' ? 'dark' : 'light'} onModeChange={handleModeChange} />}
                      />
                      <Route
                        path="*"
                        element={<NotFound mode={mode === 'dark' ? 'dark' : 'light'} />}
                      />
                      <Route
                        path="/admin/estadisticas"
                        element={<AdminStats mode={mode === 'dark' ? 'dark' : 'light'} onModeChange={handleModeChange}/>}
                      />
                    </Routes>
                    <SnackBar mode={mode === 'dark' ? 'dark' : 'light'} />
                  </Box>
                </EventDiscountProvider>
              </AgeDiscountProvider>
            </PriceProvider>
          </BcvProvider>
        </MembershipProvider>
      </AuthProvider>
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