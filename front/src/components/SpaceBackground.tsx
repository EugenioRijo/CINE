import React from 'react';
import { Box, keyframes, styled } from '@mui/material';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-10px) translateX(10px);
  }
  50% {
    transform: translateY(0) translateX(20px);
  }
  75% {
    transform: translateY(10px) translateX(10px);
  }
`;

const twinkle = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.8);
  }
`;

const SpaceContainer = styled(Box)<{ mode: 'dark' | 'light' }>(({ mode }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  background: mode === 'dark'
    ? 'radial-gradient(circle at center, #0a192f 0%, #000000 100%)'
    : 'radial-gradient(circle at center, #e8f5fe 0%, #bbdefb 100%)',
  zIndex: 0,
}));

const Planet = styled(Box)<{ size: number; color: string; delay: number; duration: number; orbit: number }>(
  ({ size, color, delay, duration, orbit }) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: '0 0 30px rgba(0,0,0,0.15)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      borderRadius: '50%',
      background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
      opacity: 0.8,
    },
    animation: `${float} ${duration}s ease-in-out infinite ${delay}s, ${rotate} ${duration * 2}s linear infinite ${delay}s`,
    transform: `translateX(-50%) translateY(-50%) rotate(0deg) translateX(${orbit}px)`,
    transformOrigin: `${orbit}px center`,
  })
);

const Star = styled(Box)<{ size: number; delay: number; mode: 'dark' | 'light' }>(({ size, delay, mode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  backgroundColor: mode === 'dark' ? '#ffffff' : '#1976d2',
  opacity: mode === 'dark' ? 0.7 : 0.4,
  animation: `${twinkle} ${2 + Math.random() * 3}s ease-in-out infinite ${delay}s`,
}));

const Galaxy = styled(Box)<{ size: number; rotation: number; mode: 'dark' | 'light' }>(({ size, rotation, mode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: mode === 'dark'
      ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)'
      : 'radial-gradient(ellipse at center, rgba(25,118,210,0.08) 0%, transparent 70%)',
    transform: `rotate(${rotation}deg)`,
    animation: `${rotate} 100s linear infinite`,
  },
}));

interface SpaceBackgroundProps {
  mode: 'dark' | 'light';
}

const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ mode }) => {
  const stars = Array.from({ length: mode === 'dark' ? 100 : 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * (mode === 'dark' ? 2 : 1.5),
    delay: Math.random() * 5,
  }));

  const planets = [
    { 
      size: 60, 
      color: mode === 'dark' ? '#ff6b6b' : '#2196f3', 
      delay: 0, 
      duration: 20, 
      orbit: 300 
    },
    { 
      size: 40, 
      color: mode === 'dark' ? '#4ecdc4' : '#1e88e5', 
      delay: 2, 
      duration: 15, 
      orbit: 200 
    },
    { 
      size: 30, 
      color: mode === 'dark' ? '#45b7d1' : '#42a5f5', 
      delay: 1, 
      duration: 25, 
      orbit: 400 
    },
    { 
      size: 25, 
      color: mode === 'dark' ? '#96ceb4' : '#64b5f6', 
      delay: 3, 
      duration: 18, 
      orbit: 250 
    },
    { 
      size: 20, 
      color: mode === 'dark' ? '#ff8c32' : '#90caf9', 
      delay: 4, 
      duration: 22, 
      orbit: 350 
    },
    { 
      size: 15, 
      color: mode === 'dark' ? '#03b5fc' : '#bbdefb', 
      delay: 5, 
      duration: 30, 
      orbit: 450 
    }
  ];

  const galaxies = [
    { size: 600, rotation: 45, top: '20%', left: '20%' },
    { size: 400, rotation: -30, top: '60%', left: '70%' },
    { size: 300, rotation: 15, top: '40%', left: '40%' },
    { size: 250, rotation: 60, top: '80%', left: '30%' },
    { size: 200, rotation: -45, top: '15%', left: '75%' }
  ];

  return (
    <SpaceContainer mode={mode}>
      {stars.map((star) => (
        <Star
          key={star.id}
          size={star.size}
          delay={star.delay}
          mode={mode}
          sx={{
            top: star.top,
            left: star.left,
          }}
        />
      ))}
      {galaxies.map((galaxy, index) => (
        <Galaxy
          key={index}
          size={galaxy.size}
          rotation={galaxy.rotation}
          mode={mode}
          sx={{
            top: galaxy.top,
            left: galaxy.left,
          }}
        />
      ))}
      {planets.map((planet, index) => (
        <Planet
          key={index}
          size={planet.size}
          color={planet.color}
          delay={planet.delay}
          duration={planet.duration}
          orbit={planet.orbit}
          sx={{
            top: '50%',
            left: '50%',
          }}
        />
      ))}
    </SpaceContainer>
  );
};

export default SpaceBackground; 