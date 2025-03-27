import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  IconButton,
  keyframes,
} from '@mui/material';
import {
  Star,
  LocalOffer,
  Fastfood,
  MovieFilter,
  CardGiftcard,
  EventSeat,
  ThumbUp,
  AccessTime,
  Brightness4,
  Brightness7,
  Rocket,
  Diamond,
  AttachMoney,
  RocketLaunch,
} from '@mui/icons-material';
import RocketBackButton from './shared/RocketBackButton';

interface BHMemberProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #FFD700; }
  50% { box-shadow: 0 0 20px #FFD700, 0 0 30px #FFA500; }
  100% { box-shadow: 0 0 5px #FFD700; }
`;

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px #FFD700; }
  50% { box-shadow: 0 0 20px #FFD700, 0 0 30px #FFA500; }
  100% { box-shadow: 0 0 5px #FFD700; }
`;

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

const StyledContainer = styled(Container)(() => ({
  padding: 0,
  margin: 0,
  minHeight: '100vh',
  maxWidth: '100% !important',
  width: '100%',
  background: 'linear-gradient(135deg, #0a192f 0%, #000000 100%)',
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
}));

const ContentWrapper = styled(Box)(() => ({
  position: 'relative',
  zIndex: 1,
  paddingTop: '96px',
  paddingBottom: '64px',
  paddingLeft: '24px',
  paddingRight: '24px',
}));

const AnimatedCard = styled(Card)<{ delay?: string }>(({ delay = '0s' }) => ({
  background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transform: 'translateY(0)',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  animation: `fadeIn 0.5s ease-out forwards ${delay}`,
}));

const FloatingIcon = styled(Box)(() => ({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

const RotatingIcon = styled(Box)(() => ({
  animation: `${rotateAnimation} 10s linear infinite`,
}));

const GoldButton = styled(Button)(() => ({
  background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
  color: '#000',
  padding: '12px 30px',
  borderRadius: '25px',
  fontWeight: 700,
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #FFA500 30%, #FFD700 90%)',
    boxShadow: '0 0 20px #FFD700',
    transform: 'scale(1.1)',
  },
}));

const IronicBenefit = styled(ListItem)(() => ({
  transition: 'background-color 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 215, 0, 0.1)',
  },
}));

const BenefitCard = styled(Card)(() => ({
  background: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 0 20px #FFD700, 0 0 30px #FFA500',
  },
}));

const BackButton = styled(IconButton)(() => ({
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

const BHMember: React.FC<BHMemberProps> = ({ mode, onModeChange }) => {
  const navigate = useNavigate();
  const rocketRef = useRef<HTMLButtonElement>(null);

  const handleReturn = () => {
    if (rocketRef.current) {
      rocketRef.current.classList.add('launching');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  const handlePayment = () => {
    navigate('/payment');
  };

  const benefits = [
    {
      icon: <Diamond />,
      title: '¡Sé parte de la Élite!',
      description: 'Porque ser normal es muy mainstream',
    },
    {
      icon: <AttachMoney />,
      title: 'Descuentos Astronómicos',
      description: 'Tan grandes como un agujero negro (términos y condiciones aplican)*',
    },
    {
      icon: <Fastfood />,
      title: 'Combos Gravitacionales',
      description: 'Palomitas que desafían la física... o eso decimos',
    },
    {
      icon: <MovieFilter />,
      title: 'Pre-estrenos Cuánticos',
      description: 'Ve películas antes que el resto del universo paralelo',
    },
    {
      icon: <EventSeat />,
      title: 'Asientos Dimensionales',
      description: 'Tan cómodos que podrías caer en otra dimensión',
    },
    {
      icon: <Rocket />,
      title: 'Experiencia Intergaláctica',
      description: 'O al menos eso te parecerá después de nuestros precios',
    },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      position: 'relative',
      zIndex: 9999
    }}>
      <RocketBackButton mode={mode} />
      <Box sx={{ position: 'fixed', right: '20px', top: '20px', zIndex: 10000 }}>
        <IconButton onClick={onModeChange} sx={{ color: '#FFD700' }}>
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>
      <StyledContainer>
        <ContentWrapper>
          <FloatingIcon>
            <Typography
              variant="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 900,
                color: '#FFD700',
                textShadow: '0 0 10px rgba(255,215,0,0.5)',
                mb: 6,
                fontSize: { xs: '3rem', md: '5rem' },
              }}
            >
              BLACK HOLE MEMBER
            </Typography>
          </FloatingIcon>

          <Typography
            variant="h4"
            align="center"
            sx={{
              color: '#FFD700',
              fontStyle: 'italic',
              mb: 8,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            "Porque el dinero sí puede comprar la felicidad... ¿o era al revés?"
          </Typography>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <BenefitCard>
                  <CardContent>
                    <IronicBenefit>
                      <ListItemIcon sx={{ color: '#FFD700', fontSize: '2rem' }}>
                        <RotatingIcon>
                          {benefit.icon}
                        </RotatingIcon>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#FFD700' }}>
                            {benefit.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {benefit.description}
                          </Typography>
                        }
                      />
                    </IronicBenefit>
                  </CardContent>
                </BenefitCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <AnimatedCard delay="1.2s">
              <CardContent>
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 900 }}>
                  $10.00/mes*
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                  *Precio especial de lanzamiento. Puede subir más rápido que la inflación.
                </Typography>
                <GoldButton
                  variant="contained"
                  size="large"
                  sx={{ mt: 4 }}
                  onClick={handlePayment}
                >
                  ¡ÚNETE AL LADO OSCURO!
                </GoldButton>
              </CardContent>
            </AnimatedCard>
          </Box>

          <Typography
            variant="caption"
            align="center"
            sx={{
              display: 'block',
              mt: 4,
              opacity: 0.7,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            *Ningún agujero negro fue dañado en la creación de esta membresía
          </Typography>
        </ContentWrapper>
      </StyledContainer>
    </Box>
  );
};

export default BHMember; 