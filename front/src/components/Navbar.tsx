import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Typography,
  styled,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(26, 32, 44, 0.8)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(3, 181, 252, 0.2)'
      : 'rgba(255, 140, 50, 0.2)'
  }`,
  height: '64px',
  zIndex: 1100,
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: '64px',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
  margin: theme.spacing(0, 1),
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(3, 181, 252, 0.1)'
      : 'rgba(255, 140, 50, 0.1)',
  },
}));

const Logo = styled('img')({
  height: '40px',
  marginRight: '16px',
});

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <Logo src="/planeta-cinema-logo.png" alt="Planeta Cinema" />
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: (theme) =>
              theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
            ml: 2,
          }}
        >
          Planeta Cinema
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <NavButton
            startIcon={<MovieIcon />}
            onClick={() => handleNavigation('/cartelera')}
          >
            Cartelera
          </NavButton>
          <NavButton
            startIcon={<LocalActivityIcon />}
            onClick={() => handleNavigation('/eventos')}
          >
            Eventos
          </NavButton>
          <NavButton
            startIcon={<InfoIcon />}
            onClick={() => handleNavigation('/sobre-nosotros')}
          >
            Sobre Nosotros
          </NavButton>
          <NavButton
            startIcon={<PersonIcon />}
            onClick={() => handleNavigation('/login')}
          >
            Iniciar Sesión
          </NavButton>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleNavigation('/cartelera')}>
              <MovieIcon sx={{ mr: 1 }} /> Cartelera
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/eventos')}>
              <LocalActivityIcon sx={{ mr: 1 }} /> Eventos
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/sobre-nosotros')}>
              <InfoIcon sx={{ mr: 1 }} /> Sobre Nosotros
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/login')}>
              <PersonIcon sx={{ mr: 1 }} /> Iniciar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar; 