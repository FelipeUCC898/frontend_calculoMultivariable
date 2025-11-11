/**
 * main.tsx
 * Punto de entrada de la aplicación React
 * 
 * Inicializa la aplicación y monta el componente raíz
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App.tsx';
import './index.css';
import { darkTheme } from './styles/theme';
import { AuthProvider } from './context/AuthContext';

// Verificar disponibilidad del backend al iniciar (opcional)
const checkBackend = async () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  try {
    // Intentar hacer una petición simple al endpoint /test del backend
    const response = await fetch(`${API_URL}/test`, { method: 'GET' });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend disponible en:', API_URL);
      console.log('📡 Respuesta:', data);
    } else {
      console.warn('⚠️ Backend respondió con error:', response.status);
    }
  } catch (error) {
    console.warn('⚠️ No se pudo conectar con el backend:', API_URL);
    console.warn('💡 Asegúrate de que el servidor Flask esté corriendo en http://localhost:5000');
    console.warn('💡 Verifica que CORS esté habilitado en el backend');
  }
};

// Ejecutar verificación (no bloquear el renderizado)
checkBackend();

// Renderizar aplicación
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
