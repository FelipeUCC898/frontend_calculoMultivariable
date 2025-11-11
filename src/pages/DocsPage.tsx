/**
 * DocsPage.tsx
 * Página de documentación y guía de uso
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ExpandMore,
  Functions,
  Timeline,
  AutoGraph,
  Calculate,
  Code,
  Lightbulb,
  Warning
} from '@mui/icons-material';

const DocsPage: React.FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const operations = [
    {
      name: 'Derivada Parcial',
      endpoint: '/api/derivative',
      description: 'Calcula la derivada parcial de una función respecto a una variable',
      example: 'f(x,y) = x² + y² → ∂f/∂x = 2x',
      syntax: 'x**2 + y**2'
    },
    {
      name: 'Integral',
      endpoint: '/api/integral',
      description: 'Calcula la integral definida o indefinida',
      example: '∫ x dx = x²/2 + C',
      syntax: 'x'
    },
    {
      name: 'Gradiente',
      endpoint: '/api/gradient',
      description: 'Calcula el gradiente (vector de derivadas parciales)',
      example: '∇f(x,y) = (∂f/∂x, ∂f/∂y)',
      syntax: 'x**2 + y**2'
    },
    {
      name: 'Puntos Críticos',
      endpoint: '/api/critical-points',
      description: 'Encuentra y clasifica puntos críticos (máximos, mínimos, puntos silla)',
      example: 'f(x,y) = x² - y² → Punto silla en (0,0)',
      syntax: 'x**2 - y**2'
    },
    {
      name: 'Plano Tangente',
      endpoint: '/api/tangent-plane',
      description: 'Calcula el plano tangente a una superficie en un punto',
      example: 'z = f(a,b) + fx·(x-a) + fy·(y-b)',
      syntax: 'x**2 + y**2'
    },
    {
      name: 'Lagrange',
      endpoint: '/api/lagrange',
      description: 'Optimización con restricciones usando multiplicadores de Lagrange',
      example: 'Optimizar f sujeto a g(x,y) = 0',
      syntax: 'Objetivo: x + y, Restricción: x**2 + y**2 - 1'
    }
  ];

  const syntaxRules = [
    { symbol: '**', description: 'Potencia', example: 'x**2 = x²' },
    { symbol: '*', description: 'Multiplicación', example: '2*x = 2x' },
    { symbol: '/', description: 'División', example: 'x/2' },
    { symbol: '+', description: 'Suma', example: 'x + y' },
    { symbol: '-', description: 'Resta', example: 'x - y' },
    { symbol: 'sqrt()', description: 'Raíz cuadrada', example: 'sqrt(x)' },
    { symbol: 'sin()', description: 'Seno', example: 'sin(x)' },
    { symbol: 'cos()', description: 'Coseno', example: 'cos(x)' },
    { symbol: 'tan()', description: 'Tangente', example: 'tan(x)' },
    { symbol: 'exp()', description: 'Exponencial', example: 'exp(x) = eˣ' },
    { symbol: 'log()', description: 'Logaritmo natural', example: 'log(x) = ln(x)' },
  ];

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Documentación
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, maxWidth: '700px', mx: 'auto' }}>
          Aprende a usar la calculadora multivariable, sintaxis de funciones y operaciones disponibles
        </Typography>
      </Box>

      {/* Guía rápida */}
      <Alert
        icon={<Lightbulb />}
        severity="info"
        sx={{
          mb: 4,
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Inicio Rápido
        </Typography>
        <Typography variant="body2">
          1. Ingresa tu función en el campo de entrada (ej: x**2 + y**2)
          <br />
          2. Selecciona la operación que deseas realizar
          <br />
          3. Haz clic en "Generar Malla 3D" para visualizar la superficie
        </Typography>
      </Alert>

      {/* Sintaxis de funciones */}
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
        sx={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          mb: 2,
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Code sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sintaxis de Funciones
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
            Usa la siguiente sintaxis para escribir funciones matemáticas:
          </Typography>
          
          <Grid container spacing={2}>
            {syntaxRules.map((rule, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <CardContent>
                    <Chip
                      label={rule.symbol}
                      size="small"
                      sx={{
                        mb: 1,
                        fontFamily: 'monospace',
                        background: theme.palette.primary.main,
                        color: '#000',
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {rule.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontFamily: 'monospace',
                      }}
                    >
                      {rule.example}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert
            icon={<Warning />}
            severity="warning"
            sx={{ mt: 3, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
          >
            <Typography variant="body2">
              <strong>Nota:</strong> Usa <code>**</code> para potencias, no <code>^</code>. Ejemplo: x² se escribe como{' '}
              <code>x**2</code>
            </Typography>
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* Operaciones disponibles */}
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
        sx={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          mb: 2,
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Functions sx={{ color: theme.palette.success.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Operaciones Disponibles
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {operations.map((op, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Calculate sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {op.name}
                      </Typography>
                      <Chip
                        label={op.endpoint}
                        size="small"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          background: 'rgba(59, 130, 246, 0.2)',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                      {op.description}
                    </Typography>
                    <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.05)' }} />
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Ejemplo:
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: theme.palette.warning.main }}>
                          {op.example}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Sintaxis:
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: theme.palette.success.main }}>
                          {op.syntax}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Visualizaciones */}
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
        sx={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          mb: 2,
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoGraph sx={{ color: theme.palette.warning.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Visualizaciones 3D
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
            La aplicación ofrece múltiples tipos de visualizaciones interactivas:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                    🎨 Superficies 3D
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Visualiza funciones de dos variables como superficies en 3D. Usa el mouse para rotar, zoom y
                    explorar.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.success.main }}>
                    🎯 Puntos Críticos
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Máximos (🔴), mínimos (🟢) y puntos silla (🟣) se marcan automáticamente con esferas coloreadas.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.warning.main }}>
                    ➡️ Vectores Gradiente
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Flechas que muestran la dirección de máximo crecimiento de la función en cada punto.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.info.main }}>
                    📏 Planos Tangentes
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Plano semi-transparente que toca la superficie en un punto específico, útil para aproximaciones
                    lineales.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Ejemplos prácticos */}
      <Accordion
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}
        sx={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline sx={{ color: theme.palette.error.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Ejemplos Prácticos
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Ejemplo 1: Paraboloide
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                    Función: <code style={{ color: theme.palette.primary.main }}>x**2 + y**2</code>
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Operación: Puntos Críticos → Encontrará un mínimo en (0, 0)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Ejemplo 2: Silla de Montar
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                    Función: <code style={{ color: theme.palette.primary.main }}>x**2 - y**2</code>
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Operación: Puntos Críticos → Encontrará un punto silla en (0, 0)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Ejemplo 3: Optimización
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                    Objetivo: <code style={{ color: theme.palette.primary.main }}>x + y</code>
                    <br />
                    Restricción: <code style={{ color: theme.palette.warning.main }}>x**2 + y**2 - 1</code>
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Operación: Lagrange → Optimiza la suma sobre un círculo unitario
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default DocsPage;

