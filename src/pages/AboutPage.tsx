/**
 * AboutPage.tsx
 * Página "Sobre el proyecto" con información del desarrollo
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  School,
  Code,
  Architecture,
  Security,
  Speed,
  Extension,
  GitHub,
  CheckCircle,
  Science,
  ExpandMore,
  Functions,
  TrendingUp,
  Timeline,
  AccountTree
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const [expandedTheory, setExpandedTheory] = useState<string | false>('theory1');

  const technologies = {
    frontend: [
      { name: 'React 18', description: 'Library UI con hooks modernos', icon: '⚛️' },
      { name: 'TypeScript', description: 'Tipado estático para JavaScript', icon: '📘' },
      { name: 'Material-UI v5', description: 'Sistema de diseño completo', icon: '🎨' },
      { name: 'Three.js', description: 'Visualización 3D con WebGL', icon: '🎲' },
      { name: 'Vite', description: 'Build tool ultra rápido', icon: '⚡' },
    ],
    backend: [
      { name: 'Flask', description: 'Framework web minimalista', icon: '🐍' },
      { name: 'SymPy', description: 'Matemática simbólica en Python', icon: '🔢' },
      { name: 'PostgreSQL', description: 'Base de datos relacional', icon: '🐘' },
      { name: 'SQLAlchemy', description: 'ORM para Python', icon: '🗄️' },
      { name: 'Pydantic', description: 'Validación de datos', icon: '✅' },
    ],
  };

  const features = [
    {
      title: 'Arquitectura Moderna',
      description: 'Backend API REST + Frontend SPA con separación clara de responsabilidades',
      icon: <Architecture />,
      color: '#3b82f6',
    },
    {
      title: 'Seguridad Prioritaria',
      description: 'Validación de entrada con safe_parser, rate limiting y protección contra inyecciones',
      icon: <Security />,
      color: '#10b981',
    },
    {
      title: 'Rendimiento Optimizado',
      description: 'Lazy loading, code splitting y caching para experiencia fluida',
      icon: <Speed />,
      color: '#f59e0b',
    },
    {
      title: 'Extensible y Modular',
      description: 'Fácil agregar nuevas operaciones matemáticas siguiendo patrones establecidos',
      icon: <Extension />,
      color: '#8b5cf6',
    },
  ];

  const goals = [
    'Facilitar el aprendizaje del cálculo multivariable',
    'Proporcionar visualizaciones intuitivas de conceptos abstractos',
    'Ofrecer precisión matemática con SymPy',
    'Crear una herramienta accesible para estudiantes',
    'Demostrar buenas prácticas de ingeniería de software',
  ];

  const achievements = [
    { text: '10+ operaciones matemáticas implementadas', icon: '🎯' },
    { text: '7 tipos de visualizaciones 3D', icon: '🎨' },
    { text: 'API REST completamente documentada', icon: '📚' },
    { text: 'Frontend responsive y accesible', icon: '📱' },
    { text: 'Más de 2,500 líneas de código', icon: '💻' },
    { text: 'Tests automatizados y validación', icon: '✅' },
  ];

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Chip
          icon={<School />}
          label="Proyecto Académico"
          sx={{
            mb: 2,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: '#000',
            fontWeight: 600,
          }}
        />
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
          Sobre el Proyecto
        </Typography>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, maxWidth: '800px', mx: 'auto' }}>
          Calculadora de Cálculo Multivariable con Visualización Avanzada
        </Typography>
      </Box>

      {/* Descripción del proyecto */}
      <Card
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Science sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                ¿Qué es este proyecto?
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Una herramienta educativa para el aprendizaje visual de matemáticas avanzadas
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Este proyecto es una aplicación web full-stack diseñada para facilitar el aprendizaje y la comprensión del
            cálculo multivariable. Combina la potencia computacional de Python con SymPy para cálculos matemáticos
            exactos, y una interfaz moderna en React con visualizaciones 3D interactivas usando Three.js.
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Desarrollado como proyecto de <strong>Ingeniería de Software</strong>, demuestra la aplicación de patrones
            de diseño, arquitecturas modernas, y mejores prácticas en el desarrollo de software educativo.
          </Typography>
        </CardContent>
      </Card>

      {/* Objetivos */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Objetivos del Proyecto
        </Typography>
        <Card
          sx={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <CardContent>
            <List>
              {goals.map((goal, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: theme.palette.success.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={goal}
                    primaryTypographyProps={{
                      variant: 'body1',
                      color: theme.palette.text.primary,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Características técnicas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Características Técnicas
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: feature.color,
                    boxShadow: `0 10px 30px ${feature.color}40`,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: feature.color,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {React.cloneElement(feature.icon, { sx: { fontSize: '2rem', color: '#000' } })}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stack tecnológico */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Stack Tecnológico
        </Typography>
        <Grid container spacing={3}>
          {/* Frontend */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Code sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Frontend
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {technologies.frontend.map((tech, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontSize: '1.5rem' }}>{tech.icon}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {tech.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 4 }}>
                        {tech.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Backend */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Architecture sx={{ color: theme.palette.success.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Backend
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {technologies.backend.map((tech, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontSize: '1.5rem' }}>{tech.icon}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {tech.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 4 }}>
                        {tech.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Fundamentos Teóricos - SECCIÓN NUEVA */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Fundamentos Teóricos
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
          Base matemática del cálculo multivariable implementada en el proyecto
        </Typography>

        <Alert 
          severity="info" 
          icon={<Functions />}
          sx={{ mb: 3, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}
        >
          <Typography variant="body2">
            Estos conceptos son fundamentales para entender el análisis de funciones de múltiples variables 
            y están completamente implementados en la aplicación.
          </Typography>
        </Alert>

        {/* Derivadas Parciales */}
        <Accordion
          expanded={expandedTheory === 'theory1'}
          onChange={() => setExpandedTheory(expandedTheory === 'theory1' ? false : 'theory1')}
          sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Functions sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>1. Derivadas Parciales</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Definición
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Una derivada parcial mide la tasa de cambio de una función con respecto a una de sus variables, 
              manteniendo las demás constantes. Para una función f(x, y), las derivadas parciales se definen como:
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: theme.palette.primary.main }}>
                ∂f/∂x = lim(h→0) [f(x+h, y) - f(x, y)] / h
              </Typography>
              <Typography sx={{ color: theme.palette.primary.main, mt: 1 }}>
                ∂f/∂y = lim(h→0) [f(x, y+h) - f(x, y)] / h
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Aplicaciones en el proyecto:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.success.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Cálculo de tasas de cambio direccionales" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.success.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Análisis de sensibilidad de funciones multivariables" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.success.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Base para el cálculo del gradiente" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Gradiente */}
        <Accordion
          expanded={expandedTheory === 'theory2'}
          onChange={() => setExpandedTheory(expandedTheory === 'theory2' ? false : 'theory2')}
          sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ color: theme.palette.success.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>2. Gradiente</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Definición
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              El gradiente de una función escalar es un vector que contiene todas sus derivadas parciales. 
              Apunta en la dirección de máximo crecimiento de la función.
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: theme.palette.success.main }}>
                ∇f(x, y) = (∂f/∂x, ∂f/∂y)
              </Typography>
              <Typography sx={{ color: theme.palette.success.main, mt: 1 }}>
                Para n variables: ∇f = (∂f/∂x₁, ∂f/∂x₂, ..., ∂f/∂xₙ)
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Propiedades importantes:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.success.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText 
                  primary="Dirección de máximo crecimiento" 
                  secondary="El vector gradiente señala hacia donde la función crece más rápidamente" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.success.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText 
                  primary="Magnitud = tasa de cambio" 
                  secondary="||∇f|| indica qué tan rápido crece la función en esa dirección" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.success.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText 
                  primary="Perpendicular a curvas de nivel" 
                  secondary="El gradiente es siempre perpendicular a las curvas/superficies de nivel" 
                />
              </ListItem>
            </List>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>
              Visualización en el proyecto:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Nuestra aplicación renderiza vectores gradiente como flechas 3D sobre la superficie, 
              con colores que indican la magnitud (intensidad del crecimiento).
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Integrales */}
        <Accordion
          expanded={expandedTheory === 'theory3'}
          onChange={() => setExpandedTheory(expandedTheory === 'theory3' ? false : 'theory3')}
          sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timeline sx={{ color: theme.palette.warning.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>3. Integrales Múltiples</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Definición
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Las integrales múltiples extienden el concepto de integral definida a funciones de varias variables. 
              Permiten calcular volúmenes, áreas, masas y otros conceptos en espacios multidimensionales.
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: theme.palette.warning.main }}>
                Integral doble: ∫∫ₐ f(x,y) dA
              </Typography>
              <Typography sx={{ color: theme.palette.warning.main, mt: 1 }}>
                Integral triple: ∫∫∫ᵥ f(x,y,z) dV
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Tipos de integrales implementadas:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Integrales Indefinidas
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Sin límites específicos: ∫ f(x) dx
                      <br />Resultado: Función + constante C
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Integrales Definidas
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Con límites: ∫ₐᵇ f(x) dx
                      <br />Resultado: Valor numérico (área/volumen)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>
              Aplicaciones:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              • Cálculo de áreas bajo curvas y superficies<br />
              • Volúmenes de sólidos de revolución<br />
              • Cálculo de centroides y momentos de inercia<br />
              • Distribuciones de probabilidad multivariables
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Puntos Críticos */}
        <Accordion
          expanded={expandedTheory === 'theory4'}
          onChange={() => setExpandedTheory(expandedTheory === 'theory4' ? false : 'theory4')}
          sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountTree sx={{ color: theme.palette.error.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>4. Puntos Críticos y Matriz Hessiana</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Puntos Críticos
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Un punto crítico de f(x, y) ocurre donde el gradiente es cero: ∇f = 0. 
              Estos puntos pueden ser máximos, mínimos o puntos silla.
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: theme.palette.error.main }}>
                Condición: ∂f/∂x = 0 y ∂f/∂y = 0
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Matriz Hessiana
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              La matriz Hessiana contiene todas las segundas derivadas parciales de una función:
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <Typography sx={{ color: theme.palette.error.main }}>
                H = [∂²f/∂x²    ∂²f/∂x∂y]
              </Typography>
              <Typography sx={{ color: theme.palette.error.main }}>
                    [∂²f/∂y∂x   ∂²f/∂y² ]
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Criterio de la Segunda Derivada:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card sx={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.success.main }}>
                      🟢 Mínimo Local
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      Det(H) {'>'} 0 y ∂²f/∂x² {'>'} 0
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.error.main }}>
                      🔴 Máximo Local
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      Det(H) {'>'} 0 y ∂²f/∂x² {'<'} 0
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#8b5cf6' }}>
                      🟣 Punto Silla
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      Det(H) {'<'} 0
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>
              Implementación en el proyecto:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              La aplicación calcula automáticamente la matriz Hessiana, evalúa su determinante y clasifica 
              los puntos críticos, visualizándolos con esferas coloreadas en la superficie 3D.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Multiplicadores de Lagrange */}
        <Accordion
          expanded={expandedTheory === 'theory5'}
          onChange={() => setExpandedTheory(expandedTheory === 'theory5' ? false : 'theory5')}
          sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Extension sx={{ color: theme.palette.info.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>5. Multiplicadores de Lagrange</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Optimización con Restricciones
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              El método de los multiplicadores de Lagrange permite encontrar los extremos de una función 
              sujeta a restricciones de igualdad.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Problema de optimización:
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(6, 182, 212, 0.1)', borderRadius: 2, mb: 2 }}>
              <Typography variant="body2" sx={{ color: theme.palette.info.main, mb: 1 }}>
                Optimizar: f(x, y)
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.info.main }}>
                Sujeto a: g(x, y) = c
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Función Lagrangiana:
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(6, 182, 212, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: theme.palette.info.main }}>
                ℒ(x, y, λ) = f(x, y) - λ[g(x, y) - c]
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Condiciones de optimalidad:
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(6, 182, 212, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <Typography sx={{ color: theme.palette.info.main }}>∂ℒ/∂x = 0</Typography>
              <Typography sx={{ color: theme.palette.info.main }}>∂ℒ/∂y = 0</Typography>
              <Typography sx={{ color: theme.palette.info.main }}>∂ℒ/∂λ = 0 (equivalente a g(x,y) = c)</Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Interpretación geométrica:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              En el punto óptimo, el gradiente de la función objetivo (∇f) es paralelo al gradiente 
              de la restricción (∇g), es decir: <strong>∇f = λ∇g</strong>
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Aplicaciones prácticas:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.info.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Optimización de recursos con presupuesto limitado" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.info.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Maximización de utilidad sujeta a restricciones" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.info.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Diseño de formas geométricas óptimas" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Límites */}
        <Accordion
          expanded={expandedTheory === 'theory6'}
          onChange={() => setExpandedTheory(expandedTheory === 'theory6' ? false : 'theory6')}
          sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ color: theme.palette.secondary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>6. Límites Multivariables</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Definición
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Un límite multivariable describe el comportamiento de una función cuando las variables 
              se aproximan a un punto específico, independientemente del camino seguido.
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(139, 92, 246, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: '#8b5cf6' }}>
                lim(x,y)→(a,b) f(x, y) = L
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Diferencia clave con límites unidimensionales:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              En funciones multivariables, existen <strong>infinitos caminos</strong> para aproximarse a un punto. 
              Para que el límite exista, debe ser el mismo independientemente del camino.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Casos especiales:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Límites Laterales
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                      lim(x→a⁺) - Aproximación por la derecha
                      <br />lim(x→a⁻) - Aproximación por la izquierda
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Límites al Infinito
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                      lim(x→∞) f(x) - Comportamiento asintótico
                      <br />Útil para análisis de tendencias
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>
              Técnicas de evaluación:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: '#8b5cf6', fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Sustitución directa (si es continua)" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: '#8b5cf6', fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Coordenadas polares (para límites en el origen)" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: '#8b5cf6', fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Teorema del sandwich" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: '#8b5cf6', fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Regla de L'Hôpital (para formas indeterminadas)" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Planos Tangentes y Aproximación Lineal */}
        <Accordion
          expanded={expandedTheory === 'theory8'}
          onChange={() => setExpandedTheory(expandedTheory === 'theory8' ? false : 'theory8')}
          sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Speed sx={{ color: '#ff6b35' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>8. Planos Tangentes</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Definición
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              El plano tangente a una superficie z = f(x, y) en un punto (a, b, f(a,b)) es la mejor 
              aproximación lineal de la función cerca de ese punto.
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(255, 107, 53, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: '#ff6b35' }}>
                z = f(a,b) + fₓ(a,b)·(x-a) + fᵧ(a,b)·(y-b)
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Interpretación geométrica:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              El plano tangente "toca" la superficie exactamente en el punto de tangencia y tiene la misma 
              inclinación que la superficie en ese punto. Es análogo a la recta tangente en cálculo de una variable.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Relación con el gradiente:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              El vector normal al plano tangente es: <strong>n = (-fₓ, -fᵧ, 1)</strong>, y el gradiente 
              ∇f = (fₓ, fᵧ) determina la inclinación del plano.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Aplicaciones:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: '#ff6b35', fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Aproximación lineal de funciones complejas" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: '#ff6b35', fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Cálculo de diferencias y errores de aproximación" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: '#ff6b35', fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText primary="Análisis de sensibilidad en modelos matemáticos" />
              </ListItem>
            </List>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>
              Visualización en el proyecto:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              La aplicación renderiza el plano tangente como una superficie semi-transparente en color naranja, 
              permitiendo comparar visualmente la aproximación lineal con la función original.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Curvas de Nivel */}
        <Accordion
          expanded={expandedTheory === 'theory9'}
          onChange={() => setExpandedTheory(expandedTheory === 'theory9' ? false : 'theory9')}
          sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timeline sx={{ color: theme.palette.info.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>9. Curvas de Nivel</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Definición
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Una curva de nivel (o isolínea) de una función f(x, y) para un valor constante c es el conjunto 
              de todos los puntos donde la función tiene ese valor específico.
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(6, 182, 212, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: theme.palette.info.main }}>
                Cᶜ = {'{'}(x, y) : f(x, y) = c{'}'}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Interpretación geométrica:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              Las curvas de nivel son como "cortes horizontales" de la superficie a diferentes alturas. 
              Son similares a las líneas de un mapa topográfico que muestran elevaciones.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Propiedades importantes:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.info.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText 
                  primary="El gradiente es perpendicular" 
                  secondary="∇f es siempre perpendicular a las curvas de nivel" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.info.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText 
                  primary="Densidad indica pendiente" 
                  secondary="Curvas juntas = pendiente pronunciada, curvas separadas = pendiente suave" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle sx={{ color: theme.palette.info.main, fontSize: '1.2rem' }} /></ListItemIcon>
                <ListItemText 
                  primary="Nunca se cruzan" 
                  secondary="Dos curvas de nivel diferentes no pueden intersectarse" 
                />
              </ListItem>
            </List>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>
              Ejemplos clásicos:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Paraboloide: f(x,y) = x² + y²
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                      Curvas de nivel: Círculos concéntricos
                      <br />x² + y² = c (radio = √c)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Plano inclinado: f(x,y) = x + y
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                      Curvas de nivel: Líneas rectas paralelas
                      <br />x + y = c
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>
              Visualización en el proyecto:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              La aplicación genera curvas de nivel en 3D con colores interpolados del azul (valores bajos) 
              al rojo (valores altos), permitiendo entender la topografía de la función de manera intuitiva.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Dominio y Rango */}
        <Accordion
          expanded={expandedTheory === 'theory7'}
          onChange={() => setExpandedTheory(expandedTheory === 'theory7' ? false : 'theory7')}
          sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', mb: 2, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Architecture sx={{ color: theme.palette.warning.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>7. Dominio y Rango</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Dominio
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              El dominio de una función f(x, y) es el conjunto de todos los pares ordenados (x, y) 
              para los cuales la función está definida y produce valores reales.
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: theme.palette.warning.main }}>
                Dom(f) = {'{'}(x, y) ∈ ℝ² : f(x, y) está definida{'}'}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Restricciones comunes del dominio:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      División por cero
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                      f(x,y) = 1/x → x ≠ 0
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Raíces cuadradas
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                      f(x,y) = √(x+y) → x+y ≥ 0
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Logaritmos
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                      f(x,y) = ln(xy) → x, y {'>'} 0
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Funciones trigonométricas inversas
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                      f(x,y) = arcsin(x) → -1 ≤ x ≤ 1
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Rango
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary, lineHeight: 1.8 }}>
              El rango (o imagen) es el conjunto de todos los valores posibles que la función puede tomar.
            </Typography>
            <Box sx={{ p: 2, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 2, mb: 2, fontFamily: 'monospace' }}>
              <Typography sx={{ color: theme.palette.warning.main }}>
                Rang(f) = {'{'}z ∈ ℝ : z = f(x, y) para algún (x, y) ∈ Dom(f){'}'}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
              Análisis heurístico en el proyecto:
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              La aplicación implementa algoritmos heurísticos para determinar automáticamente el dominio 
              y rango de funciones, identificando restricciones comunes y calculando valores extremos.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Logros */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Logros del Proyecto
        </Typography>
        <Grid container spacing={2}>
          {achievements.map((achievement, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: '2rem' }}>{achievement.icon}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {achievement.text}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer con enlace a documentación */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <GitHub sx={{ fontSize: '3rem', color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Proyecto Open Source
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Desarrollado con fines educativos y de aprendizaje
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MuiLink
              href="http://localhost:5000/api/docs"
              target="_blank"
              rel="noopener"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Ver API Docs (Swagger)
            </MuiLink>
            <Typography sx={{ color: theme.palette.text.secondary }}>•</Typography>
            <MuiLink
              href="#"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Código Fuente
            </MuiLink>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AboutPage;

