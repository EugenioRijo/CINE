import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Title,
  Subtitle,
  ThemeProps
} from './shared/CommonStyles';
import BookingSystem from './BookingSystem';
import SnackBarMenu, { Combo } from './SnackBar';
import RoomSelection from './RoomSelection';
import { rooms } from './shared/RoomTypes';

interface Seat {
  id: number;
  row: string;
  number: number;
  isOccupied: boolean;
  isSelected: boolean;
  isHandicap?: boolean;
  isReclinable?: boolean;
}

const steps = [
  'Reservar Asientos',
  'Elegir Combos',
  'Finalizar Compra'
];

interface PurchaseFlowProps {
  mode: 'dark' | 'light';
  movieId: string;
  movieTitle: string;
  selectedTime: string;
  selectedRoom: string;
  selectedLanguage: string;
  isLoggedIn: boolean;
  onBack: () => void;
}

const MainContent = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: rgba(255, 255, 255, 0);
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
`;

const MovieIcon = styled.div<ThemeProps>`
  font-size: 40px;
  margin-bottom: 1rem;
`;

const StepperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
`;

const Step = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background: ${(props: { isCompleted: boolean }) => props.isCompleted ? '#41E1E1' : 'rgba(255, 253, 250, 0.2)'};
    top: 15px;
    left: 50%;
    z-index: 0;
  }
`;

const StepCircle = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props: { isActive: boolean; isCompleted: boolean }) => 
    props.isActive ? '#41E1E1' : props.isCompleted ? '#4BB543' : 'rgba(255, 253, 250, 0.9)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props: { isActive: boolean; isCompleted: boolean }) => 
    props.isActive || props.isCompleted ? 'white' : '#4a4a4a'};
  font-weight: bold;
  margin-bottom: 0.5rem;
  z-index: 1;
  transition: all 0.2s ease;
`;

const StepLabel = styled.span<{ isActive: boolean }>`
  color: ${(props: { isActive: boolean }) => props.isActive ? '#41E1E1' : 'rgba(255, 253, 250, 0.9)'};
  font-size: 0.9rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 0 1rem;
`;

const NavigationButton = styled.button<{ isForward?: boolean }>`
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  background: ${(props: { isForward?: boolean }) => props.isForward ? '#41E1E1' : 'rgba(255, 253, 250, 0.9)'};
  color: ${(props: { isForward?: boolean }) => props.isForward ? 'white' : '#4a4a4a'};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SummaryContainer = styled.div`
  background: rgba(255, 253, 250, 0.9);
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const SummaryItem = styled.div`
  margin-bottom: 1rem;
  color: #4a4a4a;
`;

const SummaryTitle = styled.h3`
  color: #41E1E1;
  margin-bottom: 1.5rem;
`;

const TotalPrice = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(65, 225, 225, 0.2);
  font-weight: bold;
  color: #41E1E1;
  font-size: 1.2rem;
  text-align: right;
`;

const PurchaseFlow: React.FC<PurchaseFlowProps> = ({ 
  mode, 
  movieId, 
  movieTitle,
  selectedTime,
  selectedRoom,
  selectedLanguage,
  isLoggedIn, 
  onBack 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<Combo[]>([]);
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === 0 && selectedSeats.length === 0) {
      alert('Por favor, selecciona al menos un asiento');
      return;
    }

    if (activeStep === steps.length - 1) {
      // Calcular el precio total
      const selectedRoomData = rooms[selectedRoom];
      const ticketPrice = parseFloat(selectedRoomData.price.replace('$', ''));
      const ticketsTotal = ticketPrice * selectedSeats.length;
      const combosTotal = selectedCombos.reduce((total, combo) => total + (combo.price * combo.quantity), 0);
      const total = ticketsTotal + combosTotal;

      // Navegar a la página de pago con todos los detalles
      navigate('/payment', {
        state: {
          type: 'movie',
          items: [
            {
              name: `${movieTitle} - ${selectedRoomData.name}`,
              price: ticketsTotal,
              description: `Función: ${selectedTime} - Asientos: ${selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}`,
              quantity: selectedSeats.length
            },
            ...selectedCombos.map(combo => ({
              name: combo.name,
              price: combo.price * combo.quantity,
              description: combo.description,
              quantity: combo.quantity
            }))
          ],
          total
        }
      });
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0 && onBack) {
      onBack();
      return;
    }
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSeatsSelected = (seats: Seat[]) => {
    setSelectedSeats(seats);
  };

  const handleCombosSelected = (combos: Combo[]) => {
    setSelectedCombos(combos);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Title currentTheme={mode}>Selección de Asientos - {movieTitle}</Title>
            <Subtitle currentTheme={mode}>
              Sala: {rooms[selectedRoom].name} - Horario: {selectedTime}
            </Subtitle>
            <BookingSystem 
              mode={mode} 
              onSeatsSelected={handleSeatsSelected}
              selectedRoom={selectedRoom}
            />
          </>
        );
      case 1:
        return (
          <>
            <Title currentTheme={mode}>Selección de Combos - {movieTitle}</Title>
            <Subtitle currentTheme={mode}>
              ¡Completa tu experiencia con nuestros deliciosos combos!
            </Subtitle>
            <SnackBarMenu 
              mode={mode}
              onCombosSelected={handleCombosSelected}
              showOnlyInBooking={true}
            />
          </>
        );
      case 2:
        const selectedRoomData = rooms[selectedRoom];
        const ticketPrice = parseFloat(selectedRoomData.price.replace('$', ''));
        const ticketsTotal = ticketPrice * selectedSeats.length;
        const combosTotal = selectedCombos.reduce((total, combo) => total + (combo.price * combo.quantity), 0);
        const total = ticketsTotal + combosTotal;

        return (
          <SummaryContainer>
            <SummaryTitle>Resumen de Compra</SummaryTitle>
            <SummaryItem>
              <strong>Película:</strong> {movieTitle}
            </SummaryItem>
            <SummaryItem>
              <strong>Función:</strong> {selectedTime}
            </SummaryItem>
            <SummaryItem>
              <strong>Sala:</strong> {selectedRoomData.name} ({selectedRoomData.type})
            </SummaryItem>
            <SummaryItem>
              <strong>Idioma:</strong> {selectedLanguage === 'esp' ? 'Español Latino' : 'Subtitulada'}
            </SummaryItem>
            <SummaryItem>
              <strong>Asientos:</strong> {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
            </SummaryItem>
            <SummaryItem>
              <strong>Subtotal Entradas:</strong> ${ticketsTotal.toFixed(2)}
            </SummaryItem>
            {selectedCombos.length > 0 && (
              <>
                <SummaryItem>
                  <strong>Combos:</strong>
                  {selectedCombos.map(combo => (
                    <div key={combo.id}>
                      {combo.quantity}x {combo.name} - ${(combo.price * combo.quantity).toFixed(2)}
                    </div>
                  ))}
                </SummaryItem>
                <SummaryItem>
                  <strong>Subtotal Combos:</strong> ${combosTotal.toFixed(2)}
                </SummaryItem>
              </>
            )}
            <TotalPrice>
              Total a Pagar: ${total.toFixed(2)}
            </TotalPrice>
          </SummaryContainer>
        );
      default:
        return null;
    }
  };

  return (
    <MainContent>
      <StepperContainer>
        {steps.map((label, index) => (
          <Step key={index} isActive={activeStep === index} isCompleted={activeStep > index}>
            <StepCircle isActive={activeStep === index} isCompleted={activeStep > index}>
              {activeStep > index ? '✓' : index + 1}
            </StepCircle>
            <StepLabel isActive={activeStep === index}>{label}</StepLabel>
          </Step>
        ))}
      </StepperContainer>

      {getStepContent(activeStep)}

      <ButtonContainer>
        <NavigationButton onClick={handleBack}>
          {activeStep === 0 ? 'VOLVER A DETALLES' : 'ANTERIOR'}
        </NavigationButton>
        <NavigationButton
          isForward
          onClick={handleNext}
          disabled={activeStep === 0 && selectedSeats.length === 0}
        >
          {activeStep === steps.length - 1 ? 'PROCEDER AL PAGO' : 'SIGUIENTE'}
        </NavigationButton>
      </ButtonContainer>
    </MainContent>
  );
};

export default PurchaseFlow; 