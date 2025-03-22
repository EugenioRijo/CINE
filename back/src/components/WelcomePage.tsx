import React from 'react';
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
import { RocketLaunch, Movie, TheaterComedy, LocalActivity } from '@mui/icons-material';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface WelcomePageProps {
  mode: 'dark' | 'light';
  onStartJourney: () => void;
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
  paddingTop: '64px',
  display: 'flex',
  flexDirection: 'column',
  background: mode === 'dark'
    ? 'linear-gradient(135deg, #0a192f 0%, #000000 100%)'
    : 'linear-gradient(135deg, #f0f8ff 0%, #87ceeb 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url(/cinema-pattern.png)',
    opacity: 0.1,
    animation: `${floatAnimation} 15s ease-in-out infinite`,
  }
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
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: 24,
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  }
}));

const MovieCard = styled(Card)<{ mode: 'dark' | 'light' }>(({ mode }) => ({
  background: mode === 'dark'
    ? 'rgba(26, 32, 44, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  }
}));

const features = [
  {
    icon: <Movie sx={{ fontSize: 40 }} />,
    title: 'Últimos Estrenos',
    description: 'Descubre las películas más esperadas del momento.',
  },
  {
    icon: <TheaterComedy sx={{ fontSize: 40 }} />,
    title: 'Salas Premium',
    description: 'Experiencia cinematográfica de primera clase.',
  },
  {
    icon: <LocalActivity sx={{ fontSize: 40 }} />,
    title: 'Eventos Especiales',
    description: 'Maratones y pre-estrenos exclusivos.',
  },
];

const movies = [
  {
    title: 'Dune: Parte 2',
    image: '/images/dune-2.jpg',
    year: '2024',
    duration: '2h 46min',
    genre: 'Ciencia ficción',
  },
  {
    title: 'Deadpool & Wolverine',
    image: '/images/deadpool-wolverine.jpg',
    year: '2024',
    duration: '2h 30min',
    genre: 'Acción/Comedia',
  },
  {
    title: 'Kung Fu Panda 4',
    image: '/images/kung-fu-panda-4.jpg',
    year: '2024',
    duration: '1h 34min',
    genre: 'Animación',
  },
  {
    title: 'Civil War',
    image: '/images/civil-war.jpg',
    year: '2024',
    duration: '1h 49min',
    genre: 'Acción/Drama',
  },
  {
    title: 'Godzilla x Kong: El Nuevo Imperio',
    image: '/images/godzilla-kong.jpg',
    year: '2024',
    duration: '2h 15min',
    genre: 'Acción/Aventura',
  },
  {
    title: 'Ghostbusters: Frozen Empire',
    image: '/images/ghostbusters.jpg',
    year: '2024',
    duration: '1h 55min',
    genre: 'Comedia/Fantasía',
  },
];

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  animation: 'float 6s ease-in-out infinite',
  '@keyframes float': {
    '0%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
    '100%': {
      transform: 'translateY(0px)',
    },
  },
}));

const Logo = styled('img')(({ theme }) => ({
  width: '200px',
  height: 'auto',
  filter: theme.palette.mode === 'dark'
    ? 'drop-shadow(0 0 20px rgba(3, 181, 252, 0.3))'
    : 'drop-shadow(0 0 20px rgba(255, 140, 50, 0.3))',
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
    ? '0 0 20px rgba(3, 181, 252, 0.2)'
    : '0 0 20px rgba(255, 140, 50, 0.2)',
  '@media (max-width: 600px)': {
    fontSize: '2rem',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  color: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.7)'
    : 'rgba(0, 0, 0, 0.7)',
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '1.2rem',
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  fontSize: '1.2rem',
  borderRadius: 30,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #03b5fc 30%, #1a2dd8 90%)'
    : 'linear-gradient(45deg, #ff8c32 30%, #ffaa50 90%)',
  color: 'white',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 3px 15px rgba(3, 181, 252, 0.3)'
    : '0 3px 15px rgba(255, 140, 50, 0.3)',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #1a2dd8 30%, #03b5fc 90%)'
      : 'linear-gradient(45deg, #ffaa50 30%, #ff8c32 90%)',
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 5px 20px rgba(3, 181, 252, 0.4)'
      : '0 5px 20px rgba(255, 140, 50, 0.4)',
  },
  transition: 'all 0.3s ease-in-out',
}));

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: 'calc(64px + 16px)',
  right: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? 'white' : '#1a237e',
  background: theme.palette.mode === 'dark'
    ? 'rgba(3, 181, 252, 0.1)'
    : 'rgba(255, 140, 50, 0.1)',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(3, 181, 252, 0.2)'
      : 'rgba(255, 140, 50, 0.2)',
  },
  zIndex: 1000,
}));

const WelcomePage: React.FC<WelcomePageProps> = ({
  mode,
  onStartJourney,
  onModeChange,
}) => {
  return (
    <StyledContainer mode={mode}>
      <Navbar />
      <ThemeToggle onClick={onModeChange} aria-label="toggle theme">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </ThemeToggle>
      <LogoContainer>
        <Logo src="/planeta-cinema-logo.png" alt="Planeta Cinema Logo" />
      </LogoContainer>
      <Title>Bienvenido a Planeta Cinema</Title>
      <Subtitle>
        Tu destino para las mejores películas y experiencias cinematográficas
      </Subtitle>
      <StartButton
        variant="contained"
        size="large"
        onClick={onStartJourney}
      >
        Comenzar Viaje
      </StartButton>

      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
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
        >
          Cartelera Actual
        </Typography>

        <Grid container spacing={4}>
          {movies.map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MovieCard mode={mode}>
                <CardMedia
                  component="img"
                  height="400"
                  image={movie.image}
                  alt={movie.title}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
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
            </Grid>
          ))}
        </Grid>
      </Box>
    </StyledContainer>
  );
};

export default WelcomePage; 