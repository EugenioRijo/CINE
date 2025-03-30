import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  styled,
  Chip,
} from '@mui/material';
import Navbar from './Navbar';
import SchoolIcon from '@mui/icons-material/School';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CelebrationIcon from '@mui/icons-material/Celebration';
import MovieIcon from '@mui/icons-material/Movie';

interface EventsProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledContainer = styled(Container)<{ mode: 'dark' | 'light' }>(({ mode, theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  maxWidth: 'none !important',
  margin: 0,
  padding: '64px 0 0 0',
  display: 'flex',
  flexDirection: 'column',
  background: mode === 'dark'
    ? 'linear-gradient(135deg, #0a192f 0%, #000000 100%)'
    : 'linear-gradient(135deg, #f0f8ff 0%, #87ceeb 100%)',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  maxWidth: '1400px',
  margin: '0 auto',
  width: '100%',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  color: theme.palette.mode === 'dark' ? '#fff' : '#1a237e',
  textAlign: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    background: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
    borderRadius: '2px',
  }
}));

const EventCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  }
}));

const EventTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? '#fff' : '#1a237e',
}));

const EventDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
  marginBottom: theme.spacing(2),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
  color: '#fff',
  '& .MuiChip-icon': {
    color: '#fff',
  }
}));

const events = [
  {
    id: 1,
    title: 'Miércoles Estudiantil',
    description: '50% de descuento en entradas presentando carnet estudiantil vigente. Válido para estudiantes de cualquier institución educativa.',
    icon: <SchoolIcon />,
    tags: ['Miércoles', 'Estudiantes', '50% OFF'],
    conditions: '* Válido solo los miércoles. No acumulable con otras promociones.'
  },
  {
    id: 2,
    title: 'Martes 2x1',
    description: 'Compra una entrada y llévate otra gratis. La entrada gratis debe ser para la misma función.',
    icon: <LocalOfferIcon />,
    tags: ['Martes', '2x1', 'Todos los géneros'],
    conditions: '* No válido para estrenos. No acumulable con otras promociones.'
  },
  {
    id: 3,
    title: 'Domingos Familiares',
    description: '25% de descuento en combos familiares y 20% en entradas al comprar 4 o más boletos.',
    icon: <GroupsIcon />,
    tags: ['Domingos', 'Familiar', 'Descuento Combo'],
    conditions: '* Válido solo los domingos. Aplica para grupos de 4 o más personas.'
  },
  {
    id: 4,
    title: 'Happy Birthday',
    description: 'Entrada gratis el día de tu cumpleaños presentando tu cédula. Incluye un combo personal de regalo.',
    icon: <CelebrationIcon />,
    tags: ['Cumpleaños', 'Gratis', 'Regalo'],
    conditions: '* Válido solo el día del cumpleaños. Documento de identidad requerido.'
  },
  {
    id: 5,
    title: 'Matiné Económica',
    description: '30% de descuento en todas las funciones antes de las 2:00 PM, de lunes a viernes.',
    icon: <MovieIcon />,
    tags: ['Matiné', 'Descuento', 'Lunes a Viernes'],
    conditions: '* Válido solo para funciones antes de las 2:00 PM.'
  },
  {
    id: 6,
    title: 'Jueves de Parejas',
    description: '2 entradas + 1 combo dúo por un precio especial. Perfecto para una cita romántica.',
    icon: <GroupsIcon />,
    tags: ['Jueves', 'Parejas', 'Combo Especial'],
    conditions: '* Válido solo los jueves. El combo incluye palomitas grandes y 2 refrescos medianos.'
  }
];

const Events: React.FC<EventsProps> = ({ mode, onModeChange }) => {
  return (
    <StyledContainer mode={mode}>
      <Navbar mode={mode} onModeChange={onModeChange} />
      <ContentContainer>
        <Title>Eventos y Promociones</Title>
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      mr: 2,
                      color: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                      '& svg': { fontSize: '2rem' }
                    }}>
                      {event.icon}
                    </Box>
                    <EventTitle variant="h5">
                      {event.title}
                    </EventTitle>
                  </Box>
                  <EventDescription>
                    {event.description}
                  </EventDescription>
                  <Box sx={{ mb: 2 }}>
                    {event.tags.map((tag, index) => (
                      <StyledChip
                        key={index}
                        label={tag}
                        size="small"
                        icon={<CalendarMonthIcon />}
                      />
                    ))}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      fontStyle: 'italic'
                    }}
                  >
                    {event.conditions}
                  </Typography>
                </CardContent>
              </EventCard>
            </Grid>
          ))}
        </Grid>
      </ContentContainer>
    </StyledContainer>
  );
};

export default Events; 