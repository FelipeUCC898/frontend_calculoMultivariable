/**
 * theme.ts
 * Configuración del tema personalizado para Material-UI
 * 
 * Define la paleta de colores oscura y estilos globales
 * para mantener consistencia visual en toda la aplicación
 */

import { createTheme } from '@mui/material/styles';
import { vercelColors } from './colors';

const surfaceBackground =
  'linear-gradient(135deg, rgba(23,23,23,0.95) 0%, rgba(12,12,12,0.9) 100%)';
const surfaceBorder = 'rgba(255,255,255,0.08)';
const glassHover = 'rgba(59,130,246,0.25)';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: vercelColors.blue[500],
      light: vercelColors.blue[300],
      dark: vercelColors.blue[700],
      contrastText: vercelColors.black,
    },
    secondary: {
      main: vercelColors.accent.cyan,
      light: '#4fd8ef',
      dark: '#05869a',
      contrastText: vercelColors.black,
    },
    error: {
      main: vercelColors.accent.pink,
    },
    warning: {
      main: vercelColors.accent.lime,
    },
    info: {
      main: vercelColors.blue[400],
    },
    success: {
      main: '#22c55e',
    },
    background: {
      default: vercelColors.black,
      paper: 'rgba(15,15,15,0.92)',
    },
    text: {
      primary: vercelColors.gray[50],
      secondary: vercelColors.gray[400],
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: [
      'Inter',
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          padding: '10px 24px',
          backdropFilter: 'blur(6px)',
          border: `1px solid ${surfaceBorder}`,
          backgroundImage: surfaceBackground,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
            backgroundColor: glassHover,
            borderColor: glassHover,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(23,23,23,0.85)',
            '& fieldset': {
              borderColor: surfaceBorder,
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: vercelColors.blue[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: vercelColors.blue[500],
              boxShadow: '0 0 0 3px rgba(59,130,246,0.25)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: surfaceBackground,
          border: `1px solid ${surfaceBorder}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: surfaceBackground,
          border: `1px solid ${surfaceBorder}`,
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: vercelColors.gray[800],
          color: vercelColors.gray[50],
          fontSize: '0.8rem',
        },
      },
    },
  },
});
