import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: 450,
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
  },
}));

const HighlightText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: 300,
  marginBottom: 32,
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

export default function Content() {
  return (
    <ContentContainer>
      <ImageContainer>
        <StyledImage
          src="/cinema-illustration.png"
          alt="Planeta Cinema Illustration"
        />
      </ImageContainer>
      
      <Typography variant="h1" gutterBottom>
        Planeta Cinema
      </Typography>
      
      <Typography variant="h2" fontSize="1.5rem" gutterBottom>
        Tu portal al universo del cine
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Descubre un mundo de entretenimiento con las mejores películas y series.
        Disfruta de una experiencia cinematográfica única en{' '}
        <HighlightText>
          Planeta Cinema
        </HighlightText>
        .
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" fontWeight={500} gutterBottom>
          ¿Qué encontrarás?
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Estrenos exclusivos
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Salas premium con la mejor tecnología
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Experiencias VIP personalizadas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Eventos especiales y pre-estrenos
        </Typography>
      </Box>
    </ContentContainer>
  );
} 