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
import DiamondIcon from '@mui/icons-material/Diamond';
import { useNavigate } from 'react-router-dom';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #FFD700; }
  50% { box-shadow: 0 0 20px #FFD700, 0 0 30px #FFA500; }
  100% { box-shadow: 0 0 5px #FFD700; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

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
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(3, 181, 252, 0.1)'
      : 'rgba(255, 140, 50, 0.1)',
  },
}));

const BHMemberButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
  color: '#000000',
  marginLeft: theme.spacing(2),
  padding: '8px 16px',
  borderRadius: '20px',
  fontWeight: 700,
  textTransform: 'none',
  border: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
    transform: 'none',
    boxShadow: 'none',
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

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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
            startIcon={<DiamondIcon sx={{ color: '#000000' }} />}
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
            <MenuItem onClick={() => handleNavigation('/bh-member')}>
              <DiamondIcon sx={{ mr: 1, color: '#FFD700' }} /> BH Member
            </MenuItem>
          </Menu>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar; 