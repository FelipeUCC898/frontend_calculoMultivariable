/**
 * Footer.tsx
 * Pie de página de la aplicación
 * 
 * Muestra información del proyecto y créditos
 */

import React from 'react';
import { Box, Typography, Container, Link, Divider } from '@mui/material';
import { GitHub, School, Code } from '@mui/icons-material';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        py: 4,
        mt: 6,
        backgroundColor: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <Container maxWidth="lg">
        {/* Contenido principal del footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
          }}
        >
          {/* Información del proyecto */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: '400px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <School sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Proyecto Académico
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Aplicación de cálculo multivariado desarrollada como proyecto de
              Ingeniería de Software. Combina análisis simbólico, optimización
              matemática y visualización interactiva.
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              © {currentYear} Ingeniería de Software
            </Typography>
          </Box>

          {/* Enlaces rápidos */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}
            >
              Enlaces
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                onClick={() => onNavigate?.('docs')}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Documentación
              </Link>
              <Link
                onClick={() => onNavigate?.('docs')}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Guía de uso
              </Link>
              <Link
                href="http://localhost:5000/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                API Reference
              </Link>
            </Box>
          </Box>

          {/* Tecnologías */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.primary', fontWeight: 600, mb: 2 }}
            >
              Stack Tecnológico
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                • React + TypeScript
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                • Material UI v5
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                • Flask + PostgreSQL
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                • Three.js + MathJax
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

        {/* Footer inferior */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Desarrollado con fines educativos y de aprendizaje
          </Typography>

          {/* Enlaces sociales/repositorio */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Link
              onClick={() => onNavigate?.('about')}
              sx={{
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <GitHub fontSize="small" />
              <Typography variant="body2">GitHub</Typography>
            </Link>
            
            <Link
              onClick={() => onNavigate?.('about')}
              sx={{
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <Code fontSize="small" />
              <Typography variant="body2">Código fuente</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
