/**
 * VariableSelector.tsx
 * Selector de variables para operaciones matemáticas
 * 
 * Permite seleccionar la variable con respecto a la cual
 * se realizarán operaciones como derivadas e integrales
 */

import React from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface VariableSelectorProps {
  selected: string;
  onChange: (variable: string) => void;
  variables?: string[];
  disabled?: boolean;
}

const VariableSelector: React.FC<VariableSelectorProps> = ({
  selected,
  onChange,
  variables = ['x', 'y', 'z'],
  disabled = false,
}) => {
  const theme = useTheme();

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newVariable: string | null
  ) => {
    if (newVariable !== null) {
      onChange(newVariable);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Label */}
      <Typography
        variant="body1"
        sx={{ fontWeight: 500, color: theme.palette.text.primary, mb: 1 }}
      >
        Variable de operación
      </Typography>

      {/* Selector de botones */}
      <ToggleButtonGroup
        value={selected}
        exclusive
        onChange={handleChange}
        disabled={disabled}
        sx={{
          display: 'flex',
          gap: 1,
          '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            '&:not(:first-of-type)': {
              borderRadius: '8px',
            },
            '&:first-of-type': {
              borderRadius: '8px',
            },
          },
        }}
      >
        {variables.map((variable) => (
          <ToggleButton
            key={variable}
            value={variable}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: '8px',
              background: selected === variable ? theme.palette.primary.main : 'rgba(255,255,255,0.04)',
              border: `2px solid ${selected === variable ? theme.palette.primary.main : 'rgba(255,255,255,0.08)'}`,
              color: selected === variable ? '#000' : theme.palette.text.primary,
              fontWeight: 600,
              fontSize: '1rem',
              fontFamily: "'Fira Code', monospace",
              textTransform: 'none',
              minWidth: '80px',
              transition: 'all 0.2s',
              '&:hover': {
                background: selected === variable ? theme.palette.primary.dark : 'rgba(59,130,246,0.08)',
                border: `2px solid ${theme.palette.primary.main}`,
              },
              '&.Mui-selected': {
                background: theme.palette.primary.main,
                color: '#000',
                '&:hover': {
                  background: theme.palette.primary.dark,
                },
              },
              '&.Mui-disabled': {
                opacity: 0.5,
                color: theme.palette.text.secondary,
              },
            }}
          >
            {variable}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Hint informativo */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 0.5,
          color: theme.palette.text.secondary,
        }}
      >
        Selecciona la variable para derivadas, integrales y límites
      </Typography>
    </Box>
  );
};

export default VariableSelector;
