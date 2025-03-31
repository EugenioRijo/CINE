import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  AccountBalanceWallet,
  CreditCard,
  ArrowBack,
  Payments,
  CurrencyBitcoin,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Combo } from './SnackBar';

interface Seat {
  id: string;
  row: string;
  number: number;
  isOccupied: boolean;
  isSelected: boolean;
  isHandicap: boolean;
  isReclinable: boolean;
  isDamaged: boolean;
  isPreferential: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  size?: string;
  description?: string;
  image?: string;
}

interface PaymentProps {
  mode: 'light' | 'dark';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
  movieTitle: string;
  selectedTime: string;
  selectedRoom: string;
  selectedLanguage: string;
  selectedSeats: Seat[];
  selectedProducts: Product[];
  selectedCombos: Combo[];
  ticketPrice: {
    basePrice: number;
    surcharge: number;
    total: number;
    totalBs: number;
  };
  totalPrice: {
    subtotal: number;
    productsTotal: number;
    total: number;
    totalBs: number;
  };
  bcvRate: number;
  bcvDate: string;
}

interface PaymentMethodData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0a192f 0%, #000000 100%)'
    : 'linear-gradient(135deg, #f0f8ff 0%, #87ceeb 100%)',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const PaymentCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'rgba(255, 255, 255, 0.9)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  width: '100%',
  maxWidth: '1200px',
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
  height: '100%',
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

const availableProducts: Product[] = [
  { id: 1, name: 'Cotufas Grandes', price: 3.00, quantity: 0 },
  { id: 2, name: 'Refresco Grande', price: 2.00, quantity: 0 },
  { id: 3, name: 'Nachos con Queso', price: 4.00, quantity: 0 },
  { id: 4, name: 'Hot Dog', price: 3.00, quantity: 0 },
  { id: 5, name: 'Dulces Variados', price: 2.00, quantity: 0 },
  { id: 6, name: 'Agua Mineral', price: 1.00, quantity: 0 }
];

const Payment: React.FC<PaymentProps> = ({
  mode,
  onModeChange,
  movieTitle,
  selectedTime,
  selectedRoom,
  selectedLanguage,
  selectedSeats,
  selectedProducts,
  selectedCombos,
  ticketPrice,
  totalPrice,
  bcvRate,
  bcvDate,
}) => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const paymentMethods: PaymentMethodData[] = [
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
    alert('¡Pago procesado! Disfruta tu película.');
    navigate('/');
  };

  const getRoomName = (roomId: string) => {
    const roomNames: { [key: string]: string } = {
      'sala-standard-1': 'Sala Standard',
      'sala-3d': 'Sala 3D',
      'sala-4dx': 'Sala 4DX',
      'sala-screenx': 'Sala ScreenX',
      'sala-vip': 'Sala VIP',
      'sala-imax': 'Sala IMAX'
    };
    return roomNames[roomId] || roomId;
  };

  const getLanguageName = (languageId: string) => {
    return languageId === 'esp' ? 'Español Latino' : 'Subtitulada';
  };

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

      <PaymentCard>
        <Grid container spacing={4}>
          {/* Columna izquierda: Detalles de la película y snacks */}
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detalles de la Película
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={movieTitle}
                      secondary={`${getRoomName(selectedRoom)} - ${getLanguageName(selectedLanguage)} - ${selectedTime}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Asientos Seleccionados"
                      secondary={selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`Precio por Entrada: $${ticketPrice.total.toFixed(2)}`}
                      secondary={`Bs. ${ticketPrice.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Box>

            {(selectedCombos.length > 0 || selectedProducts.length > 0) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Snacks y Combos
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <List>
                    {selectedCombos.map((combo) => combo.quantity > 0 && (
                      <ListItem key={`combo-${combo.id}`}>
                        <ListItemText
                          primary={`${combo.name} x${combo.quantity}`}
                          secondary={
                            <>
                              <Typography variant="body2" component="span">
                                ${(combo.price * combo.quantity).toFixed(2)}
                              </Typography>
                              <br />
                              <Typography variant="body2" component="span">
                                Bs. {(combo.price * combo.quantity * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}

                    {['popcorn', 'drinks', 'snacks'].map((category) => {
                      const categoryProducts = selectedProducts.filter(p => p.category === category && p.quantity > 0);
                      if (categoryProducts.length === 0) return null;

                      return (
                        <React.Fragment key={category}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                                  {category === 'popcorn' ? 'Palomitas' : 
                                   category === 'drinks' ? 'Bebidas' : 'Snacks'}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {categoryProducts.map((product) => (
                            <ListItem key={`product-${product.id}`}>
                              <ListItemText
                                primary={`${product.name}${product.size ? ` (${product.size})` : ''} x${product.quantity}`}
                                secondary={
                                  <>
                                    <Typography variant="body2" component="span">
                                      ${(product.price * product.quantity).toFixed(2)}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Bs. {(product.price * product.quantity * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Paper>
              </Box>
            )}
          </Grid>

          {/* Columna derecha: Total y métodos de pago */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Total
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={`Entradas (${selectedSeats.length})`}
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            ${(ticketPrice.total * selectedSeats.length).toFixed(2)}
                          </Typography>
                          <br />
                          <Typography variant="body2" component="span">
                            Bs. {(ticketPrice.totalBs * selectedSeats.length).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {totalPrice.productsTotal > 0 && (
                    <ListItem>
                      <ListItemText
                        primary="Snacks y Combos"
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              ${totalPrice.productsTotal.toFixed(2)}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              Bs. {(totalPrice.productsTotal * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <ListItem>
                    <ListItemText
                      primary={<Typography variant="h6">Total a Pagar</Typography>}
                      secondary={
                        <>
                          <Typography variant="subtitle1" component="span" sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32', fontWeight: 'bold' }}>
                            ${totalPrice.total.toFixed(2)}
                          </Typography>
                          <br />
                          <Typography variant="subtitle1" component="span" sx={{ color: mode === 'dark' ? '#03b5fc' : '#ff8c32', fontWeight: 'bold' }}>
                            Bs. {totalPrice.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </List>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                  Tasa BCV: {bcvRate.toFixed(2)} - {bcvDate}
                </Typography>
              </Paper>
            </Box>

            <Typography variant="h6" gutterBottom>
              Método de Pago
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
          </Grid>
        </Grid>
      </PaymentCard>
    </StyledContainer>
  );
};

export default Payment; 