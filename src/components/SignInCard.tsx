import React, { useState } from 'react';
import {
  Box,
  Card,
  CardProps,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  styled,
  Alert,
  Snackbar,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, LightMode, DarkMode } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface StyledCardProps extends Omit<CardProps, 'mode'> {
  mode: 'dark' | 'light';
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'mode',
})<StyledCardProps>(({ theme, mode }) => ({
  maxWidth: 400,
  width: '100%',
  borderRadius: 16,
  background: mode === 'dark' 
    ? 'linear-gradient(169.44deg, rgba(0, 0, 0, 0.7) 0%, rgba(13, 16, 45, 0.7) 100%)'
    : 'linear-gradient(169.44deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 242, 255, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  border: mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.05)'
    : '1px solid rgba(200, 220, 255, 0.3)',
  boxShadow: mode === 'dark'
    ? '0 4px 24px -1px rgba(0, 0, 0, 0.25)'
    : '0 4px 24px -1px rgba(160, 200, 255, 0.15)',
  '& .MuiTextField-root': {
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
      backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
      borderRadius: '8px',
      '& fieldset': {
        borderColor: mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(130, 170, 255, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: mode === 'dark'
          ? 'rgba(3, 181, 252, 0.3)'
          : 'rgba(255, 140, 50, 0.3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: mode === 'dark'
          ? 'rgba(3, 181, 252, 0.8)'
          : 'rgba(255, 140, 50, 0.8)',
      }
    }
  }
}));

interface SignInCardProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SignInCard({ mode, onModeChange }: SignInCardProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Por favor, ingresa un correo electrónico válido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe
        }),
      });

      if (response.ok) {
        navigate('/cartelera');
      } else {
        const data = await response.json();
        setAlertMessage(data.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage('Error de conexión. Por favor, verifica tu conexión a internet.');
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledCard mode={mode}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={onModeChange}>
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box 
            component="img"
            src="/planeta-cinema-logo.png"
            alt="Planeta Cinema"
            sx={{ 
              width: 80,
              height: 80,
              mb: 2,
              objectFit: 'contain',
              borderRadius: '12px'
            }}
          />
          <Typography 
            variant="h5" 
            sx={{ 
              color: mode === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.87)',
              mb: 1
            }}
          >
            Planeta Cinema
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
            }}
          >
            Bienvenido de vuelta
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            required
            fullWidth
            id="email"
            placeholder="tu@email.com"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            required
            fullWidth
            name="password"
            placeholder="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
            <Button
              onClick={() => navigate('/recuperar-password')}
              sx={{
                color: mode === 'dark' ? 'primary.main' : '#ff8c32',
                p: 0,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '14px',
                '&:hover': {
                  background: 'none',
                  opacity: 0.8
                }
              }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                '&.Mui-checked': {
                  color: mode === 'dark' ? 'primary.main' : '#ff8c32',
                }
              }}
            />
            <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
              Recordarme
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              py: 1.5,
              background: mode === 'dark'
                ? 'linear-gradient(45deg, rgba(26, 45, 216, 0.9) 0%, rgba(3, 181, 252, 0.9) 100%)'
                : 'linear-gradient(45deg, rgba(255, 140, 50, 0.9) 0%, rgba(255, 170, 80, 0.9) 100%)',
              '&:hover': {
                background: mode === 'dark'
                  ? 'linear-gradient(45deg, rgba(26, 45, 216, 1) 0%, rgba(3, 181, 252, 1) 100%)'
                  : 'linear-gradient(45deg, rgba(255, 140, 50, 1) 0%, rgba(255, 170, 80, 1) 100%)',
              }
            }}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
              ¿No tienes una cuenta?{' '}
              <Button
                onClick={() => navigate('/registro')}
                sx={{ 
                  color: mode === 'dark' ? 'primary.main' : '#ff8c32',
                  p: 0,
                  minWidth: 'auto',
                  textTransform: 'none',
                  fontWeight: 600,
                  ml: 0.5,
                  '&:hover': {
                    background: 'none',
                    opacity: 0.8
                  }
                }}
              >
                Regístrate
              </Button>
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </StyledCard>
  );
} 