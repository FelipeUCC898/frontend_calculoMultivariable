/**
 * LoginModal.tsx
 * Modal para inicio de sesión y registro
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Close, PersonAdd, Login as LoginIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import api from '../../services/api';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLoginSuccess }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Formulario de login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  // Formulario de registro
  const [registerForm, setRegisterForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/login', {
        email: loginForm.email,
        password: loginForm.password
      });
      
      const { access_token, user } = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Llamar callback
      onLoginSuccess(access_token, user);
      
      // Cerrar modal
      onClose();
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    
    // Validaciones
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (registerForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/register', {
        nombre: registerForm.nombre,
        email: registerForm.email,
        password: registerForm.password
      });
      
      // Registro exitoso, ahora hacer login automático
      const loginResponse = await api.post('/login', {
        email: registerForm.email,
        password: registerForm.password
      });
      
      const { access_token, user } = loginResponse.data;
      
      // Guardar token
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Llamar callback
      onLoginSuccess(access_token, user);
      
      // Cerrar modal
      onClose();
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al registrarse';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(15,15,15,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {tabValue === 0 ? 'Iniciar Sesión' : 'Registrarse'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Iniciar Sesión" icon={<LoginIcon />} iconPosition="start" />
          <Tab label="Registrarse" icon={<PersonAdd />} iconPosition="start" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Formulario de Login */}
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              fullWidth
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </Box>
        )}

        {/* Formulario de Registro */}
        {tabValue === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre completo"
              value={registerForm.nombre}
              onChange={(e) => setRegisterForm({ ...registerForm, nombre: e.target.value })}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Email"
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              fullWidth
              disabled={loading}
              helperText="Mínimo 6 caracteres"
            />
            <TextField
              label="Confirmar contraseña"
              type="password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              fullWidth
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={tabValue === 0 ? handleLogin : handleRegister}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            minWidth: 120,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            tabValue === 0 ? 'Iniciar Sesión' : 'Registrarse'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;

