import React, { useEffect, useState, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Step,
  Stepper,
  StepLabel,
  keyframes,
} from '@mui/material';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import es from 'date-fns/locale/es';
import { Visibility, VisibilityOff, Email, Lock, Brightness4, Brightness7, Badge, RocketLaunch } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const rocketLaunchAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-1000px) rotate(-45deg);
    opacity: 0;
  }
`;

const WhiteRocketButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  left: '20px',
  top: '20px',
  background: 'transparent',
  color: '#ffffff',
  padding: '12px',
  zIndex: 10000,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'scale(1.1)',
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
  },
  '&.launching': {
    animation: `${rocketLaunchAnimation} 1s ease-in forwards`,
  },
}));

interface AuthResponse {
  access_token: string;
  cliente: {
    id: number;
    nombre: string;
    email: string;
    es_miembro: number;
  };
  error?: string;
}

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
    marginBottom: '12px',
    '& .MuiOutlinedInput-root': {
      backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      '& input': {
        padding: '10px 14px',
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
  const { login } = useAuth();
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
    cedula: '',
    fechaNacimiento: null as Date | null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openRecoveryDialog, setOpenRecoveryDialog] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStep, setRecoveryStep] = useState(0);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [dateInput, setDateInput] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const rocketRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

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

  // Función para validar cédula venezolana
  const validarCedula = (cedula: string) => {
    const cedulaRegex = /^[VE]-\d{7,8}$/;
    return cedulaRegex.test(cedula);
  };

  // Función para validar edad
  const validarEdad = (fecha: Date | null) => {
    if (!fecha) return false;
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      return edad - 1 >= 18;
    }
    return edad >= 18;
  };

  const validarFecha = (day: number, month: number, year: number): string | null => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 100; // No permitir fechas anteriores a 100 años
    const edad = currentYear - year;

    if (year > currentYear) {
      return "No puedes seleccionar una fecha futura";
    }
    if (year < minYear) {
      return "La fecha es demasiado antigua";
    }
    if (edad < 18) {
      return "Debes ser mayor de edad para registrarte";
    }

    // Validar días según el mes
    const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Ajustar febrero en año bisiesto
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
      diasPorMes[1] = 29;
    }

    if (day > diasPorMes[month - 1]) {
      return `El mes ${month} no tiene ${day} días`;
    }

    return null;
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    let formattedDate = '';
    setDateError(null);
    
    if (value.length > 0) {
      // Día
      if (value.length <= 2) {
        const day = parseInt(value);
        if (day > 31) value = '31';
        if (day < 1) value = '01';
        formattedDate = value;
      }
      // Mes
      else if (value.length <= 4) {
        const day = value.slice(0, 2);
        let month = value.slice(2);
        // Solo corregir si el mes es inválido
        if (month.length === 2) {
          const monthNum = parseInt(month);
          if (monthNum > 12) month = '12';
        } else if (month.length === 1) {
          // No corregir si solo se ha ingresado un dígito
          formattedDate = `${day}/${month}`;
        }
        formattedDate = `${day}/${month}`;
      }
      // Año
      else {
        const day = value.slice(0, 2);
        const month = value.slice(2, 4);
        let year = value.slice(4, 8);
        
        if (year.length === 4) {
          const dayNum = parseInt(day);
          const monthNum = parseInt(month);
          const yearNum = parseInt(year);
          
          const error = validarFecha(dayNum, monthNum, yearNum);
          if (error) {
            setDateError(error);
          } else {
            setFormData(prev => ({
              ...prev,
              fechaNacimiento: new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
            }));
          }
        }
        formattedDate = `${day}/${month}/${year}`;
      }
    }

    setDateInput(formattedDate);
  };

  // Función para manejar el proceso de recuperación
  const handleRecoverySubmit = async () => {
    setRecoveryError(null);
    try {
      switch (recoveryStep) {
        case 0:
          // Solicitar código de recuperación
          const responseEmail = await fetch('http://localhost:5000/api/auth/solicitar-recuperacion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: recoveryEmail }),
          });
          if (!responseEmail.ok) throw new Error('Email no encontrado');
          setRecoveryStep(1);
          break;

        case 1:
          // Verificar código
          const responseCode = await fetch('http://localhost:5000/api/auth/verificar-codigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: recoveryEmail,
              codigo: recoveryCode 
            }),
          });
          if (!responseCode.ok) throw new Error('Código inválido');
          setRecoveryStep(2);
          break;

        case 2:
          // Cambiar contraseña
          const responsePassword = await fetch('http://localhost:5000/api/auth/cambiar-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: recoveryEmail,
              codigo: recoveryCode,
              nueva_password: newPassword
            }),
          });
          if (!responsePassword.ok) throw new Error('Error al cambiar la contraseña');
          setOpenRecoveryDialog(false);
          setSuccess('Contraseña cambiada exitosamente');
          break;
      }
    } catch (err) {
      setRecoveryError(err instanceof Error ? err.message : 'Error en la recuperación');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
  
    try {
      if (isRegistering) {
        if (!formData.email || !formData.password || !formData.nombre || !formData.cedula || !formData.fechaNacimiento) {
          setError('Todos los campos son requeridos');
          return;
        }

        // Validar cédula
        if (!validarCedula(formData.cedula)) {
          setError('La cédula debe tener el formato V-1234567 o E-1234567');
          return;
        }

        // Validar edad
        if (!validarEdad(formData.fechaNacimiento)) {
          setError('Debes ser mayor de edad para registrarte');
          return;
        }
  
        const response = await fetch('http://localhost:5000/api/auth/registro', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            cedula: formData.cedula,
            fecha_nacimiento: formData.fechaNacimiento?.toISOString()
          }),
        });
  
        const data: AuthResponse = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Error en el registro');
        
        login(data.cliente);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', data.access_token);
        
        if (data.cliente.es_miembro === 1) {
          navigate('/admin/estadisticas');
        } else {
          navigate('/');
        }
      } else {
        if (!validateForm()) return;

        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email, password }),
        });

        const data: AuthResponse = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Credenciales inválidas');
      
        login(data.cliente);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', data.access_token);
        
        // Redirección para login
        if (data.cliente.es_miembro === 1) {
          navigate('/admin/estadisticas');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la operación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRocketReturn = () => {
    if (rocketRef.current) {
      rocketRef.current.classList.add('launching');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  return (
    <>
      <WhiteRocketButton onClick={handleRocketReturn} ref={rocketRef}>
        <RocketLaunch />
      </WhiteRocketButton>
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

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box 
              component="img"
              src="/planeta-cinema-logo.png"
              alt="Planeta Cinema"
              sx={{ 
                width: 60,
                height: 60,
                mb: 1,
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
            <Typography 
              variant="h5" 
              sx={{ 
                color: mode === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.87)',
                mb: 0.5
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

          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 1 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {isRegistering && (
              <>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  margin="dense"
                  required
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Cédula (V-1234567)"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  margin="dense"
                  required
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento (DD/MM/AAAA)"
                  value={dateInput}
                  onChange={handleDateInputChange}
                  inputProps={{ 
                    maxLength: 10,
                    placeholder: 'DD/MM/AAAA'
                  }}
                  margin="dense"
                  required
                  size="small"
                  error={!!dateError || (dateInput.length > 0 && dateInput.length < 10)}
                  helperText={
                    dateError ? dateError : 
                    (dateInput.length > 0 && dateInput.length < 10 ? "Formato: DD/MM/AAAA" : "")
                  }
                />
              </>
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
              margin="dense"
              size="small"
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
              margin="dense"
              size="small"
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
                      size="small"
                      sx={{
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {!isRegistering && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
                <Button
                  onClick={() => setOpenRecoveryDialog(true)}
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
            )}

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
                  setFormData({ email: '', password: '', nombre: '', cedula: '', fechaNacimiento: null });
                  setEmail('');
                  setPassword('');
                  setErrors({});
                  setDateInput('');
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
      </StyledCard>

      {/* Diálogo de Recuperación de Contraseña */}
      <Dialog 
        open={openRecoveryDialog} 
        onClose={() => setOpenRecoveryDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: mode === 'dark' 
              ? 'rgba(13, 16, 45, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(130, 170, 255, 0.2)',
            boxShadow: mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(160, 200, 255, 0.2)',
            '& .MuiDialogTitle-root': {
              color: mode === 'dark' ? '#fff' : '#000',
              borderBottom: mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
              padding: '16px 24px'
            },
            '& .MuiDialogContent-root': {
              padding: '24px',
              '& .MuiTextField-root': {
                backgroundColor: mode === 'dark' 
                  ? 'rgba(0, 0, 0, 0.2)'
                  : 'rgba(255, 255, 255, 0.9)',
              }
            },
            '& .MuiDialogActions-root': {
              padding: '16px 24px',
              borderTop: mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
            },
            '& .MuiStepLabel-label': {
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              '&.Mui-active': {
                color: mode === 'dark' ? '#fff' : '#000'
              }
            }
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: mode === 'dark' 
              ? 'rgba(0, 0, 0, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        <DialogTitle>Recuperar Contraseña</DialogTitle>
        <DialogContent>
          <Stepper activeStep={recoveryStep} sx={{ 
            mb: 3,
            '& .MuiStepIcon-root': {
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              '&.Mui-active': {
                color: mode === 'dark' ? 'primary.main' : '#ff8c32'
              },
              '&.Mui-completed': {
                color: mode === 'dark' ? 'primary.main' : '#ff8c32'
              }
            }
          }}>
            <Step>
              <StepLabel>Email</StepLabel>
            </Step>
            <Step>
              <StepLabel>Código</StepLabel>
            </Step>
            <Step>
              <StepLabel>Nueva Contraseña</StepLabel>
            </Step>
          </Stepper>

          {recoveryError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {recoveryError}
            </Alert>
          )}

          {recoveryStep === 0 && (
            <TextField
              fullWidth
              label="Email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              margin="normal"
              size="small"
            />
          )}

          {recoveryStep === 1 && (
            <TextField
              fullWidth
              label="Código de Verificación"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              margin="normal"
              size="small"
            />
          )}

          {recoveryStep === 2 && (
            <TextField
              fullWidth
              label="Nueva Contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              size="small"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenRecoveryDialog(false)}
            sx={{
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleRecoverySubmit} 
            variant="contained"
            sx={{
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
            {recoveryStep === 2 ? 'Finalizar' : 'Continuar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignInCard;