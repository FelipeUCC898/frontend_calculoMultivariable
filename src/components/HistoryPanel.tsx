/**
 * HistoryPanel.tsx
 * Panel flotante para mostrar el historial de operaciones del usuario
 */

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Close,
  History as HistoryIcon,
  Calculate,
  Timeline,
  Delete
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import api from '../services/api';

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  onSelectOperation?: (operation: any) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ open, onClose, onSelectOperation }) => {
  const theme = useTheme();
  const [operations, setOperations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener historial cuando se abre el panel
  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No has iniciado sesión');
        setLoading(false);
        return;
      }
      
      const response = await api.get('/history', {
        params: {
          limit: 50
        }
      });
      
      setOperations(response.data.operations || []);
      
    } catch (err: any) {
      console.error('Error fetching history:', err);
      const errorMessage = err.response?.data?.error || 'Error al cargar el historial';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getOperationIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      derivative: <Calculate sx={{ color: theme.palette.primary.main }} />,
      gradient: <Timeline sx={{ color: theme.palette.success.main }} />,
      integral: <Calculate sx={{ color: theme.palette.warning.main }} />,
      lagrange: <Calculate sx={{ color: theme.palette.info.main }} />,
      limit: <Calculate sx={{ color: theme.palette.error.main }} />,
    };
    
    return icons[type] || <Calculate />;
  };

  const getOperationLabel = (type: string) => {
    const labels: Record<string, string> = {
      derivative: 'Derivada',
      gradient: 'Gradiente',
      integral: 'Integral',
      lagrange: 'Lagrange',
      limit: 'Límite',
      domain: 'Dominio',
      'critical-points': 'Puntos Críticos',
      'tangent-plane': 'Plano Tangente'
    };
    
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          background: 'rgba(10,10,10,0.98)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ color: theme.palette.primary.main, fontSize: '1.8rem' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Historial
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Tus últimas operaciones
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      {/* Contenido */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && operations.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <HistoryIcon sx={{ fontSize: '4rem', color: 'rgba(255,255,255,0.2)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
              Sin historial
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
              Realiza algunas operaciones para verlas aquí
            </Typography>
          </Box>
        )}

        {!loading && operations.length > 0 && (
          <List sx={{ p: 0 }}>
            {operations.map((operation, index) => (
              <React.Fragment key={operation.id}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 2,
                    borderRadius: '12px',
                    mb: 1,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: onSelectOperation ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: theme.palette.primary.main,
                      transform: onSelectOperation ? 'translateX(-4px)' : 'none'
                    }
                  }}
                  onClick={() => onSelectOperation?.(operation)}
                >
                  {/* Header de la operación */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getOperationIcon(operation.operation_type)}
                      <Chip
                        label={getOperationLabel(operation.operation_type)}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {formatDate(operation.created_at)}
                    </Typography>
                  </Box>

                  {/* Expresión */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      color: theme.palette.primary.main,
                      mb: 0.5,
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {operation.expression}
                  </Typography>

                  {/* Variables */}
                  {operation.variables && (
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Variables: {Array.isArray(operation.variables) ? operation.variables.join(', ') : operation.variables}
                    </Typography>
                  )}
                </ListItem>
                {index < operations.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          {operations.length} operación(es)
        </Typography>
        <Button
          startIcon={<Delete />}
          size="small"
          onClick={fetchHistory}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main
            }
          }}
        >
          Actualizar
        </Button>
      </Box>
    </Drawer>
  );
};

export default HistoryPanel;

