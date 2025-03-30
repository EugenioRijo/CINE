import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { keyframes, styled } from '@mui/material/styles';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { AppTheme } from '../theme';
import SignInCard from './SignInCard';
import Content from './Content';
import authService from '../services/authService';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';

interface SignInSideProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface FormData {
  nombre: string;
  email: string;
  password: string;
  fecha_nacimiento: Date | null;
  telefono?: string;
}

const orbitRotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const planetPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const planetTransition = keyframes`
  0% {
    transform: scale(1) translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(0.9) translate(-50px, -25px) rotate(180deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(1) translate(0, 0) rotate(360deg);
    opacity: 1;
  }
`;

const PlanetarySystem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode' && prop !== 'isTransitioning',
})<{ mode: 'dark' | 'light'; isTransitioning: boolean }>(({ mode, isTransitioning }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  width: '50%',
  height: '100%',
  overflow: 'hidden',
  background: 'transparent',
  pointerEvents: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '25%',
    right: '10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: mode === 'dark'
      ? 'radial-gradient(circle, #1a1a3a 0%, #000033 100%)'
      : 'radial-gradient(circle, #ffb347 0%, #ffcc33 100%)',
    boxShadow: mode === 'dark'
      ? '0 0 60px rgba(3, 181, 252, 0.2), inset 0 0 100px rgba(3, 181, 252, 0.15)'
      : '0 0 60px rgba(255, 140, 50, 0.2), inset 0 0 100px rgba(255, 170, 80, 0.15)',
    transform: 'translate(-50%, -50%)',
    animation: `${planetPulse} 4s ease-in-out infinite`,
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 0.85,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '25%',
    right: '10%',
    width: '500px',
    height: '500px',
    border: mode === 'dark'
      ? '2px solid rgba(3, 181, 252, 0.15)'
      : '2px solid rgba(255, 140, 50, 0.15)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: `${orbitRotation} 30s linear infinite`,
  }
}));

const OrbitingPlanet = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode' && prop !== 'isTransitioning',
})<{ mode: 'dark' | 'light'; isTransitioning: boolean }>(({ mode, isTransitioning }) => ({
  position: 'absolute',
  top: 'calc(25% - 250px)',
  right: 'calc(10% - 30px)',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  background: mode === 'dark'
    ? 'radial-gradient(circle, #03b5fc 0%, #1a2dd8 100%)'
    : 'radial-gradient(circle, #ffaa50 0%, #ff8c32 100%)',
  boxShadow: mode === 'dark'
    ? '0 0 25px rgba(3, 181, 252, 0.5), inset 0 0 15px rgba(3, 181, 252, 0.3)'
    : '0 0 25px rgba(255, 140, 50, 0.5), inset 0 0 15px rgba(255, 140, 50, 0.3)',
  transform: 'translate(-50%, -50%)',
  transformOrigin: 'calc(50% + 250px) calc(50% + 250px)',
  animation: `${orbitRotation} 30s linear infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '150%',
    height: '150%',
    top: '-25%',
    left: '-25%',
    borderRadius: '50%',
    background: 'inherit',
    filter: 'blur(10px)',
    opacity: 0.15,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: mode === 'dark'
      ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)'
      : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 50%)',
    top: 0,
    left: 0,
  }
}));

const TransitionEffect = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isTransitioning' && prop !== 'mode',
})<{ isTransitioning: boolean; mode: 'dark' | 'light' }>(({ isTransitioning, mode }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  width: '50%',
  height: '100%',
  background: mode === 'dark'
    ? 'radial-gradient(circle at 75% 25%, rgba(3, 181, 252, 0.15), transparent 80%)'
    : 'radial-gradient(circle at 75% 25%, rgba(255, 140, 50, 0.15), transparent 80%)',
  opacity: isTransitioning ? 1 : 0,
  transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  pointerEvents: 'none',
  zIndex: 10,
}));

const SignInSide: React.FC<SignInSideProps> = ({ mode, onModeChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    password: '',
    fecha_nacimiento: null,
    telefono: ''
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await authService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        if (!formData.fecha_nacimiento) {
          setError('La fecha de nacimiento es requerida');
          return;
        }

        // Validar edad antes de enviar
        const { isValid, age } = authService.validateAge(formData.fecha_nacimiento.toISOString());
        if (!isValid) {
          setError(`Debes tener al menos 18 años para registrarte. Edad actual: ${age}`);
          return;
        }

        await authService.register({
          ...formData,
          fecha_nacimiento: formData.fecha_nacimiento.toISOString().split('T')[0]
        });
      }
      navigate('/cartelera');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        component="main"
        sx={{
          justifyContent: 'center',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: mode === 'dark'
            ? 'radial-gradient(ellipse at center, #0a192f 0%, #000000 100%)'
            : 'radial-gradient(ellipse at center, #f0f8ff 0%, #87ceeb 100%)',
          transition: 'background 1s ease-in-out',
        }}
      >
        <PlanetarySystem mode={mode} isTransitioning={false} />
        <OrbitingPlanet mode={mode} isTransitioning={false} />
        <TransitionEffect mode={mode} isTransitioning={false} />
        
        <Stack
          direction="row"
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', p: 4 }}
        >
          <Box sx={{ flex: 1 }}>
            <Content mode={mode} />
          </Box>
          <Box sx={{ flex: 1, width: '100%', maxWidth: 400 }}>
            <SignInCard mode={mode} onModeChange={onModeChange} />
          </Box>
        </Stack>
      </Stack>
    </AppTheme>
  );
};

export default SignInSide; 