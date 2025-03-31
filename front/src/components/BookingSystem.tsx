import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Title,
  Subtitle,
  ThemeProps
} from './shared/CommonStyles';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AccessibleIcon from '@mui/icons-material/Accessible';
import WeekendIcon from '@mui/icons-material/Weekend';
import { Box, Typography } from '@mui/material';

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
  isHandicap: boolean;
  isDamaged?: boolean;
}

interface RoomConfig {
  rows: string[];
  seatsPerRow: number;
  aisleAfter: number[];  // Posiciones donde colocar pasillos
  walkwayRows: string[]; // Filas donde colocar pasillos horizontales
  handicapSeats: { row: string; seatNumbers: number[] }[];
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
  width: 90%;
  height: 8px;
  background: #41E1E1;
  margin: 0 auto 3rem auto;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(65, 225, 225, 0.5);
  position: relative;
  transform: perspective(200px) rotateX(-5deg);

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

const SeatingArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: transparent;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const RowLabel = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  width: 30px;
  text-align: center;
`;

const SeatButton = styled.button<{ 
  isOccupied: boolean; 
  isSelected: boolean; 
  isHandicap: boolean; 
  isDamaged?: boolean 
}>`
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 6px;
  background: ${(props: { 
    isOccupied: boolean; 
    isSelected: boolean; 
    isHandicap: boolean; 
    isDamaged?: boolean 
  }) => 
    props.isDamaged ? '#FF0000' :
    props.isOccupied ? '#666' : 
    props.isSelected ? '#4BB543' :
    props.isHandicap ? '#FFD700' : '#41E1E1'};
  cursor: ${(props: { 
    isOccupied: boolean;
    isDamaged?: boolean 
  }) => (props.isOccupied || props.isDamaged) ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  svg {
    font-size: 1.8rem;
  }

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(65, 225, 225, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Aisle = styled.div`
  width: 30px;
  height: 35px;
`;

const WalkwayRow = styled.div`
  height: 30px;
  width: 100%;
  margin: 0.5rem 0;
  border-top: 1px dashed rgba(65, 225, 225, 0.3);
  border-bottom: 1px dashed rgba(65, 225, 225, 0.3);
`;

function generateSeats(roomType: string): Seat[] {
  const seats: Seat[] = [];
  let id = 1;

  const configurations: Record<string, RoomConfig> = {
    'sala-standard-1': {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      seatsPerRow: 16,
      aisleAfter: [4, 12],
      walkwayRows: ['D'],
      handicapSeats: [{ row: 'H', seatNumbers: [1, 2, 15, 16] }]
    },
    'sala-3d': {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      seatsPerRow: 18,
      aisleAfter: [5, 13],
      walkwayRows: ['E'],
      handicapSeats: [{ row: 'I', seatNumbers: [1, 2, 17, 18] }]
    },
    'sala-4dx': {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      seatsPerRow: 20,
      aisleAfter: [6, 14],
      walkwayRows: ['D'],
      handicapSeats: [{ row: 'G', seatNumbers: [1, 2, 19, 20] }]
    },
    'sala-screenx': {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      seatsPerRow: 22,
      aisleAfter: [7, 15],
      walkwayRows: ['E'],
      handicapSeats: [{ row: 'I', seatNumbers: [1, 2, 21, 22] }]
    },
    'sala-vip': {
      rows: ['A', 'B', 'C', 'D'],
      seatsPerRow: 12,
      aisleAfter: [3, 9],
      walkwayRows: ['B'],
      handicapSeats: [{ row: 'D', seatNumbers: [1, 12] }]
    },
    'sala-imax': {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
      seatsPerRow: 24,
      aisleAfter: [8, 16],
      walkwayRows: ['D', 'H'],
      handicapSeats: [{ row: 'K', seatNumbers: [1, 2, 23, 24] }]
    }
  };

  const config = configurations[roomType] || configurations['sala-standard-1'];

  // Generar 3-5 asientos dañados aleatorios
  const numDamagedSeats = 3 + Math.floor(Math.random() * 3); // 3 a 5 asientos
  const damagedSeats = new Set<string>();
  
  while (damagedSeats.size < numDamagedSeats) {
    const randomRow = config.rows[Math.floor(Math.random() * config.rows.length)];
    const randomSeat = Math.floor(Math.random() * config.seatsPerRow) + 1;
    
    // Evitar seleccionar asientos en pasillos o asientos para discapacitados
    if (!config.aisleAfter.includes(randomSeat) && 
        !config.walkwayRows.includes(randomRow) &&
        !config.handicapSeats.some(h => h.row === randomRow && h.seatNumbers.includes(randomSeat))) {
      damagedSeats.add(`${randomRow}-${randomSeat}`);
    }
  }

  config.rows.forEach((row) => {
    for (let i = 1; i <= config.seatsPerRow; i++) {
      // Saltar asientos para crear pasillos verticales
      if (config.aisleAfter.includes(i)) {
        continue;
      }

      // Saltar filas completas para crear pasillos horizontales
      if (config.walkwayRows.includes(row)) {
        continue;
      }

      // Verificar si es un asiento para discapacitados
      const isHandicap = config.handicapSeats.some(
        h => h.row === row && h.seatNumbers.includes(i)
      );

      // Verificar si es un asiento dañado
      const isDamaged = damagedSeats.has(`${row}-${i}`);

      // Generar ocupación aleatoria (20% de probabilidad) solo para asientos no dañados
      const isOccupied = !isDamaged && Math.random() < 0.2;

      seats.push({
        id: id++,
        row,
        number: i,
        isOccupied,
        isSelected: false,
        isHandicap,
        isDamaged
      });
    }
  });

  return seats;
}

const BookingSystem: React.FC<BookingSystemProps> = ({ mode, onSeatsSelected, selectedRoom }) => {
  const [seats, setSeats] = useState<Seat[]>(generateSeats(selectedRoom));
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied || seat.isDamaged) return;

    const updatedSeats = seats.map(s => {
      if (s.id === seat.id) {
        return { ...s, isSelected: !s.isSelected };
      }
      return s;
    });

    setSeats(updatedSeats);
    
    const newSelectedSeats = updatedSeats.filter(s => s.isSelected);
    setSelectedSeats(newSelectedSeats);
    onSeatsSelected(newSelectedSeats);
  };

  const renderSeats = () => {
    const configurations: Record<string, RoomConfig> = {
      'sala-standard-1': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        seatsPerRow: 16,
        aisleAfter: [4, 12],
        walkwayRows: ['D'],
        handicapSeats: [{ row: 'H', seatNumbers: [1, 2, 15, 16] }]
      },
      'sala-3d': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        seatsPerRow: 18,
        aisleAfter: [5, 13],
        walkwayRows: ['E'],
        handicapSeats: [{ row: 'I', seatNumbers: [1, 2, 17, 18] }]
      },
      'sala-4dx': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        seatsPerRow: 20,
        aisleAfter: [6, 14],
        walkwayRows: ['D'],
        handicapSeats: [{ row: 'G', seatNumbers: [1, 2, 19, 20] }]
      },
      'sala-screenx': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        seatsPerRow: 22,
        aisleAfter: [7, 15],
        walkwayRows: ['E'],
        handicapSeats: [{ row: 'I', seatNumbers: [1, 2, 21, 22] }]
      },
      'sala-vip': {
        rows: ['A', 'B', 'C', 'D'],
        seatsPerRow: 12,
        aisleAfter: [3, 9],
        walkwayRows: ['B'],
        handicapSeats: [{ row: 'D', seatNumbers: [1, 12] }]
      },
      'sala-imax': {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
        seatsPerRow: 24,
        aisleAfter: [8, 16],
        walkwayRows: ['D', 'H'],
        handicapSeats: [{ row: 'K', seatNumbers: [1, 2, 23, 24] }]
      }
    };

    const currentConfig = configurations[selectedRoom as keyof typeof configurations] || configurations['sala-standard-1'];
    
    const seatsByRow = seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>);

    return currentConfig.rows.map((row: string) => {
      if (currentConfig.walkwayRows.includes(row)) {
        return <WalkwayRow key={`walkway-${row}`} />;
      }

      const rowSeats = seatsByRow[row] || [];
      return (
        <Row key={row}>
          <RowLabel>{row}</RowLabel>
          {Array.from({ length: currentConfig.seatsPerRow }, (_, i) => {
            const seatNumber = i + 1;
            const seat = rowSeats.find(s => s.number === seatNumber);

            if (currentConfig.aisleAfter.includes(seatNumber)) {
              return <Aisle key={`aisle-${row}-${seatNumber}`} />;
            }

            if (!seat) return <div key={`empty-${row}-${seatNumber}`} style={{ width: '35px', height: '35px' }} />;

            return (
              <SeatButton
                key={seat.id}
                disabled={seat.isOccupied || seat.isDamaged}
                isOccupied={seat.isOccupied}
                isSelected={seat.isSelected}
                isHandicap={seat.isHandicap}
                isDamaged={seat.isDamaged}
                onClick={() => handleSeatClick(seat)}
                title={`Fila ${seat.row} Asiento ${seat.number}${seat.isHandicap ? ' (Accesible)' : ''}`}
              >
                {seat.isHandicap ? <AccessibleIcon /> : null}
              </SeatButton>
            );
          })}
          <RowLabel>{row}</RowLabel>
        </Row>
      );
    });
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Screen room={selectedRoom} />
      <SeatingArea>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SeatButton
              as="div"
              isOccupied={false}
              isSelected={false}
              isHandicap={false}
            />
            <Typography>Disponible</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SeatButton
              as="div"
              isOccupied={true}
              isSelected={false}
              isHandicap={false}
            />
            <Typography>Ocupado</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SeatButton
              as="div"
              isOccupied={false}
              isSelected={false}
              isHandicap={false}
              isDamaged={true}
            />
            <Typography>Dañado</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SeatButton
              as="div"
              isOccupied={false}
              isSelected={true}
              isHandicap={false}
            />
            <Typography>Seleccionado</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SeatButton
              as="div"
              isOccupied={false}
              isSelected={false}
              isHandicap={true}
            >
              <AccessibleIcon />
            </SeatButton>
            <Typography>Accesible</Typography>
          </Box>
        </Box>
        {renderSeats()}
      </SeatingArea>
    </Box>
  );
};

export default BookingSystem; 