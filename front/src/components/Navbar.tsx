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
  keyframes,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#1a1a1a',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  height: '64px',
  zIndex: 1100,
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: '64px',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '16px',
});

const NavButton = styled(Button)({
  color: '#ffffff',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  padding: '8px 16px',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
});

const shineAnimation = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

const BHMemberButton = styled(Button)({
  color: '#000000',
  background: 'linear-gradient(90deg, #FFD700, #FDB931, #FFD700, #FDB931)',
  backgroundSize: '400% auto',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  padding: '8px 24px',
  borderRadius: '50px',
  marginLeft: '8px',
  transition: 'all 0.3s ease',
  animation: `${shineAnimation} 8s linear infinite`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(253, 185, 49, 0.4)',
    animationDuration: '3s',
  },
});

const Logo = styled('img')({
  height: '32px',
  cursor: 'pointer',
});

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  right: '24px',
  top: '80px',
  color: '#fff',
  background: 'rgba(26, 32, 44, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 3px 15px rgba(0, 0, 0, 0.3)',
  '&:hover': {
    background: 'rgba(3, 181, 252, 0.1)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
  zIndex: 1000,
}));

const Navbar: React.FC<NavbarProps> = ({ mode, onModeChange }) => {
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

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center',
            gap: 2
          }}>
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
            <BHMemberButton
              startIcon={<StarIcon />}
              onClick={() => handleNavigation('/bh-member')}
            >
              BH Member
            </BHMemberButton>
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
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
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
              <MenuItem onClick={() => handleNavigation('/bh-member')}>
                <StarIcon sx={{ mr: 1 }} /> BH Member
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/login')}>
                <PersonIcon sx={{ mr: 1 }} /> Iniciar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </StyledToolbar>
      </StyledAppBar>

      <ThemeToggle onClick={onModeChange} aria-label="toggle theme">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </ThemeToggle>
    </>
  );
};

export default Navbar; 