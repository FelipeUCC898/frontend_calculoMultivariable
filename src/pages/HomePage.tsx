/**
 * HomePage.tsx
 * Página de inicio con información general de la aplicación
 */

import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Calculate,
  Timeline,
  AutoGraph,
  Science,
  School,
  Speed,
  Security,
  ArrowForward
} from '@mui/icons-material';

interface HomePageProps {
  onNavigate?: (page: string) => void;
  onStartCalculating?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onStartCalculating }) => {
  const theme = useTheme();

  const features = [
    {
      icon: <Calculate />,
      title: 'Cálculo Simbólico',
      description: 'Derivadas, integrales, límites y más con SymPy',
      color: '#3b82f6'
    },
    {
      icon: <Timeline />,
      title: 'Gradientes y Campos',
      description: 'Visualiza campos vectoriales y direcciones de crecimiento',
      color: '#06b6d4'
    },
    {
      icon: <AutoGraph />,
      title: 'Optimización',
      description: 'Multiplicadores de Lagrange y puntos críticos',
      color: '#8b5cf6'
    },
    {
      icon: <Science />,
      title: 'Visualización 3D',
      description: 'Superficies, curvas de nivel y planos tangentes',
      color: '#10b981'
    }
  ];

  const stats = [
    { label: 'Operaciones', value: '10+', icon: <Calculate /> },
    { label: 'Funciones SymPy', value: '50+', icon: <Science /> },
    { label: 'Visualizaciones', value: '7', icon: <AutoGraph /> },
    { label: 'API Endpoints', value: '10', icon: <Speed /> }
  ];

  return (
    <Box sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 8,
          px: 2
        }}
      >
        <Chip
          label="v2.0 - Con visualizaciones avanzadas"
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: '#000',
            fontWeight: 600
          }}
        />
        
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}
        >
          Calculadora Multivariable
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.secondary,
            mb: 4,
            maxWidth: '800px',
            mx: 'auto',
            fontWeight: 400
          }}
        >
          Herramienta profesional para análisis matemático, cálculo simbólico y
          visualización de funciones multivariables
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={onStartCalculating}
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                boxShadow: '0 15px 50px rgba(59, 130, 246, 0.5)',
              }
            }}
          >
            Comenzar a Calcular
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => onNavigate?.('docs')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
              }
            }}
          >
            Ver Documentación
          </Button>
        </Box>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 10px 30px ${theme.palette.primary.main}30`
                }
              }}
            >
              <CardContent>
                <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Características principales */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            textAlign: 'center'
          }}
        >
          Características Principales
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            mb: 4
          }}
        >
          Todo lo que necesitas para análisis matemático avanzado
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: feature.color,
                    boxShadow: `0 15px 40px ${feature.color}40`
                  }
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      boxShadow: `0 10px 30px ${feature.color}50`
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      sx: { fontSize: '2rem', color: '#000' }
                    })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Beneficios */}
      <Box
        sx={{
          p: 4,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          border: '1px solid rgba(255,255,255,0.08)',
          mb: 6
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              ¿Por qué usar esta herramienta?
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1">
                  <strong>Precisión matemática</strong> - Cálculos exactos con SymPy
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1">
                  <strong>Visualización inmediata</strong> - Ve tus funciones en 3D
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1">
                  <strong>Educativo</strong> - Aprende viendo los pasos del cálculo
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body1">
                  <strong>Gratuito y open source</strong> - Para estudiantes y educadores
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <School sx={{ fontSize: '2.5rem', color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Para Estudiantes
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Herramienta perfecta para aprender cálculo multivariable
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Security sx={{ fontSize: '2.5rem', color: theme.palette.success.main }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Seguro y Confiable
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Validación de entrada y cálculos verificados
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Speed sx={{ fontSize: '2.5rem', color: theme.palette.warning.main }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Rápido y Eficiente
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Resultados en segundos, optimizado para rendimiento
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action final */}
      <Box
        sx={{
          textAlign: 'center',
          p: 6,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          ¿Listo para comenzar?
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
          Explora el poder del cálculo multivariable con visualizaciones interactivas
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onStartCalculating}
          endIcon={<ArrowForward />}
          sx={{
            px: 5,
            py: 1.5,
            fontSize: '1.2rem',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb, #0891b2)',
              boxShadow: '0 15px 50px rgba(59, 130, 246, 0.5)',
            }
          }}
        >
          Ir a la Calculadora
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;

