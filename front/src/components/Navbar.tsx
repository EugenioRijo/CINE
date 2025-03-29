import React, { useState, useEffect } from 'react'; 
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
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Movie,
  Event,
  Info,
  Person,
  Star
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  mode: 'dark' | 'light';
  onModeChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const shineAnimation = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(to right, #0a192f, #112240)'
    : '#FFFFF0',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0,0,0,0.5)'
    : '0 4px 20px rgba(0,0,0,0.1)',
}));

const Logo = styled('img')({
  height: '40px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  marginLeft: 'auto',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(3, 181, 252, 0.2)'
      : 'rgba(255, 140, 50, 0.2)',
    transform: 'rotate(180deg)',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  margin: theme.spacing(1),
  textTransform: 'uppercase',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const BHMemberButton = styled(Button)(({ theme }) => ({
  color: '#000',
  backgroundColor: '#FFD700',
  margin: theme.spacing(1),
  padding: '6px 16px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  borderRadius: '20px',
  '&:hover': {
    backgroundColor: '#FFC800',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const Navbar: React.FC<NavbarProps> = ({ mode, onModeChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Nuevo estado

  // Verificar autenticación al cargar y en cambios de almacenamiento
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    
    // Escuchar eventos de almacenamiento para sincronizar entre pestañas
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cliente');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

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
          <LogoContainer onClick={handleLogoClick}>
            <Logo
              src="/planeta-cinema-logo.png"
              alt="Planeta Cinema"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = '/placeholder-logo.png';
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: mode === 'dark' ? '#fff' : '#000',
                display: { xs: 'none', sm: 'block' },
                fontWeight: 'bold',
              }}
            >
              Planeta Cinema
            </Typography>
          </LogoContainer>

          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center',
            gap: 1
          }}>
            <NavButton 
              onClick={() => handleNavigation('/cartelera')}
              startIcon={<Movie />}
            >
              Cartelera
            </NavButton>
            <NavButton 
              onClick={() => handleNavigation('/eventos')}
              startIcon={<Event />}
            >
              Eventos
            </NavButton>
            <NavButton 
              onClick={() => handleNavigation('/contact')}
              startIcon={<Info />}
            >
              Contáctanos
            </NavButton>
            {isLoggedIn ? (
              <>
                <NavButton 
                  onClick={handleLogout}
                  startIcon={<Person />}
                >
                  Cerrar Sesión
                </NavButton>
              </>
            ) : (
              <NavButton 
                onClick={() => handleNavigation('/login')}
                startIcon={<Person />}
              >
                Iniciar Sesión
              </NavButton>
            )}

            <BHMemberButton 
              onClick={() => handleNavigation('/bh-member')}
              startIcon={<Star />}
            >
              BH Member
            </BHMemberButton>
            <ThemeToggle onClick={onModeChange} aria-label="toggle theme">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </ThemeToggle>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleNavigation('/cartelera')}>
                <Movie sx={{ mr: 1 }} /> Cartelera
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/eventos')}>
                <Event sx={{ mr: 1 }} /> Eventos
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/contact')}>
                <Info sx={{ mr: 1 }} /> Contáctanos
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/login')}>
                <Person sx={{ mr: 1 }} /> Iniciar Sesión
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/bh-member')}>
                <Star sx={{ mr: 1 }} /> BH Member
              </MenuItem>

              {isLoggedIn ? (
                <MenuItem onClick={handleLogout}>
                  <Person sx={{ mr: 1 }} /> Cerrar Sesión
                </MenuItem>
              ) : (
                <MenuItem onClick={() => handleNavigation('/login')}>
                  <Person sx={{ mr: 1 }} /> Iniciar Sesión
                </MenuItem>
              )}

            </Menu>
          </Box>
        </StyledToolbar>
      </StyledAppBar>
    </>
  );
};

export default Navbar; 