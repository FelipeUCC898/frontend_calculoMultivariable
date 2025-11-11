/**
 * LagrangeInput.tsx
 * Componente para entrada de función objetivo y restricción para Lagrange
 *
 * Permite ingresar dos funciones matemáticas:
 * - Función objetivo a optimizar
 * - Función de restricción (g(x,y,...) = 0)
 */

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Alert,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { Info, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface LagrangeInputProps {
  objectiveFunction: string;
  constraintFunction: string;
  constraintValue: string;
  onObjectiveChange: (value: string) => void;
  onConstraintChange: (value: string) => void;
  onConstraintValueChange: (value: string) => void;
  onObjectiveValidate?: (isValid: boolean) => void;
  onConstraintValidate?: (isValid: boolean) => void;
}

/**
 * Validación básica de sintaxis matemática
 */
const validateMathExpression = (expression: string): { isValid: boolean; message?: string } => {
  if (!expression.trim()) {
    return { isValid: false, message: 'Campo requerido' };
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

const LagrangeInput: React.FC<LagrangeInputProps> = ({
  objectiveFunction,
  constraintFunction,
  constraintValue,
  onObjectiveChange,
  onConstraintChange,
  onConstraintValueChange,
  onObjectiveValidate,
  onConstraintValidate
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const theme = useTheme();

  // Validaciones
  const objectiveValidation = validateMathExpression(objectiveFunction);
  const constraintValidation = validateMathExpression(constraintFunction);

  // Notificar cambios de validación
  React.useEffect(() => {
    if (onObjectiveValidate) {
      onObjectiveValidate(objectiveValidation.isValid);
    }
  }, [objectiveValidation.isValid, onObjectiveValidate]);

  React.useEffect(() => {
    if (onConstraintValidate) {
      onConstraintValidate(constraintValidation.isValid);
    }
  }, [constraintValidation.isValid, onConstraintValidate]);

  /**
   * Inserta una función en el campo especificado
   */
  const insertFunction = (func: string, target: 'objective' | 'constraint') => {
    const newValue = (target === 'objective' ? objectiveFunction : constraintFunction) + func + '()';
    if (target === 'objective') {
      onObjectiveChange(newValue);
    } else {
      onConstraintChange(newValue);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header con icono de ayuda */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 500, color: theme.palette.text.primary }}
        >
          Optimización con Lagrange
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
      </Box>

      {/* Función objetivo */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: theme.palette.warning.main }}
          >
            Función objetivo (f(x,y,...))
          </Typography>
          {objectiveFunction && (
            objectiveValidation.isValid ? (
              <CheckCircle sx={{ color: theme.palette.success.main, fontSize: '1.1rem' }} />
            ) : (
              <ErrorIcon sx={{ color: theme.palette.error.main, fontSize: '1.1rem' }} />
            )
          )}
        </Box>
        <TextField
          fullWidth
          value={objectiveFunction}
          onChange={(e) => onObjectiveChange(e.target.value)}
          placeholder="Ej: x**2 + y**2"
          error={!objectiveValidation.isValid}
          helperText={!objectiveValidation.isValid ? objectiveValidation.message : ''}
          InputProps={{
            sx: {
              fontFamily: "'Fira Code', 'Courier New', monospace",
              fontSize: '1rem',
              backgroundColor: 'rgba(15,15,15,0.85)',
            }
          }}
        />
      </Box>

      {/* Función de restricción */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: theme.palette.warning.main }}
          >
            Función de restricción (g(x,y,...))
          </Typography>
          {constraintFunction && (
            constraintValidation.isValid ? (
              <CheckCircle sx={{ color: theme.palette.success.main, fontSize: '1.1rem' }} />
            ) : (
              <ErrorIcon sx={{ color: theme.palette.error.main, fontSize: '1.1rem' }} />
            )
          )}
        </Box>
        <TextField
          fullWidth
          value={constraintFunction}
          onChange={(e) => onConstraintChange(e.target.value)}
          placeholder="Ej: x**2 + y**2"
          error={!constraintValidation.isValid}
          helperText={!constraintValidation.isValid ? constraintValidation.message : ''}
          InputProps={{
            sx: {
              fontFamily: "'Fira Code', 'Courier New', monospace",
              fontSize: '1rem',
              backgroundColor: 'rgba(15,15,15,0.85)',
            }
          }}
        />
      </Box>

      {/* Valor de la restricción */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: theme.palette.warning.main }}
          >
            Valor de la restricción (=)
          </Typography>
        </Box>
        <TextField
          fullWidth
          value={constraintValue}
          onChange={(e) => onConstraintValueChange(e.target.value)}
          placeholder="Ej: 1"
          InputProps={{
            sx: {
              fontFamily: "'Fira Code', 'Courier New', monospace",
              fontSize: '1rem',
              backgroundColor: 'rgba(15,15,15,0.85)',
            }
          }}
        />
      </Box>

      {/* Chips con funciones comunes */}
      <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mr: 1, alignSelf: 'center' }}>
          Funciones:
        </Typography>
        {MATH_FUNCTIONS.map((func) => (
          <Chip
            key={func}
            label={func}
            size="small"
            onClick={() => insertFunction(func, 'objective')}
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

      {/* Panel de ayuda */}
      {showHelp && (
        <Alert
          severity="info"
          sx={{ mt: 2 }}
          onClose={() => setShowHelp(false)}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Sintaxis para Lagrange:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <li><strong>Función objetivo:</strong> La función a optimizar (minimizar/maximizar)</li>
            <li><strong>Función de restricción:</strong> g(x,y,...) = valor (restricción de igualdad)</li>
            <li>Variables: x, y, z, etc.</li>
            <li>Operadores: +, -, *, /, ** (potencia)</li>
            <li>Funciones: sin, cos, tan, exp, log, sqrt, abs</li>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: theme.palette.text.secondary }}>
            Ejemplo: Objetivo: x + y, Restricción: x**2 + y**2, Valor: 1
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

export default LagrangeInput;
