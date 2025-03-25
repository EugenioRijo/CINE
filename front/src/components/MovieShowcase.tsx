import React, { useState } from 'react';
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
import MovieDetails from './MovieDetails';

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  isTop?: boolean;
  duration: number;
  description: string;
  genre: string[];
  rating: string;
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
  // TOP 5 - Películas destacadas
  {
    id: 1,
    title: 'DUNE: PARTE DOS',
    imageUrl: '/img/dune.jpg',
    isTop: true,
    duration: 166,
    description: 'Paul Atreides se une a los Fremen y emprende un camino de venganza contra los conspiradores que destruyeron a su familia.',
    genre: ['Ciencia Ficción', 'Aventura', 'Drama'],
    rating: 'PG-13'
  },
  {
    id: 2,
    title: 'KUNG FU PANDA 4',
    imageUrl: '/img/kungfupanda4.jpg',
    isTop: true,
    duration: 94,
    description: 'Po debe entrenar a una nueva guerrera mientras enfrenta a una poderosa hechicera que busca controlar el reino espiritual.',
    genre: ['Animación', 'Comedia', 'Acción'],
    rating: 'PG'
  },
  {
    id: 3,
    title: 'GHOSTBUSTERS: IMPERIO HELADO',
    imageUrl: '/img/ghost.jpg',
    isTop: true,
    duration: 115,
    description: 'La familia Spengler regresa a donde comenzó todo: la icónica estación de bomberos de Nueva York.',
    genre: ['Comedia', 'Aventura', 'Fantasía'],
    rating: 'PG-13'
  },
  {
    id: 4,
    title: 'MADAME WEB',
    imageUrl: '/img/madameweb.jpg',
    isTop: true,
    duration: 116,
    description: 'Cassandra Webb desarrolla el poder de ver el futuro y debe proteger a tres jóvenes de un adversario mortal.',
    genre: ['Acción', 'Aventura', 'Ciencia Ficción'],
    rating: 'PG-13'
  },
  {
    id: 5,
    title: 'BOB MARLEY: ONE LOVE',
    imageUrl: '/img/bobmarley.jpg',
    isTop: true,
    duration: 107,
    description: 'La historia del icónico músico que inspiró a generaciones a través de su mensaje de amor y unidad.',
    genre: ['Drama', 'Biografía', 'Musical'],
    rating: 'PG-13'
  },
  // Películas regulares
  {
    id: 6,
    title: 'DEMON SLAYER: KIMETSU NO YAIBA',
    imageUrl: '/img/demonslayer.jpg',
    duration: 110,
    description: 'La última misión de Tanjiro lo lleva a enfrentar a poderosos demonios en el Distrito de la Herrería.',
    genre: ['Anime', 'Acción', 'Fantasía'],
    rating: 'PG-13'
  },
  {
    id: 7,
    title: 'IMAGINARY',
    imageUrl: '/img/imaginary.jpg',
    duration: 104,
    description: 'Una mujer descubre que el oso de peluche de su infancia es una entidad terrorífica.',
    genre: ['Terror', 'Suspenso'],
    rating: 'PG-13'
  },
  {
    id: 8,
    title: 'ARTHUR EL REY',
    imageUrl: '/img/arthur.jpg',
    duration: 120,
    description: 'Una nueva visión de la leyenda del Rey Arturo, llena de acción y aventura.',
    genre: ['Aventura', 'Fantasía', 'Acción'],
    rating: 'PG-13'
  },
  {
    id: 9,
    title: 'HÉROE POR ENCARGO',
    imageUrl: '/img/heroe.jpg',
    duration: 98,
    description: 'Un ex militar se convierte en héroe inesperado cuando debe proteger a una familia.',
    genre: ['Acción', 'Suspenso'],
    rating: 'R'
  },
  {
    id: 10,
    title: 'VIDAS PASADAS',
    imageUrl: '/img/vidaspasadas.jpg',
    duration: 106,
    description: 'Una historia de amor que atraviesa el tiempo y las culturas.',
    genre: ['Drama', 'Romance'],
    rating: 'PG-13'
  },
  {
    id: 11,
    title: 'TODAS MENOS TÚ',
    imageUrl: '/img/todosmenos.jpg',
    duration: 104,
    description: 'Una comedia romántica sobre dos personas que se odian pero deben fingir ser pareja.',
    genre: ['Comedia', 'Romance'],
    rating: 'PG-13'
  },
  {
    id: 12,
    title: 'POBRES CRIATURAS',
    imageUrl: '/img/pobrescriaturas.jpg',
    duration: 141,
    description: 'La historia de Bella Baxter, una joven revivida por un científico brillante.',
    genre: ['Drama', 'Ciencia Ficción', 'Romance'],
    rating: 'R'
  },
  {
    id: 13,
    title: 'ARGYLLE',
    imageUrl: '/img/argylle.jpg',
    duration: 139,
    description: 'Una autora de espías se ve envuelta en una conspiración real de espionaje.',
    genre: ['Acción', 'Suspenso', 'Comedia'],
    rating: 'PG-13'
  },
  {
    id: 14,
    title: 'CHICAS PESADAS',
    imageUrl: '/img/chicaspesadas.jpg',
    duration: 112,
    description: 'Un nuevo remake del clásico de comedia adolescente para una nueva generación.',
    genre: ['Comedia', 'Drama'],
    rating: 'PG-13'
  },
  {
    id: 15,
    title: 'WONKA',
    imageUrl: '/img/wonka.jpg',
    duration: 116,
    description: 'La historia del joven Willy Wonka y cómo se convirtió en el famoso chocolatero.',
    genre: ['Fantasía', 'Aventura', 'Musical'],
    rating: 'PG'
  }
];

const MovieShowcase: React.FC<MovieShowcaseProps> = ({ mode, onModeChange }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const topMovies = mockMovies.filter(movie => movie.isTop);
  const regularMovies = mockMovies.filter(movie => !movie.isTop);

  if (selectedMovie) {
    return (
      <MovieDetails
        mode={mode}
        movie={selectedMovie}
      />
    );
  }

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
                  <BuyButton
                    variant="contained"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    COMPRAR
                  </BuyButton>
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
                  <BuyButton
                    variant="contained"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    COMPRAR
                  </BuyButton>
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