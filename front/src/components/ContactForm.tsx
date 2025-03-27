import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  styled,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import Navbar from './Navbar';

interface ContactFormProps {
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

const FormContainer = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.mode === 'dark' ? '#03b5fc' : '#ff8c32',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  borderRadius: '8px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #03b5fc 30%, #1a2dd8 90%)'
    : 'linear-gradient(45deg, #ff8c32 30%, #ffaa50 90%)',
  color: '#fff',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #1a2dd8 30%, #03b5fc 90%)'
      : 'linear-gradient(45deg, #ffaa50 30%, #ff8c32 90%)',
  },
}));

const ContactForm: React.FC<ContactFormProps> = ({ mode, onModeChange }) => {
  const [formData, setFormData] = useState({
    topic: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const topics = [
    'Sugerencias',
    'Reclamos',
    'Opiniones',
    'Alquiler de salas',
    'Publicidad',
    'Otros',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    // Resetear el formulario
    setFormData({
      topic: '',
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  return (
    <StyledContainer mode={mode}>
      <Navbar mode={mode} onModeChange={onModeChange} />
      <FormContainer>
        <Title>Contáctanos</Title>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
          En Planeta Cinema estamos interesados en conocer tu opinión. Envíanos tus sugerencias sobre nuestras salas o cualquiera de nuestros servicios.
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <StyledTextField
              select
              label="Tópico"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
            >
              {topics.map((topic) => (
                <MenuItem key={topic} value={topic}>
                  {topic}
                </MenuItem>
              ))}
            </StyledTextField>
          </FormControl>

          <StyledTextField
            fullWidth
            label="Nombre completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <StyledTextField
            fullWidth
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <StyledTextField
            fullWidth
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <StyledTextField
            fullWidth
            label="Mensaje"
            name="message"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
          />

          <SubmitButton
            type="submit"
            variant="contained"
            fullWidth
          >
            Enviar Mensaje
          </SubmitButton>
        </form>
      </FormContainer>
    </StyledContainer>
  );
};

export default ContactForm; 