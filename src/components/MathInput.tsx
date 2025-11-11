/**
 * MathInput.tsx
 * Componente para entrada de expresiones matemáticas
 * 
 * Características:
 * - Input con sintaxis matemática
 * - Validación básica
 * - Sugerencias de sintaxis
 * - Autocompletado básico (opcional)
 */

import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Chip,
  Alert,
  IconButton,
  Tooltip 
} from '@mui/material';
import { Info, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (isValid: boolean) => void;
  label?: string;
  placeholder?: string;
}

/**
 * Validación básica de sintaxis matemática
 * Verifica paréntesis balanceados y caracteres permitidos
 */
const validateMathExpression = (expression: string): { isValid: boolean; message?: string } => {
  if (!expression.trim()) {
    return { isValid: true }; // Vacío es válido
  }

  // Verificar paréntesis balanceados
  let parenthesisCount = 0;
  for (const char of expression) {
    if (char === '(') parenthesisCount++;
    if (char === ')') parenthesisCount--;
    if (parenthesisCount < 0) {
      return { isValid: false, message: 'Paréntesis desbalanceados' };
    }
  }

  if (parenthesisCount !== 0) {
    return { isValid: false, message: 'Paréntesis desbalanceados' };
  }

  // Verificar caracteres no permitidos (básico)
  const allowedPattern = /^[a-zA-Z0-9\s+\-*/().,^_\[\]{}|=<>!&|]+$/;
  if (!allowedPattern.test(expression)) {
    return { isValid: false, message: 'Contiene caracteres no permitidos' };
  }

  // Verificar operadores consecutivos
  if (/[+\-*/]{2,}/.test(expression.replace(/\*\*/g, ''))) {
    return { isValid: false, message: 'Operadores consecutivos no válidos' };
  }

  return { isValid: true };
};

/**
 * Sugerencias de funciones matemáticas comunes
 */
const MATH_FUNCTIONS = [
  'sin', 'cos', 'tan',
  'exp', 'log', 'ln',
  'sqrt', 'abs',
  'sinh', 'cosh', 'tanh'
];

const MathInput: React.FC<MathInputProps> = ({ 
  value, 
  onChange, 
  onValidate,
  label = 'Función matemática',
  placeholder = 'Ej: x**2 + y**2 + sin(x*y)'
}) => {
  const [focused, setFocused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const theme = useTheme();

  // Validar en tiempo real
  const validation = validateMathExpression(value);
  
  // Notificar cambios de validación al padre
  React.useEffect(() => {
    if (onValidate) {
      onValidate(validation.isValid);
    }
  }, [validation.isValid, onValidate]);

  /**
   * Inserta una función en la posición del cursor
   */
  const insertFunction = (func: string) => {
    const newValue = value + func + '()';
    onChange(newValue);
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header con label e icono de ayuda */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
        <Typography 
          variant="body1" 
          sx={{ fontWeight: 500, color: theme.palette.text.primary }}
        >
          {label}
        </Typography>
        <Tooltip title="Ver ayuda de sintaxis">
          <IconButton 
            size="small" 
            onClick={() => setShowHelp(!showHelp)}
            sx={{ color: theme.palette.text.secondary }}
          >
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>
        
        {/* Indicador de validación */}
        {value && (
          validation.isValid ? (
            <CheckCircle sx={{ color: theme.palette.success.main, fontSize: '1.2rem' }} />
          ) : (
            <ErrorIcon sx={{ color: theme.palette.error.main, fontSize: '1.2rem' }} />
          )
        )}
      </Box>

      {/* Campo de entrada */}
      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        error={!validation.isValid && value !== ''}
        helperText={!validation.isValid ? validation.message : ''}
        InputProps={{
          sx: {
            fontFamily: "'Fira Code', 'Courier New', monospace",
            fontSize: '1rem',
            backgroundColor: 'rgba(15,15,15,0.85)',
          }
        }}
      />

      {/* Chips con funciones comunes */}
      {focused && (
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mr: 1, alignSelf: 'center' }}>
            Funciones:
          </Typography>
          {MATH_FUNCTIONS.map((func) => (
            <Chip
              key={func}
              label={func}
              size="small"
              onClick={() => insertFunction(func)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: theme.palette.primary.main,
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: '#000',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Panel de ayuda */}
      {showHelp && (
        <Alert 
          severity="info" 
          sx={{ mt: 2 }}
          onClose={() => setShowHelp(false)}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Sintaxis soportada:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <li>Variables: x, y, z</li>
            <li>Operadores: +, -, *, /, ** (potencia)</li>
            <li>Funciones: sin, cos, tan, exp, log, sqrt, abs</li>
            <li>Constantes: pi, e (usar como texto)</li>
            <li>Paréntesis para agrupar: (x + y) * z</li>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: theme.palette.text.secondary }}>
            Ejemplo: x**2 + sin(y) - exp(x*y)
          </Typography>
        </Alert>
      )}

      {/* Hints adicionales */}
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          mt: 0.5, 
          color: theme.palette.text.secondary 
        }}
      >
        Usa ** para potencias (ej: x**2), y * para multiplicación explícita (ej: 2*x)
      </Typography>
    </Box>
  );
};

export default MathInput;
