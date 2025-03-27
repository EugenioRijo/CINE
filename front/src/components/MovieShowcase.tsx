import React from 'react';
import { Box, Grid, Typography, Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface MovieShowcaseProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  isTop?: boolean;
}

// Función para generar un color aleatorio para los placeholders
const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
    '#FF8C32', '#03b5fc', '#2ECC71', '#F1C40F'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const movies: Movie[] = [
  // TOP 5
  { id: '4', title: 'BLANCANIEVES', imageUrl: getRandomColor(), isTop: true },
  { id: '14', title: 'CAPITAN AMERICA UN NUEVO MUNDO', imageUrl: getRandomColor(), isTop: true },
  { id: '3', title: 'ATTACK ON TITAN EL ATAQUE FINAL', imageUrl: getRandomColor(), isTop: true },
  { id: '5', title: 'CODIGO NEGRO', imageUrl: getRandomColor(), isTop: true },
  { id: '11', title: 'FLOW', imageUrl: getRandomColor(), isTop: true },
  // Cartelera Regular
  { id: '1', title: 'COLORFUL STAGE MIKU NO PUEDE CANTAR', imageUrl: getRandomColor() },
  { id: '2', title: 'UNA PELICULA DE MINECRAFT', imageUrl: getRandomColor() },
  { id: '6', title: 'CONJURO DE LA BRUJA', imageUrl: getRandomColor() },
  { id: '7', title: 'FRIO', imageUrl: getRandomColor() },
  { id: '8', title: 'EL GUARDIAN DE LA MAGIA', imageUrl: getRandomColor() },
  { id: '9', title: 'NOVOCAINE', imageUrl: getRandomColor() },
  { id: '10', title: 'MICKEY 17', imageUrl: getRandomColor() },
  { id: '12', title: 'EL MONO', imageUrl: getRandomColor() },
  { id: '13', title: 'OPERACION PANDA', imageUrl: getRandomColor() },
  { id: '15', title: 'AUN ESTOY AQUI', imageUrl: getRandomColor() },
  { id: '16', title: 'EL BRUTALISTA', imageUrl: getRandomColor() },
  { id: '17', title: 'ANORA', imageUrl: getRandomColor() },
  { id: '18', title: 'SONIC 3 LA PELICULA', imageUrl: getRandomColor() },
  { id: '19', title: 'MUFASA EL REY LEON', imageUrl: getRandomColor() }
];

const ShowcaseContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#0a192f' : '#f0f8ff',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  paddingTop: theme.spacing(10),
  overflowY: 'auto',
  maxWidth: '1400px',
  margin: '0 auto',
  width: '100%',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(4),
  color: theme.palette.mode === 'dark' ? '#fff' : '#1a237e',
  position: 'relative',
  paddingLeft: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '4px',
    height: '80%',
    background: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
    borderRadius: '4px',
  },
}));

const MovieCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 16px rgba(0,0,0,0.4)'
    : '0 8px 16px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 12px 24px rgba(3, 181, 252, 0.2)'
      : '0 12px 24px rgba(255, 140, 50, 0.2)',
  },
}));

const MoviePlaceholder = styled(Box)<{ bgcolor: string }>(({ bgcolor }) => ({
  width: '100%',
  height: '400px',
  backgroundColor: bgcolor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
  }
}));

const MovieInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const ViewDetailsButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
  color: '#fff',
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  letterSpacing: '1px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#0299d6' : '#ff7b1f',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const MovieShowcase: React.FC<MovieShowcaseProps> = ({ mode, onModeChange }) => {
  const navigate = useNavigate();
  const topMovies = movies.filter(movie => movie.isTop);
  const regularMovies = movies.filter(movie => !movie.isTop);

  const handleViewDetails = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  const MovieGrid = ({ movies, columns }: { movies: Movie[], columns: number }) => (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={12/columns} key={movie.id}>
          <MovieCard>
            <MoviePlaceholder bgcolor={movie.imageUrl}>
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  textAlign: 'center',
                  padding: 2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  fontSize: '1rem',
                  maxWidth: '80%',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {movie.title}
              </Typography>
            </MoviePlaceholder>
            <MovieInfo>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  mb: 2,
                  color: mode === 'dark' ? '#fff' : '#000',
                  fontSize: '1rem',
                  lineHeight: 1.4,
                }}
              >
                {movie.title}
              </Typography>
              <ViewDetailsButton
                variant="contained"
                fullWidth
                onClick={() => handleViewDetails(movie.id)}
              >
                VER DETALLES
              </ViewDetailsButton>
            </MovieInfo>
          </MovieCard>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <ShowcaseContainer>
      <Navbar mode={mode} onModeChange={onModeChange} />
      <ContentContainer>
        <SectionTitle>
          TOP 5
        </SectionTitle>
        <MovieGrid movies={topMovies} columns={5} />
        
        <SectionTitle>
          CARTELERA
        </SectionTitle>
        <MovieGrid movies={regularMovies} columns={4} />
      </ContentContainer>
    </ShowcaseContainer>
  );
};

export default MovieShowcase; 