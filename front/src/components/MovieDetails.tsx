import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  styled,
  IconButton,
  Chip,
  Rating,
  Dialog,
  DialogContent,
  Card,
  CardContent,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import {
  AccessTime,
  CalendarToday,
  ArrowBack,
  LocalMovies,
  EventSeat,
  PlayCircle,
  Login,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import PurchaseFlow from './PurchaseFlow';
import { usePrices } from '../contexts/PriceContext';

interface MovieDetailsProps {
  mode: 'dark' | 'light';
  onModeChange: () => void;
  isLoggedIn?: boolean;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.mode === 'dark' ? '#0a192f' : '#f0f8ff',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const MovieImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '600px',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.5)'
    : '0 8px 32px rgba(0,0,0,0.1)',
  position: 'relative',
  backgroundRepeat: 'no-repeat',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)',
  },
}));

const InfoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(26, 32, 44, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
}));

const BuyButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
  fontSize: '1.2rem',
  fontWeight: 'bold',
  borderRadius: '30px',
  backgroundColor: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#0299d6' : '#ff7b1f',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  left: '20px',
  top: '80px',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(3, 181, 252, 0.1)'
    : 'rgba(255, 140, 50, 0.1)',
  color: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(3, 181, 252, 0.2)'
      : 'rgba(255, 140, 50, 0.2)',
  },
}));

const TrailerButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#1a2dd8' : '#ff4081',
  color: '#fff',
  padding: `${theme.spacing(1.5)} ${theme.spacing(4)}`,
  borderRadius: '30px',
  fontWeight: 'bold',
  fontSize: '1rem',
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2a3de8' : '#ff2171',
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 5px 15px rgba(26, 45, 216, 0.4)'
      : '0 5px 15px rgba(255, 64, 129, 0.4)',
  },
  transition: 'all 0.3s ease',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 3px 10px rgba(26, 45, 216, 0.3)'
    : '0 3px 10px rgba(255, 64, 129, 0.3)',
}));

const PriceBreakdown = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(3, 181, 252, 0.1)' : 'rgba(255, 140, 50, 0.1)',
  borderRadius: '8px',
  fontSize: '0.875rem'
}));

const rooms = {
  '1': { name: 'Sala 1', price: '$8.99' },
  '2': { name: 'Sala 2', price: '$8.99' },
  '3': { name: 'Sala 3', price: '$8.99' },
  '4': { name: 'Sala 4', price: '$8.99' },
  '5': { name: 'Sala 5', price: '$8.99' },
  '6': { name: 'Sala 6', price: '$8.99' },
  '7': { name: 'Sala 7', price: '$8.99' },
  '8': { name: 'Sala 8', price: '$8.99' },
  '9': { name: 'Sala 9', price: '$8.99' },
  '10': { name: 'Sala 10', price: '$8.99' },
  '11': { name: 'Sala 11', price: '$8.99' },
  '12': { name: 'Sala 12', price: '$8.99' },
  '13': { name: 'Sala 13', price: '$8.99' },
  '14': { name: 'Sala 14', price: '$8.99' },
  '15': { name: 'Sala 15', price: '$8.99' },
  '16': { name: 'Sala 16', price: '$8.99' },
  '17': { name: 'Sala 17', price: '$8.99' },
  '18': { name: 'Sala 18', price: '$8.99' },
  '19': { name: 'Sala 19', price: '$8.99' },
  '20': { name: 'Sala 20', price: '$8.99' },
};

interface Movie {
  title: string;
  imageUrl: string;
  description: string;
  duration: string;
  genre: string[];
  rating: number;
  schedule: string[];
  releaseDate: string;
  trailerUrl?: string;
  isEstreno?: boolean;
}

const moviesData: { [key: string]: Movie } = {
  '4': {
    title: 'ATTACK ON TITAN EL ATAQUE FINAL',
    imageUrl: '/img/aot.jpg',
    description: 'La batalla final por la humanidad comienza. Eren y sus compañeros se enfrentan a su destino en esta épica conclusión de la saga Attack on Titan.',
    duration: '2h 30min',
    genre: ['Anime', 'Acción', 'Fantasía'],
    rating: 4.9,
    schedule: ['12:00 PM', '2:30 PM', '5:00 PM', '7:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/3xNH23QkNpk?si=25yhurAbRYs3wGqA'
  },
  '14': {
    title: 'CAPITAN AMERICA UN NUEVO MUNDO',
    imageUrl: '/img/capitan.jpg',
    description: 'El Capitán América regresa en una nueva aventura épica donde deberá enfrentarse a una amenaza global que podría cambiar el mundo tal como lo conocemos.',
    duration: '2h 15min',
    genre: ['Acción', 'Aventura', 'Ciencia Ficción'],
    rating: 4.8,
    schedule: ['11:00 AM', '1:30 PM', '4:00 PM', '6:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/i0zaDSsk08w?si=BcYvxphzKM4W6iTT',
    isEstreno: true
  },
  '3': {
    title: 'ATTACK ON TITAN EL ATAQUE FINAL',
    imageUrl: '/img/titan.jpg',
    description: 'La batalla final por la humanidad comienza. Eren y sus compañeros se enfrentan a su destino en esta épica conclusión de la saga Attack on Titan.',
    duration: '2h 30min',
    genre: ['Anime', 'Acción', 'Fantasía'],
    rating: 4.9,
    schedule: ['12:00 PM', '2:30 PM', '5:00 PM', '7:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/3xNH23QkNpk?si=25yhurAbRYs3wGqA'
  },
  '5': {
    title: 'CODIGO NEGRO',
    imageUrl: '/img/codigonegro.jpg',
    description: 'Un thriller de espionaje donde un agente secreto debe descubrir una conspiración internacional antes de que sea demasiado tarde.',
    duration: '2h 10min',
    genre: ['Thriller', 'Acción', 'Suspense'],
    rating: 4.3,
    schedule: ['11:00 AM', '1:30 PM', '4:00 PM', '6:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/1QdSlGXn72M?si=9FEkCNtwhMUa4r6d',
    isEstreno: true
  },
  '11': {
    title: 'FLOW',
    imageUrl: '/img/flow.jpg',
    description: 'Una historia inspiradora sobre un joven bailarín que debe superar sus miedos y prejuicios para alcanzar sus sueños en el mundo de la danza urbana.',
    duration: '1h 45min',
    genre: ['Drama', 'Música', 'Danza'],
    rating: 4.6,
    schedule: ['3:30 PM', '6:00 PM', '8:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/izIuFUnZkjA?si=FKejhIgvD1Ip3Nj2'
  },
  '1': {
    title: 'COLORFUL STAGE MIKU NO PUEDE CANTAR',
    imageUrl: '/img/miku.jpg',
    description: 'Hatsune Miku se enfrenta a un desafío único cuando pierde su capacidad para cantar. Una aventura musical llena de emociones y melodías inolvidables.',
    duration: '1h 40min',
    genre: ['Anime', 'Música', 'Fantasía'],
    rating: 4.7,
    schedule: ['12:00 PM', '2:30 PM', '5:00 PM', '7:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/RZHkQe5ThQQ?si=YTUVoqojsnbzaRbX',
    isEstreno: true
  },
  '2': {
    title: 'UNA PELICULA DE MINECRAFT',
    imageUrl: '/img/minecraft.jpg',
    description: 'Adéntrate en el mundo de bloques más famoso en una aventura épica llena de creatividad, peligros y diversión para toda la familia.',
    duration: '1h 50min',
    genre: ['Animación', 'Aventura', 'Familia'],
    rating: 4.4,
    schedule: ['11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/yxrjSE8XddA?si=PiE5CpMR4beGvSLs',
    isEstreno: true
  },
  '6': {
    title: 'CONJURO DE LA BRUJA',
    imageUrl: '/img/bruja.jpg',
    description: 'Una aterradora historia de terror sobre una antigua maldición que despierta en un pueblo moderno, desatando el caos y el terror.',
    duration: '1h 58min',
    genre: ['Terror', 'Suspense', 'Sobrenatural'],
    rating: 4.2,
    schedule: ['12:30 PM', '3:00 PM', '5:30 PM', '8:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/4wIoIzcVFYw?si=FXvdJk_6_XN2ESAO'
  },
  '7': {
    title: 'ARGYLLE',
    imageUrl: '/img/argylle.jpg',
    description: 'Un grupo de supervivientes debe enfrentarse a una tormenta mortal y temperaturas extremas en esta intensa película de supervivencia.',
    duration: '2h 05min',
    genre: ['Thriller', 'Supervivencia', 'Drama'],
    rating: 4.1,
    schedule: ['11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/vTA_MQzWz3w?si=jOCGznqynaXhL1Sx'
  },
  '8': {
    title: 'ARGYLLE',
    imageUrl: '/img/argylle.jpg',
    description: 'Un joven aprendiz de mago debe proteger un antiguo artefacto mágico de fuerzas oscuras que amenazan con destruir el equilibrio del mundo.',
    duration: '2h 00min',
    genre: ['Fantasía', 'Aventura', 'Familia'],
    rating: 4.5,
    schedule: ['11:00 AM', '1:30 PM', '4:00 PM', '6:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/vTA_MQzWz3w?si=jOCGznqynaXhL1Sx'
  },
  '9': {
    title: 'NOVOCAINE',
    imageUrl: '/img/novocaide.jpg',
    description: 'Un thriller psicológico que sigue a un dentista cuya vida da un giro oscuro cuando se ve envuelto en una conspiración criminal.',
    duration: '1h 55min',
    genre: ['Thriller', 'Drama', 'Crimen'],
    rating: 4.3,
    schedule: ['12:30 PM', '3:00 PM', '5:30 PM', '8:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/pMfULWLqifI?si=PRtr1rcuDrYUib2l'
  },
  '10': {
    title: 'MICKEY 17',
    imageUrl: '/img/my17.jpg',
    description: 'En un futuro distópico, un clon debe enfrentarse a su propia identidad y destino mientras explora los límites de la humanidad y la tecnología.',
    duration: '2h 20min',
    genre: ['Ciencia Ficción', 'Drama', 'Thriller'],
    rating: 4.6,
    schedule: ['11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/hjS-RGoif1Q?si=-MdPs--y9z68X5FZ'
  },
  '12': {
    title: 'EL MONO',
    imageUrl: '/img/elmono.jpg',
    description: 'Una historia conmovedora sobre la relación entre un investigador y un primate extraordinario que desafía nuestra comprensión de la inteligencia animal.',
    duration: '1h 45min',
    genre: ['Drama', 'Aventura', 'Ciencia'],
    rating: 4.4,
    schedule: ['12:00 PM', '2:30 PM', '5:00 PM', '7:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/hOzVJSGSGXA?si=WRm6XID5-kjKCAC2'
  },
  '13': {
    title: 'OPERACION PANDA',
    imageUrl: '/img/oppanda.jpg',
    description: 'Una divertida aventura animada donde un grupo de pandas debe embarcarse en una misión secreta para salvar su hogar en la selva.',
    duration: '1h 35min',
    genre: ['Animación', 'Comedia', 'Familia'],
    rating: 4.5,
    schedule: ['11:00 AM', '1:30 PM', '4:00 PM', '6:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/QDkotU-lpeM?si=Jv4dyXklnsyIaZ_V'
  },
  '15': {
    title: 'AUN ESTOY AQUI',
    imageUrl: '/img/aun.jpg',
    description: 'Un conmovedor drama sobrenatural sobre el amor que trasciende la muerte y los lazos que nos mantienen conectados más allá de la vida.',
    duration: '2h 00min',
    genre: ['Drama', 'Romance', 'Sobrenatural'],
    rating: 4.7,
    schedule: ['11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/LDwVOHbJByk?si=wMOwb08BrGaos_9M'
  },
  '16': {
    title: 'EL BRUTALISTA',
    imageUrl: '/img/brutalista.jpg',
    description: 'La historia de un arquitecto visionario que debe enfrentarse a sus propios demonios mientras construye su obra maestra en un mundo que no lo comprende.',
    duration: '2h 15min',
    genre: ['Drama', 'Biografía', 'Arte'],
    rating: 4.2,
    schedule: ['11:00 AM', '1:30 PM', '4:00 PM', '6:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/vna5bN96xJg?si=Bx0CpjNR8TmN4qra',
    isEstreno: true
  },
  '17': {
    title: 'ANORA',
    imageUrl: '/img/anora.jpg',
    description: 'En un mundo fantástico, una joven guerrera debe descubrir sus poderes ocultos para salvar su reino de una antigua maldición.',
    duration: '2h 10min',
    genre: ['Fantasía', 'Aventura', 'Acción'],
    rating: 4.6,
    schedule: ['2:30 PM', '5:00 PM', '7:30 PM', '10:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/M25Dqnr6JYE?si=APuNdLojvMVhDuLf',
    isEstreno: true
  },
  '18': {
    title: 'SONIC 3 LA PELICULA',
    imageUrl: '/img/soc3.jpg',
    description: 'Sonic regresa en una nueva aventura a toda velocidad donde deberá enfrentarse a su mayor desafío hasta ahora para salvar tanto su mundo como el nuestro.',
    duration: '1h 55min',
    genre: ['Acción', 'Aventura', 'Familia'],
    rating: 4.8,
    schedule: ['11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/ySkQCd7UOhk?si=k7Ir8YEbx8fhYoQE',
    isEstreno: true
  },
  '19': {
    title: 'MUFASA EL REY LEON',
    imageUrl: '/img/RQZkM8L.jpg',
    description: 'Descubre la historia jamás contada del padre de Simba en esta emocionante precuela que explora los orígenes de uno de los reyes más legendarios de la sabana.',
    duration: '2h 00min',
    genre: ['Animación', 'Aventura', 'Drama'],
    rating: 4.7,
    schedule: ['12:00 PM', '2:30 PM', '5:00 PM', '7:30 PM'],
    releaseDate: '2024'
  }
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ mode, onModeChange, isLoggedIn = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [roomSchedules, setRoomSchedules] = useState<Record<string, string[]>>({});
  const [trailerOpen, setTrailerOpen] = useState(false);

  const movie = id ? moviesData[id as keyof typeof moviesData] : null;

  const { 
    regularTicketUSD,
    vipTicketUSD,
    childTicketUSD,
    seniorTicketUSD,
    formatUSD
  } = usePrices();

  const availableRooms = [
    { 
      id: 'sala-standard', 
      name: 'SALA STANDARD', 
      surcharge: 0,
      description: `Entrada ${formatUSD(regularTicketUSD)} + $0.00 de recargo`
    },
    { 
      id: 'sala-3d', 
      name: 'SALA 3D', 
      surcharge: 2,
      description: `Entrada ${formatUSD(regularTicketUSD)} + $2.00 de recargo`
    },
    { 
      id: 'sala-4dx', 
      name: 'SALA 4DX', 
      surcharge: 5,
      description: `Entrada ${formatUSD(regularTicketUSD)} + $5.00 de recargo`
    },
    { 
      id: 'sala-screenx', 
      name: 'SALA SCREENX', 
      surcharge: 3,
      description: `Entrada ${formatUSD(regularTicketUSD)} + $3.00 de recargo`
    },
    { 
      id: 'sala-vip', 
      name: 'SALA VIP', 
      surcharge: 4,
      description: `Entrada ${formatUSD(regularTicketUSD)} + $4.00 de recargo`
    },
    { 
      id: 'sala-imax', 
      name: 'SALA IMAX', 
      surcharge: 4.5,
      description: `Entrada ${formatUSD(regularTicketUSD)} + $4.50 de recargo`
    }
  ];

  const languageOptions = [
    { id: 'esp', name: 'Español Latino', description: 'Doblada al español latino' },
    { id: 'sub', name: 'Subtitulada', description: 'En idioma original con subtítulos en español' }
  ];

  // Función para generar horarios aleatorios para una sala
  const generateRandomSchedule = () => {
    const baseHours = [11, 13, 15, 17, 19, 21]; // 11 AM, 1 PM, 3 PM, 5 PM, 7 PM, 9 PM
    const randomHours = [...baseHours]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + Math.floor(Math.random() * 2)); // 3 o 4 horarios por sala

    return randomHours.map(hour => {
      const minutes = Math.random() < 0.5 ? '00' : '30';
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    }).sort((a, b) => {
      const timeA = new Date(`2024-01-01 ${a}`);
      const timeB = new Date(`2024-01-01 ${b}`);
      return timeA.getTime() - timeB.getTime();
    });
  };

  // Generar horarios aleatorios para cada sala cuando se monta el componente
  React.useEffect(() => {
    const schedules: Record<string, string[]> = {};
    availableRooms.forEach(room => {
      schedules[room.id] = generateRandomSchedule();
    });
    setRoomSchedules(schedules);
  }, []);

  if (!movie) {
    return (
      <StyledContainer>
        <Typography variant="h4" align="center" sx={{ mt: 8 }}>
          Película no encontrada
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" onClick={() => navigate('/cartelera')}>
            Volver a Cartelera
          </Button>
        </Box>
      </StyledContainer>
    );
  }

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    setSelectedTime(null);
  };

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const calculatePrice = (roomId: string) => {
    const room = availableRooms.find(r => r.id === roomId);
    const basePrice = movie.isEstreno ? 3.00 : 2.00;
    return room ? basePrice + room.surcharge : basePrice;
  };

  const handleStartPurchase = () => {
    if (!selectedTime || !selectedRoom || !selectedLanguage) return;
    
    if (!isLoggedIn) {
      // Guardar los datos de la película y la selección actual
      localStorage.setItem('redirectAfterLogin', '/movies/' + id);
      localStorage.setItem('movieSelectionData', JSON.stringify({
        movieId: id,
        movieTitle: movie.title,
        selectedTime,
        selectedRoom,
        selectedLanguage
      }));
      setShowLoginDialog(true);
    } else {
      setShowPurchaseFlow(true);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { 
        redirectUrl: '/movies/' + id,
        movieData: {
          movieId: id,
          movieTitle: movie.title,
          selectedTime,
          selectedRoom,
          selectedLanguage
        }
      } 
    });
  };

  const handleTrailerOpen = () => {
    setTrailerOpen(true);
  };

  const handleTrailerClose = () => {
    setTrailerOpen(false);
  };

  if (showPurchaseFlow) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: mode === 'dark' ? '#0a192f' : '#f0f8ff' }}>
        <Navbar mode={mode} onModeChange={onModeChange} />
        <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
          <PurchaseFlow
            mode={mode}
            movieId={id || ''}
            movieTitle={movie.title}
            selectedTime={selectedTime || ''}
            selectedRoom={selectedRoom}
            selectedLanguage={selectedLanguage}
            isLoggedIn={isLoggedIn}
            onBack={() => setShowPurchaseFlow(false)}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: mode === 'dark' ? '#0a192f' : '#f0f8ff' }}>
      <Navbar mode={mode} onModeChange={onModeChange} />
      <BackButton onClick={() => navigate('/cartelera')}>
        <ArrowBack />
      </BackButton>
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <MovieImage
              sx={{
                backgroundImage: `url(${movie.imageUrl})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: '400px',
              }}
            />
            {movie.trailerUrl && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <TrailerButton
                  onClick={handleTrailerOpen}
                  startIcon={<PlayCircle sx={{ fontSize: '1.5rem' }} />}
                >
                  Ver Trailer
                </TrailerButton>
              </Box>
            )}
            
            <Dialog
              open={trailerOpen}
              onClose={handleTrailerClose}
              maxWidth="md"
              fullWidth
            >
              <DialogContent sx={{ 
                p: 0, 
                backgroundColor: 'black',
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {movie.trailerUrl && (
                  <iframe
                    width="100%"
                    height="100%"
                    // src={movie.trailerUrl}
                    src={movie.trailerUrl.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0] + '?autoplay=1&rel=0&modestbranding=1'}
                    title={`${movie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </DialogContent>
            </Dialog>

            <Box sx={{ 
              mt: 3, 
              p: 3, 
              backgroundColor: mode === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '16px',
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32' }}>
                Tipos de Sala
              </Typography>
              <Grid container spacing={2}>
                {availableRooms.map((room) => (
                  <Grid item xs={12} key={room.id}>
                    <Box sx={{ 
                      p: 1.5,
                      borderRadius: '8px',
                      border: `1px solid ${mode === 'dark' ? 'rgba(3, 181, 252, 0.2)' : 'rgba(255, 140, 50, 0.2)'}`,
                    }}>
                      <Typography variant="subtitle1" sx={{ 
                        color: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                        fontWeight: 'bold',
                        mb: 0.5
                      }}>
                        {room.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                        {room.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoContainer>
              <Typography variant="h3" gutterBottom>
                {movie.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Rating value={movie.rating} precision={0.5} readOnly />
                <Typography variant="body1" sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32' }}>
                  {movie.rating}/5
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {movie.genre.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    sx={{
                      backgroundColor: mode === 'dark' ? 'rgba(3, 181, 252, 0.1)' : 'rgba(255, 140, 50, 0.1)',
                      color: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32' }} />
                  <Typography>{movie.duration}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32' }} />
                  <Typography>{movie.releaseDate}</Typography>
                </Box>
              </Box>

              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                {movie.description}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32', mb: 2 }}>
                Idioma
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                {languageOptions.map((lang) => (
                  <Button
                    key={lang.id}
                    variant={selectedLanguage === lang.id ? 'contained' : 'outlined'}
                    onClick={() => handleLanguageSelect(lang.id)}
                    sx={{
                      borderColor: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                      color: selectedLanguage === lang.id ? '#fff' : (mode === 'dark' ? '#03b5fc' : '#ff8c32'),
                      backgroundColor: selectedLanguage === lang.id 
                        ? (mode === 'dark' ? '#03b5fc' : '#ff8c32')
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: mode === 'dark' ? 'rgba(3, 181, 252, 0.2)' : 'rgba(255, 140, 50, 0.2)',
                      },
                    }}
                  >
                    {lang.name}
                  </Button>
                ))}
              </Box>

              <Typography variant="h6" gutterBottom sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32', mb: 2 }}>
                Salas Disponibles
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                {availableRooms.map((room) => (
                  <Box key={room.id} sx={{ width: '100%', mb: 2 }}>
                    <Button
                      fullWidth
                      variant={selectedRoom === room.id ? 'contained' : 'outlined'}
                      onClick={() => handleRoomSelect(room.id)}
                      sx={{
                        borderColor: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                        color: selectedRoom === room.id ? '#fff' : (mode === 'dark' ? '#03b5fc' : '#ff8c32'),
                        backgroundColor: selectedRoom === room.id 
                          ? (mode === 'dark' ? '#03b5fc' : '#ff8c32')
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: mode === 'dark' ? 'rgba(3, 181, 252, 0.2)' : 'rgba(255, 140, 50, 0.2)',
                        },
                        justifyContent: 'space-between',
                        padding: '12px 20px',
                      }}
                    >
                      <Typography component="span">{room.name}</Typography>
                      <Typography component="span">
                        ${calculatePrice(room.id).toFixed(2)}
                      </Typography>
                    </Button>
                    {selectedRoom === room.id && (
                      <PriceBreakdown>
                        <Typography variant="body2">
                          Entrada Base: ${movie.isEstreno ? '3.00' : '2.00'} + Recargo de Sala: ${room.surcharge.toFixed(2)}
                        </Typography>
                      </PriceBreakdown>
                    )}
                  </Box>
                ))}
              </Box>

              {selectedRoom && selectedLanguage && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32' }}>
                    Horarios Disponibles
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                    {roomSchedules[selectedRoom]?.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'contained' : 'outlined'}
                        onClick={() => handleTimeSelect(time)}
                        sx={{
                          borderColor: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                          color: selectedTime === time ? '#fff' : (mode === 'dark' ? '#03b5fc' : '#ff8c32'),
                          backgroundColor: selectedTime === time 
                            ? (mode === 'dark' ? '#03b5fc' : '#ff8c32')
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: mode === 'dark' ? 'rgba(3, 181, 252, 0.2)' : 'rgba(255, 140, 50, 0.2)',
                          },
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>
                </>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
                {selectedRoom && (
                  <Box>
                    <Typography variant="h6" sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32', mb: 1 }}>
                      Precio Total: ${calculatePrice(selectedRoom).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: mode === 'dark' ? '#a0a0a0' : '#666666' }}>
                      (Entrada ${movie.isEstreno ? '3.00' : '2.00'} + Recargo ${availableRooms.find(r => r.id === selectedRoom)?.surcharge.toFixed(2)})
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  startIcon={<EventSeat />}
                  disabled={!selectedTime || !selectedRoom || !selectedLanguage}
                  onClick={handleStartPurchase}
                  sx={{
                    backgroundColor: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                    '&:hover': {
                      backgroundColor: mode === 'dark' ? '#0299d6' : '#ff7b1f',
                    }
                  }}
                >
                  COMPRAR ENTRADA
                </Button>
              </Box>
            </InfoContainer>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: mode === 'dark' ? '#1a1a1a' : 'white',
            color: mode === 'dark' ? 'white' : 'black',
          }
        }}
      >
        <DialogTitle>Inicio de Sesión Requerido</DialogTitle>
        <DialogContent>
          <Typography>
            Para continuar con la compra de entradas, necesitas iniciar sesión o registrarte primero.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleLoginRedirect}
            variant="contained"
            color="primary"
            startIcon={<Login />}
          >
            Ir a Iniciar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieDetails; 