import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  styled,
} from '@mui/material';
import { WeekendOutlined } from '@mui/icons-material';

interface RoomSelectionProps {
  mode: 'dark' | 'light';
  selectedSeats: string[];
  onSeatsChange: (seats: string[]) => void;
  ticketPrice: {
    basePrice: number;
    surcharge: number;
    total: number;
    totalBs: number;
  };
  bcvRate: number;
  bcvDate: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#1a2027' : '#fff',
}));

const SeatButton = styled(Button)<{ isselected?: boolean }>(({ theme, isselected }) => ({
  minWidth: '40px',
  margin: '4px',
  backgroundColor: isselected ? theme.palette.primary.main : theme.palette.background.paper,
  color: isselected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: isselected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const RoomSelection: React.FC<RoomSelectionProps> = ({
  mode,
  selectedSeats,
  onSeatsChange,
  ticketPrice,
  bcvRate,
  bcvDate,
}) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const occupiedSeats = ['A1', 'B4', 'C7', 'D2', 'E5', 'F8', 'G3', 'H6'];

  const handleSeatClick = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      onSeatsChange(selectedSeats.filter(id => id !== seatId));
    } else {
      onSeatsChange([...selectedSeats, seatId]);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom align="center">
              Selección de Asientos
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Precio Base: ${ticketPrice.basePrice.toFixed(2)} + Recargo: ${ticketPrice.surcharge.toFixed(2)} = ${ticketPrice.total.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bs. {ticketPrice.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tasa BCV: {bcvRate.toFixed(2)} - {bcvDate}
              </Typography>
            </Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 3 }}>
                <SeatButton size="small" disabled>
                  <WeekendOutlined />
                </SeatButton>
                <Typography variant="caption" sx={{ ml: 1 }}>
                  Ocupado
                </Typography>
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 3 }}>
                <SeatButton size="small">
                  <WeekendOutlined />
                </SeatButton>
                <Typography variant="caption" sx={{ ml: 1 }}>
                  Disponible
                </Typography>
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <SeatButton size="small" isselected>
                  <WeekendOutlined />
                </SeatButton>
                <Typography variant="caption" sx={{ ml: 1 }}>
                  Seleccionado
                </Typography>
              </Box>
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ width: 'fit-content', margin: '0 auto' }}>
                {rows.map((row) => (
                  <Box key={row} sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Typography sx={{ width: '30px', textAlign: 'right', mr: 1, mt: 1 }}>
                      {row}
                    </Typography>
                    {Array.from({ length: seatsPerRow }, (_, i) => {
                      const seatId = `${row}${i + 1}`;
                      const isOccupied = occupiedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);
                      return (
                        <SeatButton
                          key={seatId}
                          size="small"
                          disabled={isOccupied}
                          isselected={isSelected}
                          onClick={() => handleSeatClick(seatId)}
                        >
                          <WeekendOutlined />
                        </SeatButton>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body1">
                Pantalla
              </Typography>
              <Box
                sx={{
                  height: '8px',
                  backgroundColor: mode === 'dark' ? 'grey.800' : 'grey.300',
                  borderRadius: '4px',
                  width: '80%',
                  margin: '8px auto',
                }}
              />
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Asientos Seleccionados
            </Typography>
            {selectedSeats.length > 0 ? (
              <>
                <Box sx={{ mb: 2 }}>
                  {selectedSeats.map((seatId) => (
                    <Typography key={seatId} variant="body1">
                      Asiento {seatId}
                    </Typography>
                  ))}
                </Box>
                <Typography variant="subtitle1" gutterBottom>
                  Total por Asiento: ${ticketPrice.total.toFixed(2)}
                </Typography>
                <Typography variant="h6" color="primary">
                  Total: ${(ticketPrice.total * selectedSeats.length).toFixed(2)}
                </Typography>
                <Typography variant="subtitle1" color="success.main">
                  Bs. {(ticketPrice.totalBs * selectedSeats.length).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No has seleccionado ningún asiento
              </Typography>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoomSelection;
