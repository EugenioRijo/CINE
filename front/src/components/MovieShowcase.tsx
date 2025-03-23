import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  styled,
  Button,
} from '@mui/material';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import Navbar from './Navbar';

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  isTop?: boolean;
}

interface MovieShowcaseProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(8),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0a192f 0%, #000000 100%)'
    : 'linear-gradient(135deg, #f0f8ff 0%, #87ceeb 100%)',
}));

const MovieCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    '& .movie-overlay': {
      opacity: 1,
    },
  },
}));

const MovieImage = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
});

const MovieOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '20px',
  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
}));

const BuyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ff8c32',
  color: 'white',
  '&:hover': {
    backgroundColor: '#ff7b1f',
  },
  width: '100%',
  maxWidth: '200px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  marginBottom: theme.spacing(4),
  color: theme.palette.mode === 'dark' ? 'white' : '#2c3e50',
  '&::after': {
    content: '""',
    display: 'block',
    width: '60px',
    height: '3px',
    backgroundColor: '#ff8c32',
    marginTop: '10px',
  },
}));

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(2),
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
}));

const mockMovies: Movie[] = [
  { id: 1, title: 'CAPITAN AMERICA UN NUEVO MUNDO', imageUrl: '/img/capitan.jpg', isTop: true },
  { id: 2, title: 'MICKEY 17', imageUrl: '/img/my17.jpg', isTop: true },
  { id: 3, title: 'FLOW', imageUrl: '/img/flow.jpg', isTop: true },
  { id: 4, title: 'MUFASA EL REY LEON', imageUrl: '/img/mufasa.jpg', isTop: true },
  { id: 5, title: 'EL MONO', imageUrl: '/img/elmono.jpg', isTop: true },
  // Películas regulares
  { id: 6, title: 'BLANCANIEVES', imageUrl: '/img/blanca.jpg' },
  { id: 7, title: 'ATTACK ON TITAN EL ATAQUE FINAL', imageUrl: '/img/titan.jpg' },
  { id: 8, title: 'SONIC 3 LA PELICULA', imageUrl: '/img/sonic3.jpg' },
  // Añade más películas aquí...
];

const MovieShowcase: React.FC<MovieShowcaseProps> = ({ mode, onModeChange }) => {
  const topMovies = mockMovies.filter(movie => movie.isTop);
  const regularMovies = mockMovies.filter(movie => !movie.isTop);

  return (
    <StyledContainer>
      <Navbar />
      <ThemeToggle onClick={onModeChange} aria-label="toggle theme">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </ThemeToggle>
      <Box sx={{ py: 8 }}>
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

        {/* TOP 5 Section */}
        <SectionTitle variant="h2">TOP 5</SectionTitle>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {topMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={movie.id}>
              <MovieCard>
                <MovieImage src={movie.imageUrl} alt={movie.title} />
                <MovieOverlay className="movie-overlay">
                  <Typography variant="h6" align="center" sx={{ color: 'white', fontWeight: 600 }}>
                    {movie.title}
                  </Typography>
                  <BuyButton variant="contained">COMPRAR</BuyButton>
                </MovieOverlay>
              </MovieCard>
            </Grid>
          ))}
        </Grid>

        {/* Regular Movies Section */}
        <SectionTitle variant="h2">CARTELERA</SectionTitle>
        <Grid container spacing={4}>
          {regularMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard>
                <MovieImage src={movie.imageUrl} alt={movie.title} />
                <MovieOverlay className="movie-overlay">
                  <Typography variant="h6" align="center" sx={{ color: 'white', fontWeight: 600 }}>
                    {movie.title}
                  </Typography>
                  <BuyButton variant="contained">COMPRAR</BuyButton>
                </MovieOverlay>
              </MovieCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </StyledContainer>
  );
};

export default MovieShowcase; 