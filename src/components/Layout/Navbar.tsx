/**
 * Navbar.tsx
 * Barra de navegación superior
 * 
 * Características:
 * - Logo y título de la aplicación
 * - Enlaces de navegación
 * - Botón de reinicio
 * - (Futuro) Botón de autenticación
 */

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  Functions, 
  Home, 
  Description, 
  Info,
  Refresh,
  Login,
  Logout,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onReset?: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
  onLoginClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onReset, onNavigate, currentPage = 'home', onLoginClick }) => {
  const theme = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'rgba(0,0,0,0.7)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0 }}>
          {/* Logo y título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {/* Logo con gradiente */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(6,182,212,0.35)',
              }}
            >
              <Functions sx={{ color: '#000', fontSize: '1.5rem' }} />
            </Box>

            {/* Texto del título */}
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  letterSpacing: '-0.5px'
                }}
              >
                Cálculo Multivariado
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem'
                }}
              >
                Análisis Simbólico y Optimización
              </Typography>
            </Box>
          </Box>

          {/* Enlaces de navegación */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              startIcon={<Home />}
              onClick={() => onNavigate?.('home')}
              sx={{
                color: currentPage === 'home' ? theme.palette.primary.main : theme.palette.text.secondary,
                textTransform: 'none',
                backgroundColor: currentPage === 'home' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                },
              }}
            >
              Inicio
            </Button>
            
            <Button
              startIcon={<Description />}
              onClick={() => onNavigate?.('docs')}
              sx={{
                color: currentPage === 'docs' ? theme.palette.primary.main : theme.palette.text.secondary,
                textTransform: 'none',
                backgroundColor: currentPage === 'docs' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                },
              }}
            >
              Docs
            </Button>
            
            <Button
              startIcon={<Info />}
              onClick={() => onNavigate?.('about')}
              sx={{
                color: currentPage === 'about' ? theme.palette.primary.main : theme.palette.text.secondary,
                textTransform: 'none',
                backgroundColor: currentPage === 'about' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                },
              }}
            >
              Sobre el proyecto
            </Button>
          </Box>

          {/* Botón de reinicio */}
          {onReset && (
            <Tooltip title="Reiniciar aplicación">
              <IconButton
                onClick={onReset}
                sx={{
                  ml: 2,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  },
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          )}

          {/* Autenticación */}
          {isLoggedIn ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  ml: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                    color: '#000',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                >
                  {user?.nombre?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    background: 'rgba(20,20,20,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    mt: 1
                  }
                }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user?.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem onClick={handleLogout}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              startIcon={<Login />}
              onClick={onLoginClick}
              variant="outlined"
              sx={{
                ml: 2,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                textTransform: 'none',
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              Iniciar sesión
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
