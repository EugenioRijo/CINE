import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { keyframes, styled } from '@mui/material/styles';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { AppTheme } from './theme';
import SignInCard from './components/SignInCard';
import Content from './components/Content';

interface SignInSideProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
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

export default function SignInSide({ mode, onModeChange }: SignInSideProps) {
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handleModeChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsTransitioning(true);
    setTimeout(() => {
      onModeChange(event);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    }, 400);
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
        <PlanetarySystem mode={mode} isTransitioning={isTransitioning} />
        <OrbitingPlanet mode={mode} isTransitioning={isTransitioning} />
        <TransitionEffect mode={mode} isTransitioning={isTransitioning} />
        
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 4, sm: 8 },
            p: { xs: 2, sm: 4 },
            m: 'auto',
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            width: '100%'
          }}
        >
          <Box sx={{ flex: 1, width: '100%', maxWidth: 550 }}>
            <Content mode={mode} />
          </Box>
          <Box sx={{ flex: 1, width: '100%', maxWidth: 400 }}>
            <SignInCard mode={mode} onModeChange={handleModeChange} />
          </Box>
        </Stack>
      </Stack>
    </AppTheme>
  );
} 