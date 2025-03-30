import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export default function ColorModeSelect(props: IconButtonProps) {
  const [isDark, setIsDark] = React.useState(false);

  const toggleColorMode = () => {
    setIsDark(!isDark);
    // Aquí puedes agregar la lógica para cambiar el tema
  };

  return (
    <IconButton onClick={toggleColorMode} color="inherit" {...props}>
      {isDark ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
} 