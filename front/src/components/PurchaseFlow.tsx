import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, styled } from '@mui/material';
import BookingSystem from './BookingSystem';
import Payment from './Payment';
import { SnackBar, Combo, Product } from './SnackBar';
import { getBCVRate } from './shared/bcvApi';

interface PurchaseFlowProps {
  mode: 'dark' | 'light';
  movieId: string;
  movieTitle: string;
  selectedTime: string;
  selectedRoom: string;
  selectedLanguage: string;
  isLoggedIn: boolean;
  onBack: () => void;
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PurchaseFlow: React.FC<PurchaseFlowProps> = ({
  mode,
  movieId,
  movieTitle,
  selectedTime,
  selectedRoom,
  selectedLanguage,
  isLoggedIn,
  onBack,
  onModeChange,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<Combo[]>([]);
  const [bcvRate, setBcvRate] = useState<number>(0);
  const [bcvDate, setBcvDate] = useState<string>('');

  useEffect(() => {
    const fetchBCVRate = async () => {
      const response = await getBCVRate();
      setBcvRate(response.usd.rate);
      setBcvDate(response.usd.date);
    };
    fetchBCVRate();
  }, []);

  const calculateTicketPrice = () => {
    const basePrice = 2.00;
    const roomSurcharges = {
      'sala-standard-1': 0,
      'sala-3d': 3,
      'sala-4dx': 5,
      'sala-screenx': 4,
      'sala-vip': 5,
      'sala-imax': 5
    };
    const surcharge = roomSurcharges[selectedRoom as keyof typeof roomSurcharges] || 0;
    const total = Math.min(basePrice + surcharge, 7.00);
    return {
      basePrice,
      surcharge,
      total,
      totalBs: total * bcvRate
    };
  };

  const calculateTotalPrice = () => {
    const ticketPrice = calculateTicketPrice();
    const productsTotal = selectedProducts.reduce((sum, product) => sum + (product.price * (product.quantity || 0)), 0);
    const combosTotal = selectedCombos.reduce((sum, combo) => sum + (combo.price * combo.quantity), 0);
    const total = (ticketPrice.total * selectedSeats.length) + productsTotal + combosTotal;
    return {
      subtotal: ticketPrice.total * selectedSeats.length,
      productsTotal: productsTotal + combosTotal,
      total,
      totalBs: total * bcvRate
    };
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleProductsSelected = (products: Product[]) => {
    setSelectedProducts(products);
  };

  const handleCombosSelected = (combos: Combo[]) => {
    setSelectedCombos(combos);
  };

  const steps = ['Selección de Asientos', 'Snacks y Combos', 'Pago'];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BookingSystem
            mode={mode}
            onSeatsSelected={(seats) => {
              setSelectedSeats(seats);
            }}
            selectedRoom={selectedRoom}
          />
        );
      case 1:
        return (
          <SnackBar
            mode={mode}
            onCombosSelected={handleCombosSelected}
            onProductsSelected={handleProductsSelected}
            showOnlyInBooking={true}
          />
        );
      case 2:
        return (
          <Payment
            mode={mode}
            onModeChange={onModeChange}
            movieTitle={movieTitle}
            selectedTime={selectedTime}
            selectedRoom={selectedRoom}
            selectedLanguage={selectedLanguage}
            selectedSeats={selectedSeats}
            selectedProducts={selectedProducts}
            selectedCombos={selectedCombos}
            ticketPrice={calculateTicketPrice()}
            totalPrice={calculateTotalPrice()}
            bcvRate={bcvRate}
            bcvDate={bcvDate}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            onClick={activeStep === 0 ? onBack : handleBack}
            sx={{ mr: 1 }}
          >
            {activeStep === 0 ? 'Volver' : 'Atrás'}
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {((activeStep === 0 && selectedSeats.length > 0) || activeStep === 1) && (
            <Button onClick={handleNext}>
              Siguiente
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PurchaseFlow; 