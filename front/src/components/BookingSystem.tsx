import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Title,
  Subtitle,
  ThemeProps
} from './shared/CommonStyles';
import EventSeatIcon from '@mui/icons-material/EventSeat';

interface BookingSystemProps {
  mode: 'light' | 'dark';
  onSeatsSelected: (seats: Seat[]) => void;
  selectedRoom: string;
}

interface Seat {
  id: number;
  row: string;
  number: number;
  isOccupied: boolean;
  isSelected: boolean;
}

interface ShowTime {
  id: number;
  time: string;
  duration: number;
}

const MovieIcon = styled.div<ThemeProps>`
  font-size: 40px;
  margin-bottom: 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
`;

const MainContent = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: transparent;
`;

const Screen = styled.div<{ room: string }>`
  width: 80%;
  height: 10px;
  background: #41E1E1;
  margin: 0 auto 3rem auto;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(65, 225, 225, 0.5);
  position: relative;

  &:after {
    content: 'PANTALLA - SALA ${(props: { room: string }) => props.room}';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    color: #41E1E1;
    font-size: 0.8rem;
  }
`;

const TimeSelector = styled.select`
  width: 100%;
  max-width: 400px;
  margin: 0 auto 2rem auto;
  padding: 0.8rem;
  border-radius: 8px;
  background: rgba(26, 32, 44, 0.95);
  color: white;
  border: 1px solid rgba(65, 225, 225, 0.3);
  font-size: 1rem;
  cursor: pointer;
  display: block;

  &:focus {
    outline: none;
    border-color: #41E1E1;
  }

  option {
    background: #1a202c;
    color: white;
  }
`;

const SeatingArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: transparent;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RowLabel = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  width: 30px;
  text-align: center;
`;

const SeatButton = styled.button<{ isOccupied: boolean; isSelected: boolean }>`
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${(props: { isOccupied: boolean; isSelected: boolean }) => 
    props.isOccupied 
      ? '#666' 
      : props.isSelected 
        ? '#4BB543' 
        : '#41E1E1'};
  cursor: ${(props: { isOccupied: boolean }) => props.isOccupied ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1.8rem;
  }

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props: ThemeProps) => props.currentTheme === 'dark' ? '#ffffff' : '#4a4a4a'};
  font-size: 0.9rem;
`;

const LegendBox = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  background: ${(props: { color: string }) => props.color};
  border-radius: 4px;
`;

const SelectedSeatsInfo = styled.div<ThemeProps>`
  text-align: center;
  margin-top: 2rem;
  color: ${(props: ThemeProps) => props.currentTheme === 'dark' ? '#ffffff' : '#4a4a4a'};
  font-size: 1rem;
`;

// Horarios disponibles
const showTimes: ShowTime[] = [
  { id: 1, time: '11:00', duration: 120 },
  { id: 2, time: '14:30', duration: 120 },
  { id: 3, time: '17:00', duration: 120 },
  { id: 4, time: '19:30', duration: 120 },
  { id: 5, time: '22:00', duration: 120 }
];

const BookingSystem: React.FC<BookingSystemProps> = ({ mode, onSeatsSelected, selectedRoom }) => {
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [seats, setSeats] = useState<Seat[]>(generateSeats());

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied) return;

    const updatedSeats = seats.map(s => {
      if (s.id === seat.id) {
        return { ...s, isSelected: !s.isSelected };
      }
      return s;
    });

    setSeats(updatedSeats);
    onSeatsSelected(updatedSeats.filter(s => s.isSelected));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  return (
    <MainContent>
      <TimeSelector 
        value={selectedTime} 
        onChange={handleTimeChange}
      >
        <option value="">Selecciona un horario</option>
        {showTimes.map(time => (
          <option key={time.id} value={time.time}>
            {time.time} - Duración: {time.duration} min
          </option>
        ))}
      </TimeSelector>

      <Screen room={selectedRoom} />

      <SeatingArea>
        {Array.from(new Set(seats.map(seat => seat.row))).map((row) => (
          <Row key={row}>
            <RowLabel>{row}</RowLabel>
            {seats
              .filter(seat => seat.row === row)
              .map(seat => (
                <SeatButton
                  key={seat.id}
                  isOccupied={seat.isOccupied}
                  isSelected={seat.isSelected}
                  onClick={() => handleSeatClick(seat)}
                  title={`Fila ${seat.row} - Asiento ${seat.number}`}
                >
                  <EventSeatIcon />
                </SeatButton>
              ))}
          </Row>
        ))}

        <Legend>
          <LegendItem currentTheme={mode}>
            <LegendBox color="#41E1E1" />
            Disponible
          </LegendItem>
          <LegendItem currentTheme={mode}>
            <LegendBox color="#4BB543" />
            Seleccionado
          </LegendItem>
          <LegendItem currentTheme={mode}>
            <LegendBox color="#666" />
            Ocupado
          </LegendItem>
        </Legend>

        <SelectedSeatsInfo currentTheme={mode}>
          Asientos seleccionados: {seats.filter(s => s.isSelected).length}
        </SelectedSeatsInfo>
      </SeatingArea>
    </MainContent>
  );
};

function generateSeats(): Seat[] {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const seats: Seat[] = [];
  let id = 1;

  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        id: id++,
        row,
        number: i,
        isOccupied: Math.random() < 0.2,
        isSelected: false
      });
    }
  });

  return seats;
}

export default BookingSystem; 