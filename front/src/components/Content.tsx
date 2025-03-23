import React from 'react';
import { Box, Typography, styled } from '@mui/material';

interface ContentProps {
  mode: 'dark' | 'light';
}

const ContentContainer = styled(Box)<ContentProps>(({ theme, mode }) => ({
  maxWidth: 550,
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
  },
  '& .MuiTypography-root': {
    color: mode === 'dark' ? 'white' : '#2c3e50',
    transition: 'color 0.5s ease-in-out',
  },
  '& .MuiTypography-h1': {
    fontSize: '2.5rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  '& .MuiTypography-h2': {
    fontSize: '1.5rem',
    fontWeight: 500,
    marginBottom: theme.spacing(3),
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(44, 62, 80, 0.9)',
  },
  '& .MuiTypography-body1': {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    marginBottom: theme.spacing(3),
  },
  '& .MuiTypography-body2': {
    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(44, 62, 80, 0.7)',
    fontSize: '1rem',
    lineHeight: 1.8,
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  '& img': {
    width: '300px',
    height: 'auto',
    marginBottom: theme.spacing(2),
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  }
}));

const FeatureList = styled(Box)(({ theme }) => ({
  '& .MuiTypography-body2': {
    display: 'flex',
    alignItems: 'center',
    '&::before': {
      content: '"•"',
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
      fontSize: '1.2rem',
    }
  }
}));

export default function Content({ mode }: ContentProps) {
  return (
    <ContentContainer mode={mode}>
      <LogoContainer>
        <img src="/cinema-illustration.png" alt="Planeta Cinema" />
      </LogoContainer>
      
      <Typography variant="h2" sx={{ fontSize: '1.75rem', fontWeight: 500, mb: 2 }}>
        Tu portal al universo del cine
      </Typography>
      
      <Typography variant="body1">
        Descubre un mundo de entretenimiento con las mejores películas y series.
        Disfruta de una experiencia cinematográfica única en{' '}
        <Box component="span" sx={{ 
          color: mode === 'dark' ? 'primary.main' : '#ff8c32',
          fontWeight: 600 
        }}>
          Planeta Cinema
        </Box>.
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>¿Qué encontrarás?</Typography>
        <FeatureList>
          <Typography variant="body2" gutterBottom>
            Estrenos exclusivos
          </Typography>
          <Typography variant="body2" gutterBottom>
            Salas premium con la mejor tecnología
          </Typography>
          <Typography variant="body2" gutterBottom>
            Experiencias VIP personalizadas
          </Typography>
          <Typography variant="body2">
            Eventos especiales y pre-estrenos
          </Typography>
        </FeatureList>
      </Box>
    </ContentContainer>
  );
} 