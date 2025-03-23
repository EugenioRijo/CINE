import { Box } from '@mui/material';
import { keyframes, styled } from '@mui/material/styles';

const floatingAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const glowAnimation = keyframes`
  0% {
    opacity: 0.5;
    filter: blur(20px);
  }
  50% {
    opacity: 1;
    filter: blur(15px);
  }
  100% {
    opacity: 0.5;
    filter: blur(20px);
  }
`;

export const BackgroundContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode',
})<{ mode: 'dark' | 'light' }>(({ mode }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: mode === 'dark'
    ? 'radial-gradient(ellipse at center, #0a192f 0%, #000000 100%)'
    : 'radial-gradient(ellipse at center, #f0f8ff 0%, #87ceeb 100%)',
  overflow: 'hidden',
  zIndex: -1,
}));

export const FloatingElement = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode',
})<{ mode: 'dark' | 'light' }>(({ mode }) => ({
  position: 'absolute',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  background: mode === 'dark'
    ? 'radial-gradient(circle, #03b5fc 0%, #1a2dd8 100%)'
    : 'radial-gradient(circle, #ffaa50 0%, #ff8c32 100%)',
  boxShadow: mode === 'dark'
    ? '0 0 50px rgba(3, 181, 252, 0.3)'
    : '0 0 50px rgba(255, 140, 50, 0.3)',
  animation: `${floatingAnimation} 6s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'inherit',
    filter: 'blur(20px)',
    animation: `${glowAnimation} 4s ease-in-out infinite`,
  },
}));

export const RotatingRing = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode',
})<{ mode: 'dark' | 'light' }>(({ mode }) => ({
  position: 'absolute',
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  border: mode === 'dark'
    ? '2px solid rgba(3, 181, 252, 0.2)'
    : '2px solid rgba(255, 140, 50, 0.2)',
  animation: `${rotateAnimation} 20s linear infinite`,
}));

export const BackgroundElements: React.FC<{ mode: 'dark' | 'light' }> = ({ mode }) => {
  return (
    <BackgroundContainer mode={mode}>
      <FloatingElement
        mode={mode}
        sx={{
          top: '15%',
          right: '10%',
          animation: `${floatingAnimation} 6s ease-in-out infinite`,
        }}
      />
      <FloatingElement
        mode={mode}
        sx={{
          bottom: '20%',
          left: '15%',
          width: '100px',
          height: '100px',
          animation: `${floatingAnimation} 8s ease-in-out infinite 1s`,
        }}
      />
      <RotatingRing
        mode={mode}
        sx={{
          top: '20%',
          right: '15%',
        }}
      />
      <RotatingRing
        mode={mode}
        sx={{
          bottom: '15%',
          left: '10%',
          width: '200px',
          height: '200px',
          animationDuration: '15s',
        }}
      />
    </BackgroundContainer>
  );
}; 