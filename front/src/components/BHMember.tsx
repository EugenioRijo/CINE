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
  Rocket,
  Diamond,
  AttachMoney,
  RocketLaunch,
} from '@mui/icons-material';
import RocketBackButton from './shared/RocketBackButton';
import { usePrices } from '../contexts/PriceContext';

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

const BHMember: React.FC<BHMemberProps> = ({ mode }) => {
  const navigate = useNavigate();
  const rocketRef = useRef<HTMLButtonElement>(null);
  const { 
    membershipPriceUSD, 
    membershipPriceVEF, 
    regularTicketUSD,
    formatPrice, 
    formatUSD,
    isLoading 
  } = usePrices();

  const handleReturn = () => {
    if (rocketRef.current) {
      rocketRef.current.classList.add('launching');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  const handlePayment = () => {
    navigate('/payment', {
      state: {
        type: 'membership',
        items: [
          {
            name: 'Nova Prime Member Mensual',
            price: membershipPriceUSD,
            description: 'Membresía mensual',
          }
        ]
      }
    });
  };

  const benefits = [
    {
      icon: <Diamond />,
      title: '¡Sé parte de la Élite!',
      description: 'Porque ser normal es muy mainstream',
    },
    {
      icon: <AttachMoney />,
      title: 'Descuentos Estelares',
      description: `Ahorra ${formatUSD(regularTicketUSD * 0.5)} en cada entrada (50% de descuento)`,
    },
    {
      icon: <Fastfood />,
      title: 'Combos Gravitacionales',
      description: '25% de descuento en todos los combos',
    },
    {
      icon: <MovieFilter />,
      title: 'Pre-estrenos Exclusivos',
      description: 'Acceso anticipado a estrenos seleccionados',
    },
    {
      icon: <EventSeat />,
      title: 'Asientos Preferenciales',
      description: 'Reserva prioritaria en la zona premium',
    },
    {
      icon: <Rocket />,
      title: 'Experiencia Nova Prime',
      description: 'Acumula puntos para premios espaciales',
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
              NOVA PRIME MEMBER
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
            "El universo del cine a precios que no son de otro mundo"
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
                  {isLoading ? (
                    "Cargando precios..."
                  ) : (
                    <>
                      {formatUSD(membershipPriceUSD)}/mes*
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.7)',
                          mt: 1,
                          fontSize: '1.5rem'
                        }}
                      >
                        ({membershipPriceVEF ? formatPrice(membershipPriceVEF) : ''})
                      </Typography>
                    </>
                  )}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                  *Precio actualizado según la tasa del BCV.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: 3, 
                    color: 'rgba(255,255,255,0.9)',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px dashed #FFD700'
                  }}
                >
                  ¡30 entradas con 50% de descuento al mes!* 
                  <Typography 
                    component="span" 
                    sx={{ 
                      display: 'block', 
                      fontSize: '0.8rem', 
                      mt: 1,
                      color: 'rgba(255,255,255,0.6)',
                      fontStyle: 'italic'
                    }}
                  >
                    *Ahorra hasta {formatUSD(regularTicketUSD * 0.5 * 30)} al mes si usas todos tus descuentos.
                    <br/>
                    Los descuentos no utilizados no son acumulables para el siguiente mes.
                  </Typography>
                </Typography>
                <GoldButton
                  variant="contained"
                  size="large"
                  sx={{ mt: 4 }}
                  onClick={handlePayment}
                >
                  ¡ÚNETE A LA ÉLITE ESTELAR!
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
            *Los descuentos son válidos solo para el titular de la membresía. No aplica en estrenos ni funciones especiales.
          </Typography>
        </ContentWrapper>
      </StyledContainer>
    </Box>
  );
};

export default BHMember; 