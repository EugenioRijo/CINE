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
import { Visibility, VisibilityOff, Email, Lock, LightMode, DarkMode, Brightness4, Brightness7 } from '@mui/icons-material';
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
      backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      '& input': {
        color: mode === 'dark' ? '#fff' : '#000',
        '&:-webkit-autofill': {
          '-webkit-box-shadow': '0 0 0 30px transparent inset !important',
          '-webkit-text-fill-color': mode === 'dark' ? '#fff !important' : '#000 !important',
          'transition': 'background-color 5000s ease-in-out 0s',
          'background-color': 'transparent !important'
        }
      },
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
    },
    '& .MuiInputLabel-root': {
      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    },
    '& .MuiIconButton-root': {
      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    }
  }
}));

interface SignInCardProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const SignInCard: React.FC<SignInCardProps> = ({ mode, onModeChange }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (isRegistering) {
        // Validaciones
        if (!formData.email || !formData.password || !formData.nombre) {
          setError('Todos los campos son requeridos');
          return;
        }

        const response = await fetch('http://localhost:5000/api/usuario/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            nombre: formData.nombre
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al registrar usuario');
        }

        setSuccess('Usuario registrado exitosamente');
        setIsRegistering(false);
        // Limpiar el formulario después del registro exitoso
        setFormData({
          email: '',
          password: '',
          nombre: ''
        });
      } else {
        // Aquí iría la lógica de inicio de sesión
        if (!validateForm()) {
          return;
        }
        setError('Funcionalidad de inicio de sesión pendiente');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la operación');
    }
  };

  return (
    <StyledCard mode={mode}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton 
            onClick={onModeChange}
            sx={{
              color: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.7)',
              '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {isRegistering && (
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          <TextField
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={isRegistering ? formData.email : email}
            onChange={isRegistering ? handleInputChange : (e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ 
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                  }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete={isRegistering ? 'new-password' : 'current-password'}
            value={isRegistering ? formData.password : password}
            onChange={isRegistering ? handleInputChange : (e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ 
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                  }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{
                      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      '&:hover': {
                        backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                      }
                    }}
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
            {isSubmitting ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar sesión')}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccess(null);
                setFormData({ email: '', password: '', nombre: '' });
                setEmail('');
                setPassword('');
                setErrors({});
              }}
              sx={{
                color: mode === 'dark' ? 'primary.main' : '#ff8c32',
                textTransform: 'none',
                '&:hover': {
                  background: 'none',
                  opacity: 0.8
                }
              }}
            >
              {isRegistering
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </Button>
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
};

export default SignInCard; 