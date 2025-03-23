import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  styled,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import BookingSystem from './BookingSystem';
import PurchaseFlow from './PurchaseFlow';

interface MovieDetailsProps {
  mode: 'dark' | 'light';
  movie: {
    id: number;
    title: string;
    imageUrl: string;
    duration: number;
    description: string;
    genre: string[];
    rating: string;
  };
}

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0a192f 0%, #000000 100%)'
    : 'linear-gradient(135deg, #f0f8ff 0%, #87ceeb 100%)',
}));

const MovieImage = styled('img')({
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
});

const DetailsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(26, 35, 126, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
}));

const BookButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#0288d1' : '#ff7b1f',
  },
  marginTop: theme.spacing(2),
}));

const MovieDetails: React.FC<MovieDetailsProps> = ({ mode, movie }) => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <StyledContainer>
      {!showBooking ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <MovieImage src={movie.imageUrl} alt={movie.title} />
          </Grid>
          <Grid item xs={12} md={8}>
            <DetailsPaper>
              <Typography
                variant="h4"
                sx={{
                  color: mode === 'dark' ? 'white' : '#1a237e',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {movie.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${movie.duration} minutos`}
                  sx={{
                    backgroundColor: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                    color: 'white',
                  }}
                />
                <Chip
                  label={movie.rating}
                  sx={{
                    backgroundColor: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                    color: 'white',
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: mode === 'dark' ? 'white' : '#1a237e',
                  mb: 2,
                }}
              >
                {movie.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {movie.genre.map((genre, index) => (
                  <Chip
                    key={index}
                    label={genre}
                    sx={{
                      backgroundColor: mode === 'dark' ? 'rgba(3, 181, 252, 0.2)' : 'rgba(255, 140, 50, 0.2)',
                      color: mode === 'dark' ? 'white' : '#1a237e',
                    }}
                  />
                ))}
              </Box>

              <BookButton
                variant="contained"
                size="large"
                onClick={() => setShowBooking(true)}
              >
                Reservar Entradas
              </BookButton>
            </DetailsPaper>
          </Grid>
        </Grid>
      ) : (
        <Box>
          <Button
            variant="text"
            onClick={() => setShowBooking(false)}
            sx={{
              color: mode === 'dark' ? 'white' : '#1a237e',
              mb: 2,
            }}
          >
            ← Volver a detalles
          </Button>
          <PurchaseFlow 
            mode={mode}
            movieId={movie.id.toString()}
            isLoggedIn={true}
          />
        </Box>
      )}
    </StyledContainer>
  );
};

export default MovieDetails; 