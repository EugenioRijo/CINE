import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  styled,
  keyframes,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MovieIcon from '@mui/icons-material/Movie';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { FaFilm, FaTicketAlt, FaUtensils, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Theme } from '@mui/material/styles';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons';
import SpaceBackground from './SpaceBackground';

interface WelcomePageProps {
  mode: 'dark' | 'light';
  onStartJourney: () => void;
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface IconWrapperProps {
  Icon: IconType;
  size: number;
  color: string;
}

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const StyledContainer = styled(Container)<{ mode: 'dark' | 'light' }>(({ mode, theme }) => ({
  minHeight: '100vh',
  width: '100vw !important',
  maxWidth: 'none !important',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(8),
  position: 'relative',
  zIndex: 1,
}));

const FeatureBox = styled(Box)<{ mode: 'dark' | 'light' }>(({ mode }) => ({
  background: mode === 'dark'
    ? 'rgba(26, 32, 44, 0.8)'
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: 24,
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  boxShadow: mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(25, 118, 210, 0.15)',
  '&:hover': {
    transform: 'translateY(-10px)',
    background: mode === 'dark'
      ? 'rgba(26, 32, 44, 0.9)'
      : 'rgba(255, 255, 255, 1)',
    boxShadow: mode === 'dark'
      ? '0 12px 40px rgba(0, 0, 0, 0.4)'
      : '0 12px 40px rgba(25, 118, 210, 0.2)',
  }
}));

const MovieCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(25, 118, 210, 0.15)',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(26, 32, 44, 0.8)' 
    : 'rgba(255, 255, 255, 0.95)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 12px 40px rgba(0, 0, 0, 0.5)'
      : '0 12px 40px rgba(25, 118, 210, 0.25)',
  },
}));

const features = [
  {
    icon: <MovieIcon sx={{ fontSize: 40 }} />,
    title: 'Últimos Estrenos',
    description: 'Descubre las películas más esperadas del momento.',
  },
  {
    icon: <TheaterComedyIcon sx={{ fontSize: 40 }} />,
    title: 'Salas Premium',
    description: 'Experiencia cinematográfica de primera clase.',
  },
  {
    icon: <LocalActivityIcon sx={{ fontSize: 40 }} />,
    title: 'Eventos Especiales',
    description: 'Maratones y pre-estrenos exclusivos.',
  },
];

const movies = [
  {
    title: 'Dune: Parte 2',
    image: '/img/dune.jpg',
    year: '2024',
    duration: '2h 46min',
    genre: 'Ciencia ficción',
  },
  {
    title: 'Deadpool & Wolverine',
    image: '/img/deapool.jpg',
    year: '2024',
    duration: '2h 30min',
    genre: 'Acción/Comedia',
  },
  {
    title: 'Kung Fu Panda 4',
    image: '/img/kungfupanda4.jpg',
    year: '2024',
    duration: '1h 34min',
    genre: 'Animación',
  },
  {
    title: 'Civil War',
    image: '/img/civilw.jpg',
    year: '2024',
    duration: '1h 49min',
    genre: 'Acción/Drama',
  },
  {
    title: 'Godzilla x Kong: El Nuevo Imperio',
    image: '/img/godzilla.jpg',
    year: '2024',
    duration: '2h 15min',
    genre: 'Acción/Aventura',
  },
  {
    title: 'Ghostbusters: Frozen Empire',
    image: '/img/ghost.jpg',
    year: '2024',
    duration: '1h 55min',
    genre: 'Comedia/Fantasía',
  },
];

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(12),
  marginLeft: theme.spacing(4),
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  zIndex: 1,
  '@media (max-width: 600px)': {
    marginLeft: theme.spacing(2),
  },
}));

const Logo = styled('img')(({ theme }) => ({
  width: '120px',
  height: 'auto',
  filter: theme.palette.mode === 'dark'
    ? 'drop-shadow(0 0 20px rgba(3, 181, 252, 0.3))'
    : 'drop-shadow(0 0 20px rgba(25, 118, 210, 0.3))',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? 'white' : '#1a237e',
  textAlign: 'center',
  textShadow: theme.palette.mode === 'dark'
    ? '0 0 20px rgba(3, 181, 252, 0.3)'
    : '0 0 10px rgba(25, 118, 210, 0.2)',
  '@media (max-width: 600px)': {
    fontSize: '2rem',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#1a237e',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '1.2rem',
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  fontSize: '1.2rem',
  borderRadius: 30,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #03b5fc 30%, #1a2dd8 90%)'
    : 'linear-gradient(45deg, #4a69bd 30%, #6c5ce7 90%)',
  color: 'white',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 3px 15px rgba(3, 181, 252, 0.3)'
    : '0 3px 15px rgba(74, 105, 189, 0.3)',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #1a2dd8 30%, #03b5fc 90%)'
      : 'linear-gradient(45deg, #6c5ce7 30%, #4a69bd 90%)',
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 5px 20px rgba(3, 181, 252, 0.4)'
      : '0 5px 20px rgba(74, 105, 189, 0.4)',
  },
  transition: 'all 0.3s ease-in-out',
}));

// Nuevo componente para la sección de características
const FeatureSection = styled(Box)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
}));

// Componente para el carrusel de películas
const MovieCarousel = styled(Box)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto',
  '.swiper': {
    padding: theme.spacing(2),
  },
  '.swiper-slide': {
    transform: 'scale(0.85)',
    transition: 'transform 0.3s',
    '&.swiper-slide-active': {
      transform: 'scale(1)',
    },
  },
}));

const MotionButton = motion(Button);

const IconWrapper = React.memo<IconWrapperProps>(({ Icon, size, color }) => {
  const IconComponent = Icon as React.ComponentType<IconBaseProps>;
  
  return (
    <Box component="span" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
      <IconComponent size={size} color={color} />
    </Box>
  );
});

// Modificar el Box que contiene "¿Por qué elegirnos?" y "Próximamente"
const InfoBox = styled(Box)<{ mode: 'dark' | 'light' }>(({ mode }) => ({
  padding: '2rem',
  backgroundColor: mode === 'dark' 
    ? 'rgba(26, 32, 44, 0.8)' 
    : 'rgba(255, 255, 255, 0.95)',
  borderRadius: '1rem',
  boxShadow: mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(25, 118, 210, 0.15)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: mode === 'dark'
      ? '0 12px 40px rgba(0, 0, 0, 0.5)'
      : '0 12px 40px rgba(25, 118, 210, 0.25)',
  }
}));

const CenteredContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  marginTop: '2rem',
});

const WelcomePage: React.FC<WelcomePageProps> = ({ mode, onStartJourney, onModeChange }) => {
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <StyledContainer mode={mode}>
      <SpaceBackground mode={mode} />
      <Box sx={{ position: 'sticky', top: 0, zIndex: 2 }}>
        <Navbar mode={mode} onModeChange={onModeChange} />
      </Box>
      
      <LogoContainer>
        <Logo src="/planeta-cinema-logo.png" alt="Planeta Cinema Logo" />
      </LogoContainer>

      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 50 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <CenteredContent>
          <Title>Bienvenido a Planeta Cinema</Title>
          <Subtitle>
            Tu destino para las mejores películas y experiencias cinematográficas
          </Subtitle>
          <MotionButton
            variant="contained"
            size="large"
            onClick={onStartJourney}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Comenzar Viaje
          </MotionButton>
        </CenteredContent>
      </motion.div>

      <FeatureSection>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <FeatureBox mode={mode} data-aos="fade-up" data-aos-delay={index * 100}>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </FeatureBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </FeatureSection>

      <Box sx={{ py: 8, position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', px: 3 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 4,
            color: mode === 'dark' ? 'white' : '#1a237e',
            textShadow: mode === 'dark'
              ? '0 0 20px rgba(3, 181, 252, 0.2)'
              : '0 0 20px rgba(255, 140, 50, 0.2)',
          }}
          data-aos="fade-up"
        >
          Cartelera Actual
        </Typography>

        <MovieCarousel>
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation
          >
            {movies.map((movie, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MovieCard>
                    <CardMedia
                      component="img"
                      height="300"
                      image={movie.image}
                      alt={movie.title}
                      sx={{
                        objectFit: 'contain',
                        //width: '100%',
                        //maxHeight: '400px',
                        //margin: '0 auto',
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          color: mode === 'dark' ? 'white' : '#1a237e',
                          fontWeight: 600,
                        }}
                      >
                        {movie.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.7)',
                        }}
                      >
                        {movie.year} • {movie.duration}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.7)',
                        }}
                      >
                        {movie.genre}
                      </Typography>
                    </CardContent>
                  </MovieCard>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </MovieCarousel>

        <Box sx={{ mt: 8 }} data-aos="fade-up">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <InfoBox mode={mode}>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      color: mode === 'dark' ? 'white' : '#1a237e',
                      fontWeight: 600
                    }}
                  >
                    ¿Por qué elegirnos?
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconWrapper
                      Icon={FaFilm}
                      size={20}
                      color={mode === 'dark' ? '#03b5fc' : '#ff8c32'}
                    />
                    <Typography>La mejor selección de películas</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconWrapper
                      Icon={FaTicketAlt}
                      size={20}
                      color={mode === 'dark' ? '#03b5fc' : '#ff8c32'}
                    />
                    <Typography>Reservas fáciles y rápidas</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconWrapper
                      Icon={FaUtensils}
                      size={20}
                      color={mode === 'dark' ? '#03b5fc' : '#ff8c32'}
                    />
                    <Typography>Snacks y bebidas premium</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconWrapper
                      Icon={FaStar}
                      size={20}
                      color={mode === 'dark' ? '#03b5fc' : '#ff8c32'}
                    />
                    <Typography>Programa de lealtad exclusivo</Typography>
                  </Box>
                </InfoBox>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <InfoBox mode={mode}>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      color: mode === 'dark' ? 'white' : '#1a237e',
                      fontWeight: 600
                    }}
                  >
                    Próximamente
                  </Typography>
                  <Typography 
                    paragraph
                    sx={{ 
                      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#1a237e'
                    }}
                  >
                    ¡Mantente atento a nuestros próximos estrenos y eventos especiales!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => onStartJourney()}
                    sx={{ mt: 2 }}
                  >
                    Ver Cartelera
                  </Button>
                </InfoBox>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default WelcomePage; 