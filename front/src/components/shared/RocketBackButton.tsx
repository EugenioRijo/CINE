import React, { useRef } from 'react';
import { IconButton, styled, keyframes } from '@mui/material';
import { RocketLaunch } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface RocketBackButtonProps {
  mode: 'dark' | 'light';
}

const rocketLaunchAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-1000px) rotate(-45deg);
    opacity: 0;
  }
`;

const StyledButton = styled(IconButton)(() => ({
  position: 'fixed',
  left: '20px',
  top: '20px',
  background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
  color: '#FFD700',
  padding: '12px',
  zIndex: 10000,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #2d2d2d 0%, #1a1a1a 100%)',
    transform: 'scale(1.1)',
    boxShadow: '0 0 15px #FFD700',
  },
  '&.launching': {
    animation: `${rocketLaunchAnimation} 1s ease-in forwards`,
  },
}));

const RocketBackButton: React.FC<RocketBackButtonProps> = ({ mode }) => {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleReturn = () => {
    if (buttonRef.current) {
      buttonRef.current.classList.add('launching');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  return (
    <StyledButton onClick={handleReturn} ref={buttonRef}>
      <RocketLaunch />
    </StyledButton>
  );
};

export default RocketBackButton; 