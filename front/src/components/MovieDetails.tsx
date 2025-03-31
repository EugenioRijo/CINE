import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  AccessTime,
  CalendarToday,
  ArrowBack,
  LocalMovies,
  EventSeat,
  PlayCircle,
  Star,
  NewReleases,
  RocketLaunch,
  Public,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import PurchaseFlow from './PurchaseFlow';
import { useAuth } from './AuthContext'; // Asegúrate de que la ruta sea correcta
import { getBCVRate } from './shared/bcvApi';

interface MovieDetailsProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
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

interface Movie {
  title: string;
  imageUrl: string;
  description: string;
  duration: string;
  genre: string[];
  rating: number;
  price: number;
  schedule: string[];
  releaseDate: string;
  trailerUrl?: string;
  isNewRelease?: boolean;
  isPreRelease?: boolean;
}

const moviesData: Record<string, Movie> = {
  '4': {
    title: 'BLANCANIEVES',
    imageUrl: '/img/blanca.jpg',
    description: 'Una nueva versión del clásico cuento de hadas que sigue a una joven princesa que debe enfrentarse a su malvada madrastra en un mundo lleno de magia y peligros.',
    duration: '1h 55min',
    genre: ['Fantasía', 'Aventura', 'Drama'],
    rating: 4.5,
    price: 2.00,
    schedule: ['2:30 PM', '5:00 PM', '7:30 PM', '10:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/BE0BwFSYXOQ?si=eZovQ1JHjkuXW3wC',
    isNewRelease: false
  },
  '14': {
    title: 'CAPITAN AMERICA UN NUEVO MUNDO',
    imageUrl: '/img/capitan.jpg',
    description: 'El Capitán América regresa en una nueva aventura épica donde deberá enfrentarse a una amenaza global que podría cambiar el mundo tal como lo conocemos.',
    duration: '2h 15min',
    genre: ['Acción', 'Aventura', 'Ciencia Ficción'],
    rating: 4.8,
    price: 2.00,
    schedule: ['1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/i0zaDSsk08w?si=BcYvxphzKM4W6iTT',
    isNewRelease: false
  },
  '3': {
    title: 'ATTACK ON TITAN EL ATAQUE FINAL',
    imageUrl: '/img/titan.jpg',
    description: 'La batalla final por la humanidad comienza. Eren y sus compañeros se enfrentan a su destino en esta épica conclusión de la saga Attack on Titan.',
    duration: '2h 30min',
    genre: ['Anime', 'Acción', 'Fantasía'],
    rating: 4.9,
    price: 2.00,
    schedule: ['3:00 PM', '6:00 PM', '9:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/3xNH23QkNpk?si=25yhurAbRYs3wGqA',
    isNewRelease: false
  },
  '5': {
    title: 'CODIGO NEGRO',
    imageUrl: '/img/codigo.jpg',
    description: 'Un thriller de espionaje que sigue a un agente encubierto en una misión para desmantelar una red internacional de tráfico de armas.',
    duration: '2h 10min',
    genre: ['Acción', 'Thriller', 'Drama'],
    rating: 4.3,
    price: 2.00,
    schedule: ['2:00 PM', '4:30 PM', '7:00 PM', '9:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/BE0BwFSYXOQ?si=eZovQ1JHjkuXW3wC',
    isNewRelease: false
  },
  '6': {
    title: 'HATSUNE MIKU CONCIERTO MUNDIAL',
    imageUrl: '/img/miku.jpg',
    description: 'Experimenta el fenómeno global de la idol virtual Hatsune Miku en su gira mundial más espectacular hasta la fecha.',
    duration: '2h 00min',
    genre: ['Música', 'Concierto', 'Animación'],
    rating: 4.7,
    price: 2.00,
    schedule: ['3:30 PM', '6:00 PM', '8:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/BE0BwFSYXOQ?si=eZovQ1JHjkuXW3wC',
    isNewRelease: true
  },
  '7': {
    title: 'MINECRAFT LA PELICULA',
    imageUrl: '/img/minecraft.jpg',
    description: 'Sumérgete en el mundo de bloques más famoso en esta aventura épica que sigue a Steve y sus amigos en su lucha contra los mobs.',
    duration: '1h 45min',
    genre: ['Aventura', 'Fantasía', 'Familiar'],
    rating: 4.6,
    price: 2.00,
    schedule: ['1:30 PM', '4:00 PM', '6:30 PM', '9:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/BE0BwFSYXOQ?si=eZovQ1JHjkuXW3wC',
    isNewRelease: true
  },
  '8': {
    title: 'GODZILLA X KONG EL NUEVO IMPERIO',
    imageUrl: '/img/godzilla.jpg',
    description: 'Los titanes más poderosos del mundo se unen para enfrentar una amenaza colosal que podría destruir la Tierra.',
    duration: '2h 25min',
    genre: ['Acción', 'Ciencia Ficción', 'Aventura'],
    rating: 4.4,
    price: 2.00,
    schedule: ['2:15 PM', '5:00 PM', '7:45 PM', '10:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/BE0BwFSYXOQ?si=eZovQ1JHjkuXW3wC',
    isNewRelease: false
  },
  '9': {
    title: 'GHOSTBUSTERS APOCALIPSIS FANTASMA',
    imageUrl: '/img/ghost.jpg',
    description: 'Los cazafantasmas se enfrentan a su mayor desafío cuando una antigua profecía amenaza con desatar el apocalipsis fantasmal.',
    duration: '2h 15min',
    genre: ['Comedia', 'Acción', 'Fantasía'],
    rating: 4.2,
    price: 2.00,
    schedule: ['3:15 PM', '6:00 PM', '8:45 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/BE0BwFSYXOQ?si=eZovQ1JHjkuXW3wC',
    isNewRelease: false
  },
  '10': {
    title: 'KUNG FU PANDA 4',
    imageUrl: '/img/panda.jpg',
    description: 'Po debe entrenar a un nuevo guerrero del dragón mientras enfrenta una amenaza que podría destruir el Valle de la Paz.',
    duration: '1h 50min',
    genre: ['Animación', 'Comedia', 'Acción'],
    rating: 4.5,
    price: 2.00,
    schedule: ['1:45 PM', '4:15 PM', '6:45 PM', '9:15 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/BE0BwFSYXOQ?si=eZovQ1JHjkuXW3wC',
    isNewRelease: false
  },
  '11': {
    title: 'FLOW',
    imageUrl: '/img/flow.jpg',
    description: 'Una historia inspiradora sobre un joven bailarín que debe superar sus miedos y prejuicios para alcanzar sus sueños en el mundo de la danza urbana.',
    duration: '1h 45min',
    genre: ['Drama', 'Música', 'Danza'],
    rating: 4.6,
    price: 8.99,
    schedule: ['3:30 PM', '6:00 PM', '8:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/izIuFUnZkjA?si=FKejhIgvD1Ip3Nj2',
    isNewRelease: false
  },
  '1': {
    title: 'COLORFUL STAGE MIKU NO PUEDE CANTAR',
    imageUrl: '/img/miku.jpg',
    description: 'Hatsune Miku se enfrenta a un desafío único cuando pierde su capacidad para cantar. Una aventura musical llena de emociones y melodías inolvidables.',
    duration: '1h 40min',
    genre: ['Anime', 'Música', 'Fantasía'],
    rating: 4.7,
    price: 8.99,
    schedule: ['2:00 PM', '4:30 PM', '7:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/RZHkQe5ThQQ?si=YTUVoqojsnbzaRbX',
    isPreRelease: true
  },
  '2': {
    title: 'UNA PELICULA DE MINECRAFT',
    imageUrl: '/img/minecraft.jpg',
    description: 'Adéntrate en el mundo de bloques más famoso en una aventura épica llena de creatividad, peligros y diversión para toda la familia.',
    duration: '1h 50min',
    genre: ['Animación', 'Aventura', 'Familia'],
    rating: 4.4,
    price: 8.99,
    schedule: ['1:30 PM', '4:00 PM', '6:30 PM', '9:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/yxrjSE8XddA?si=PiE5CpMR4beGvSLs',
    isPreRelease: true
  },
  '12': {
    title: 'EL MONO',
    imageUrl: '/img/elmono.jpg',
    description: 'Una historia conmovedora sobre la relación entre un investigador y un primate extraordinario que desafía nuestra comprensión de la inteligencia animal.',
    duration: '1h 45min',
    genre: ['Drama', 'Aventura', 'Ciencia'],
    rating: 4.4,
    price: 8.99,
    schedule: ['3:00 PM', '5:30 PM', '8:00 PM'],
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
    price: 8.99,
    schedule: ['1:00 PM', '3:30 PM', '6:00 PM'],
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
    price: 8.99,
    schedule: ['2:00 PM', '4:30 PM', '7:00 PM', '9:30 PM'],
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
    price: 8.99,
    schedule: ['3:30 PM', '6:00 PM', '8:30 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/vna5bN96xJg?si=Bx0CpjNR8TmN4qra'
  },
  '17': {
    title: 'ANORA',
    imageUrl: '/img/anora.jpg',
    description: 'En un mundo fantástico, una joven guerrera debe descubrir sus poderes ocultos para salvar su reino de una antigua maldición.',
    duration: '2h 10min',
    genre: ['Fantasía', 'Aventura', 'Acción'],
    rating: 4.6,
    price: 9.99,
    schedule: ['2:30 PM', '5:00 PM', '7:30 PM', '10:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/M25Dqnr6JYE?si=APuNdLojvMVhDuLf'
  },
  '18': {
    title: 'SONIC 3 LA PELICULA',
    imageUrl: '/img/soc3.jpg',
    description: 'Sonic regresa en una nueva aventura a toda velocidad donde deberá enfrentarse a su mayor desafío hasta ahora para salvar tanto su mundo como el nuestro.',
    duration: '1h 55min',
    genre: ['Acción', 'Aventura', 'Familia'],
    rating: 4.8,
    price: 9.99,
    schedule: ['1:30 PM', '4:00 PM', '6:30 PM', '9:00 PM'],
    releaseDate: '2024',
    trailerUrl: 'https://youtu.be/ySkQCd7UOhk?si=k7Ir8YEbx8fhYoQE'
  },
  '19': {
    title: 'MUFASA EL REY LEON',
    imageUrl: '/img/RQZkM8L.jpg',
    description: 'Descubre la historia jamás contada del padre de Simba en esta emocionante precuela que explora los orígenes de uno de los reyes más legendarios de la sabana.',
    duration: '2h 00min',
    genre: ['Animación', 'Aventura', 'Drama'],
    rating: 4.7,
    price: 9.99,
    schedule: ['2:00 PM', '4:30 PM', '7:00 PM', '9:30 PM'],
    releaseDate: '2024',
  }
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ mode, onModeChange, isLoggedIn = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);
  const [roomSchedules, setRoomSchedules] = useState<Record<string, string[]>>({});
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [loginWarning, setLoginWarning] = useState<string>('');
  const [bcvRate, setBcvRate] = useState<number>(0);
  const [bcvDate, setBcvDate] = useState<string>('');

  const movie = id ? moviesData[id as keyof typeof moviesData] : null;

  const BASE_PRICE = 3.00;

  const availableRooms = [
    { 
      id: 'sala-standard-1', 
      name: 'Sala Standard', 
      surcharge: 0,
      description: 'Sala tradicional con sonido envolvente'
    },
    { 
      id: 'sala-3d', 
      name: 'Sala 3D', 
      surcharge: 3,
      description: 'Experiencia inmersiva en 3D con gafas especiales'
    },
    { 
      id: 'sala-4dx', 
      name: 'Sala 4DX', 
      surcharge: 5,
      description: 'Movimiento sincronizado y efectos ambientales'
    },
    { 
      id: 'sala-screenx', 
      name: 'Sala ScreenX', 
      surcharge: 4,
      description: 'Proyección panorámica de 270 grados'
    },
    { 
      id: 'sala-vip', 
      name: 'Sala VIP', 
      surcharge: 5,
      description: 'Asientos reclinables de lujo y servicio personalizado'
    },
    { 
      id: 'sala-imax', 
      name: 'Sala IMAX', 
      surcharge: 5,
      description: 'Pantalla gigante y calidad IMAX'
    }
  ];

  const languageOptions = [
    { id: 'esp', name: 'Español Latino', description: 'Doblada al español latino' },
    { id: 'sub', name: 'Subtitulada', description: 'En idioma original con subtítulos en español' }
  ];

  // Función para generar horarios aleatorios para una sala
  const generateRandomSchedule = () => {
    const baseHours = [
      '11:00 AM',
      '1:30 PM',
      '4:00 PM',
      '6:30 PM',
      '9:00 PM'
    ];
    
    // Seleccionar 3 o 4 horarios aleatorios
    return baseHours
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + Math.floor(Math.random() * 2))
      .sort((a, b) => {
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

  useEffect(() => {
    const fetchBCVRate = async () => {
      const response = await getBCVRate();
      setBcvRate(response.usd.rate);
      setBcvDate(response.usd.date);
    };
    fetchBCVRate();
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
    const room = availableRooms.find(room => room.id === roomId);
    const basePrice = 2.00; // Precio base del boleto
    const roomSurcharge = room ? room.surcharge : 0; // Recargo de la sala
    const total = Math.min(basePrice + roomSurcharge, 7.00); // Limitamos el precio total a $7.00
    const totalBs = total * bcvRate;
    return {
      basePrice,
      surcharge: roomSurcharge,
      total,
      totalBs
    };
  };

  const handleStartPurchase = () => {
    if (!selectedTime || !selectedRoom || !selectedLanguage) return;

    if (!user) { // Añadido: Verificar si el usuario está autenticado
      setLoginWarning('Debes iniciar sesión para comprar entradas.'); // Configura el mensaje
            setTimeout(() => {
                navigate('/login'); // Redireccionar después de unos segundos
            }, 2000); // 2 segundos
      return; // Evitar continuar con la compra
  }

    setShowPurchaseFlow(true);
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
            onModeChange={onModeChange}
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
            {/* Mostrar mensaje de advertencia */}
            {loginWarning && (
                <Typography variant="body1" color="error" align="center" sx={{ mb: 2 }}>
                    {loginWarning}
                </Typography>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <MovieImage
                        sx={{
                            backgroundImage: `url(${movie.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {movie.isNewRelease !== undefined && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    zIndex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: movie.isPreRelease ? '#9c27b0' : '#2196f3',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                }}
                            >
                                {movie.isPreRelease ? (
                                    <>
                                        <Star sx={{ mr: 1 }} />
                                        <Typography variant="subtitle1">Próximamente</Typography>
                                    </>
                                ) : (
                                    <>
                                        <Public sx={{ mr: 1 }} />
                                        <Typography variant="subtitle1">Estreno</Typography>
                                    </>
                                )}
                            </Box>
                        )}
                    </MovieImage>
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
                            {availableRooms.map((room) => {
                                const price = calculatePrice(room.id);
                                return (
                                    <Button
                                        key={room.id}
                                        variant={selectedRoom === room.id ? 'contained' : 'outlined'}
                                        onClick={() => handleRoomSelect(room.id)}
                                        sx={{
                                            margin: 1,
                                            borderColor: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                                            color: selectedRoom === room.id
                                                ? '#fff'
                                                : mode === 'dark'
                                                  ? '#03b5fc'
                                                  : '#ff8c32',
                                            backgroundColor: selectedRoom === room.id
                                                ? mode === 'dark'
                                                  ? '#03b5fc'
                                                  : '#ff8c32'
                                                : 'transparent',
                                            '&:hover': {
                                                backgroundColor: mode === 'dark' ? 'rgba(3, 181, 252, 0.1)' : 'rgba(255, 140, 50, 0.1)',
                                                borderColor: mode === 'dark' ? '#03b5fc' : '#ff8c32',
                                            },
                                        }}
                                    >
                                        {room.name}
                                    </Button>
                                );
                            })}
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
                                    <Typography variant="h6" sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32' }}>
                                        {(() => {
                                            const price = calculatePrice(selectedRoom);
                                            return `Precio: $${price.basePrice.toFixed(2)} + $${price.surcharge.toFixed(2)} = $${price.total.toFixed(2)}`;
                                        })()}
                                    </Typography>
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            color: '#4caf50',
                                            fontWeight: 'bold',
                                            mt: 1
                                        }}
                                    >
                                        {(() => {
                                            const price = calculatePrice(selectedRoom);
                                            return `Bs. ${price.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                        })()}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: 'text.secondary',
                                            display: 'block',
                                            mt: 0.5
                                        }}
                                    >
                                        {`Tasa BCV: ${bcvRate.toFixed(2)} - ${bcvDate}`}
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
    </Box>
);
};

export default MovieDetails;