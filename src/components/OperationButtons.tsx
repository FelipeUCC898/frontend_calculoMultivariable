/**
 * OperationButtons.tsx
 * Grid de botones para operaciones matemáticas
 * 
 * Cada botón ejecuta una operación específica del backend
 */

import React from 'react';
import { Box, Typography, Button, Tooltip, CircularProgress } from '@mui/material';
import type { MathOperation } from '../hooks/useApi';
import { vercelColors } from '../styles/colors';

interface OperationButtonsProps {
  onOperation: (operation: MathOperation) => void;
  loading: boolean;
  disabled?: boolean;
}

// Definición de las operaciones con metadata
interface OperationConfig {
  id: MathOperation;
  label: string;
  symbol: string;
  color: string;
  description: string;
}

const operations: OperationConfig[] = [
  {
    id: 'derivative',
    label: 'Derivar',
    symbol: '∂',
    color: vercelColors.blue[500],
    description: 'Calcula la derivada parcial respecto a la variable seleccionada',
  },
  {
    id: 'integral',
    label: 'Integrar',
    symbol: '∫',
    color: vercelColors.accent.cyan,
    description: 'Calcula la integral indefinida respecto a la variable',
  },
  {
    id: 'gradient',
    label: 'Gradiente',
    symbol: '∇',
    color: vercelColors.accent.pink,
    description: 'Calcula el vector gradiente de la función',
  },
  {
    id: 'limit',
    label: 'Límite',
    symbol: 'lim',
    color: vercelColors.blue[300],
    description: 'Calcula el límite de la función',
  },
  {
    id: 'lagrange',
    label: 'Lagrange',
    symbol: 'λ',
    color: vercelColors.accent.purple,
    description: 'Resuelve problemas de optimización con multiplicadores de Lagrange',
  },
  {
    id: 'domain',
    label: 'Dominio/Rango',
    symbol: '𝐷/𝐑',
    color: vercelColors.gray[200],
    description: 'Determina el dominio y rango de la función',
  },
  {
    id: 'critical_points',
    label: 'Puntos Críticos',
    symbol: '★',
    color: vercelColors.accent.yellow,
    description: 'Encuentra y clasifica puntos críticos (máximos, mínimos, puntos de silla)',
  },
  {
    id: 'tangent_plane',
    label: 'Plano Tangente',
    symbol: '□',
    color: vercelColors.accent.orange,
    description: 'Calcula el plano tangente a la superficie en un punto',
  },
  {
    id: 'contour_lines',
    label: 'Curvas de Nivel',
    symbol: '≈',
    color: vercelColors.accent.teal,
    description: 'Genera curvas de nivel (contour lines) de la función',
  },
];

const OperationButtons: React.FC<OperationButtonsProps> = ({
  onOperation,
  loading,
  disabled = false,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Label */}
      <Typography
        variant="body1"
        sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}
      >
        Operaciones
      </Typography>

      {/* Grid de botones */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
        }}
      >
        {operations.map((op) => (
          <Tooltip key={op.id} title={op.description} arrow>
            <span>
              <Button
                onClick={() => onOperation(op.id)}
                disabled={loading || disabled}
                sx={{
                  py: 2,
                  px: 1,
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${op.color}18 0%, rgba(0,0,0,0.3) 100%)`,
                  border: `1px solid ${op.color}40`,
                  color: '#f8fafc',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  '&:hover:not(:disabled)': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 15px 35px ${op.color}40`,
                    background: `linear-gradient(135deg, ${op.color}35 0%, rgba(0,0,0,0.1) 100%)`,
                  },
                  '&:disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at center, ${op.color}35, transparent)`,
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  },
                  '&:hover:not(:disabled)::before': {
                    opacity: 1,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: op.color }} />
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {/* Símbolo matemático */}
                    <Box sx={{ fontSize: '1.5rem', lineHeight: 1 }}>
                      {op.symbol}
                    </Box>
                    {/* Nombre de la operación */}
                    <Box sx={{ fontSize: '0.85rem' }}>
                      {op.label}
                    </Box>
                  </Box>
                )}
              </Button>
            </span>
          </Tooltip>
        ))}
      </Box>

      {/* Hint de uso */}
      {disabled && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: 'warning.main',
            textAlign: 'center',
          }}
        >
          ⚠️ Ingresa una función válida para habilitar las operaciones
        </Typography>
      )}

      {loading && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: 'primary.main',
            textAlign: 'center',
          }}
        >
          ⏳ Procesando operación en el backend...
        </Typography>
      )}
    </Box>
  );
};

export default OperationButtons;
