import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Divider,
  styled,
  IconButton,
} from '@mui/material';
import {
  AccountBalanceWallet,
  CreditCard,
  ArrowBack,
  Payments,
  CurrencyBitcoin,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface PaymentProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface LocationState {
  type: 'membership' | 'movie';
  items: {
    name: string;
    price: number;
    quantity?: number;
    description?: string;
  }[];
}

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0a192f 0%, #000000 100%)'
    : 'linear-gradient(135deg, #f0f8ff 0%, #87ceeb 100%)',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
}));

const PaymentCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'rgba(255, 255, 255, 0.9)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const PaymentMethodCard = styled(Paper)<{ selected?: boolean }>(({ theme, selected }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  background: selected
    ? theme.palette.mode === 'dark'
      ? 'rgba(3, 181, 252, 0.1)'
      : 'rgba(255, 140, 50, 0.1)'
    : theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.9)',
  border: `2px solid ${
    selected
      ? theme.palette.mode === 'dark'
        ? '#03b5fc'
        : '#ff8c32'
      : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'
  }`,
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(3, 181, 252, 0.1)'
      : '0 4px 20px rgba(255, 140, 50, 0.1)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '25px',
  fontWeight: 700,
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  textTransform: 'none',
}));

const ConfirmButton = styled(ActionButton)(({ theme }) => ({
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

const BackButton = styled(ActionButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)',
  },
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
}));

const Payment: React.FC<PaymentProps> = ({ mode, onModeChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<LocationState>({
    type: 'membership',
    items: [
      {
        name: 'BH Member Mensual',
        price: 10.00,
        description: 'Membresía mensual',
      }
    ]
  });

  useEffect(() => {
    if (location.state) {
      setPaymentData(location.state as LocationState);
    }
  }, [location]);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pago_movil',
      title: 'Pago Móvil',
      description: 'Transfiere desde tu banco usando Pago Móvil',
      icon: <AccountBalanceWallet />,
    },
    {
      id: 'zelle',
      title: 'Zelle',
      description: 'Paga con Zelle desde Estados Unidos',
      icon: <CreditCard />,
    },
    {
      id: 'efectivo',
      title: 'Efectivo',
      description: 'Paga en efectivo (USD o Bs) en taquilla',
      icon: <Payments />,
    },
    {
      id: 'binance',
      title: 'Binance Pay',
      description: 'Paga con criptomonedas usando Binance',
      icon: <CurrencyBitcoin />,
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPayment(selectedPayment === methodId ? null : methodId);
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) return;
    
    // Aquí iría la lógica de procesamiento de pago
    alert('¡Pago procesado! ' + (paymentData.type === 'membership' ? 'Bienvenido al lado oscuro del cine.' : 'Disfruta tu película.'));
    navigate('/');
  };

  const calculateTotal = () => {
    return paymentData.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const total = calculateTotal();
  const bsRate = 35.62; // Tasa de cambio USD a Bs

  return (
    <StyledContainer>
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          left: 16,
          top: 16,
          color: mode === 'dark' ? '#fff' : '#000',
        }}
      >
        <ArrowBack />
      </IconButton>

      <Typography
        variant="h4"
        sx={{
          color: mode === 'dark' ? '#fff' : '#000',
          mb: 4,
          mt: 6,
          textAlign: 'center',
        }}
      >
        Resumen de Compra
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <PaymentCard>
            <Typography variant="h6" sx={{ mb: 3, color: mode === 'dark' ? '#fff' : '#000' }}>
              Detalles de la Compra
            </Typography>
            {paymentData.items.map((item, index) => (
              <DetailRow key={index}>
                <Typography>
                  {item.name} {item.quantity ? `(${item.quantity})` : ''}
                </Typography>
                <Typography>
                  ${item.price.toFixed(2)} / Bs.S {(item.price * bsRate).toFixed(2)}
                </Typography>
              </DetailRow>
            ))}
          </PaymentCard>

          <Typography variant="h6" sx={{ mb: 2, mt: 4, color: mode === 'dark' ? '#fff' : '#000' }}>
            Selecciona el método de pago
          </Typography>
          <Grid container spacing={2}>
            {paymentMethods.map((method) => (
              <Grid item xs={12} sm={6} key={method.id}>
                <PaymentMethodCard
                  selected={selectedPayment === method.id}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                >
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ 
                      mb: 1,
                      color: mode === 'dark'
                        ? selectedPayment === method.id ? '#03b5fc' : 'rgba(255,255,255,0.7)'
                        : selectedPayment === method.id ? '#ff8c32' : 'rgba(0,0,0,0.7)'
                    }}>
                      {method.icon}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: mode === 'dark' ? '#fff' : '#000',
                        fontWeight: selectedPayment === method.id ? 700 : 400,
                      }}
                    >
                      {method.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                      }}
                    >
                      {method.description}
                    </Typography>
                  </Box>
                </PaymentMethodCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <PaymentCard>
            <Typography variant="h6" sx={{ mb: 3, color: mode === 'dark' ? '#fff' : '#000' }}>
              Resumen de Pago
            </Typography>
            <DetailRow>
              <Typography variant="h6">Total a pagar</Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32' }}>
                  ${total.toFixed(2)}
                </Typography>
                <Typography>Bs.S {(total * bsRate).toFixed(2)}</Typography>
              </Box>
            </DetailRow>
            <Box sx={{ mt: 4 }}>
              <ConfirmButton
                variant="contained"
                onClick={handleConfirmPayment}
                fullWidth
                disabled={!selectedPayment}
              >
                CONFIRMAR PAGO
              </ConfirmButton>
              <BackButton
                variant="outlined"
                onClick={handleBack}
                fullWidth
                sx={{ mt: 2 }}
              >
                VOLVER
              </BackButton>
            </Box>
          </PaymentCard>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Payment; 