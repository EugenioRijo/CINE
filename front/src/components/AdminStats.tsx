import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from './AuthContext';

const AdminStats: React.FC<{ mode: 'dark' | 'light'; onModeChange: () => void }> = ({ mode }) => {
  const { user } = useAuth();

  if (!user || user.es_miembro !== 1) {
    return <div>Acceso no autorizado</div>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
        Panel de Administración (En construcción)
      </Typography>
      {/* Aquí irán las estadísticas */}
    </Box>
  );
};

export default AdminStats;