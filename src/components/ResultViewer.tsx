/**
 * ResultViewer.tsx
 * Componente para mostrar resultados de operaciones matemáticas
 * 
 * Características:
 * - Renderizado de expresiones con MathJax/KaTeX
 * - Formateo de resultados numéricos y simbólicos
 * - Visualización de pasos de solución
 * - Estados de carga y error
 */

import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider
} from '@mui/material';
import { 
  ExpandMore, 
  CheckCircle, 
  Functions,
  Calculate 
} from '@mui/icons-material';
import { formatMathExpression } from '../utils/formatMath';
import { useTheme } from '@mui/material/styles';

interface ResultViewerProps {
  result: any;
  loading: boolean;
  operation?: string;
}

/**
 * Componente para renderizar expresiones matemáticas
 * Utiliza MathJax o renderizado básico
 */
const MathExpression: React.FC<{ expression: string }> = ({ expression }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    // Si MathJax está disponible, renderizar
    if (window.MathJax && containerRef.current && expression) {
      // Esperar a que MathJax esté completamente cargado
      if (window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => 
          console.error('Error rendering math:', err)
        );
      } else {
        // Si MathJax aún no está listo, esperar un poco
        setTimeout(() => {
          if (window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([containerRef.current!]).catch((err: any) => 
              console.error('Error rendering math:', err)
            );
          }
        }, 500);
      }
    }
  }, [expression]);

  if (!expression) return null;

  // Convertir expresión a LaTeX
  const latexExpression = formatMathExpression(expression);

  return (
    <Box 
      ref={containerRef}
      sx={{
        p: 2,
        backgroundColor: 'rgba(5,5,5,0.85)',
        borderRadius: '8px',
        fontFamily: "'Fira Code', monospace",
        fontSize: '1.1rem',
        color: theme.palette.success.main,
        overflowX: 'auto',
        minHeight: '50px',
      }}
    >
      {/* Renderizado con MathJax */}
      <div className="tex2jax_process">
        {`\\[${latexExpression}\\]`}
      </div>
      
      {/* Fallback: texto simple (se oculta cuando MathJax renderiza) */}
      <Box 
        sx={{ 
          color: theme.palette.text.secondary, 
          fontSize: '0.9rem', 
          mt: 1,
          display: window.MathJax ? 'none' : 'block'
        }}
      >
        {expression}
      </Box>
    </Box>
  );
};

/**
 * Componente principal ResultViewer
 */
const ResultViewer: React.FC<ResultViewerProps> = ({ 
  result, 
  loading, 
  operation 
}) => {
  const theme = useTheme();
  // Estado de carga
  if (loading) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          backgroundColor: 'rgba(8,8,8,0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px'
        }}
      >
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
        <Skeleton variant="text" width="60%" height={30} sx={{ mt: 2 }} />
      </Paper>
    );
  }

  // Sin resultado
  if (!result) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          backgroundColor: 'rgba(8,8,8,0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          textAlign: 'center'
        }}
      >
        <Functions sx={{ fontSize: '3rem', color: 'rgba(255,255,255,0.35)', mb: 2 }} />
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          Los resultados aparecerán aquí
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
          Ingresa una función y selecciona una operación
        </Typography>
      </Paper>
    );
  }

  // Extraer información del resultado según la estructura del backend Flask
  let mainResult: any = null;
  let symbolic_form: string | null = null;
  let numerical_value: number | null = null;
  let domain: string | null = null;
  let steps: string[] = [];
  let critical_points: any[] = [];
  let error: string | null = null;

  // Mapear según el tipo de operación
  if (result.derivative) {
    mainResult = result.derivative.symbolic;
    symbolic_form = result.derivative.symbolic;
    numerical_value = result.derivative.value;
  } else if (result.integral) {
    mainResult = result.integral;
    symbolic_form = result.integral;
  } else if (result.gradient) {
    mainResult = result.gradient.symbolic?.join(', ') || '';
    symbolic_form = result.gradient.symbolic?.join(', ') || '';
    numerical_value = result.gradient.value ? result.gradient.value[0] : null;
  } else if (result.limit_result) {
    // Detectar si es límite multivariable o univariable
    if (result.limit_result.paths_analysis && result.limit_result.paths_analysis.length > 0) {
      // Límite multivariable con análisis de trayectorias
      mainResult = result.limit_result.limit_value;
      symbolic_form = result.limit_result.limit_value;
    } else {
      // Límite univariable simple
      mainResult = result.limit_result.limit;
      symbolic_form = result.limit_result.limit;
    }
  } else if (result.optimization_result) {
    // Manejar caso degenerado: familia infinita de soluciones
    if (result.optimization_result.infinite_family) {
      mainResult = `Familia infinita de soluciones detectada`;
      // Mostrar razón y punto objetivo en la UI
      (result as any)._infinite_info = {
        reason: result.optimization_result.reason,
        objective_on_constraint: result.optimization_result.objective_on_constraint,
        sample_points: result.optimization_result.sample_points || []
      };
    } else {
      mainResult = `Soluciones encontradas: ${result.optimization_result.solutions.length}`;
      critical_points = result.optimization_result.solutions.map((sol: any) => ({
        x: sol.point.x || sol.point?.x,
        y: sol.point.y || sol.point?.y,
        lambda: sol.lambda,
        value: sol.objective_value
      }));
    }
  } else if (result.domain_and_range) {
    mainResult = `Dominio: ${result.domain_and_range.domain_heuristic}\nRango: ${result.domain_and_range.range_heuristic}`;
    domain = result.domain_and_range.domain_heuristic;
    // Agregar rango como campo adicional
    (result as any).range = result.domain_and_range.range_heuristic;
  } else if (result.error) {
    error = result.error;
  } else {
    // Fallback: usar cualquier campo disponible
    mainResult = result.result || result.function || JSON.stringify(result);
  }

  // Mapeo de operaciones a títulos legibles
  const operationTitles: Record<string, string> = {
    derivative: 'Derivada Parcial',
    integral: 'Integral',
    gradient: 'Gradiente',
    limit: 'Límite',
    lagrange: 'Multiplicadores de Lagrange',
    domain: 'Dominio y Rango'
  };

  const title = operation ? operationTitles[operation] : 'Resultado';

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        backgroundColor: 'rgba(8,8,8,0.85)',
        border: `1px solid ${theme.palette.primary.main}33`,
        borderRadius: '16px'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <CheckCircle sx={{ color: theme.palette.success.main }} />
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
          {title}
        </Typography>
        {operation && (
          <Chip 
            label={operation} 
            size="small" 
            sx={{ 
              backgroundColor: `${theme.palette.primary.main}22`,
              color: theme.palette.primary.main,
              fontWeight: 500
            }} 
          />
        )}
      </Box>

      {/* Error */}
      {error && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: `${theme.palette.error.main}15`, borderRadius: '8px', border: `1px solid ${theme.palette.error.main}55` }}>
          <Typography sx={{ color: theme.palette.error.main, fontWeight: 500 }}>
            Error: {error}
          </Typography>
        </Box>
      )}

      {/* Resultado principal */}
      {(mainResult || symbolic_form) && !error && (
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 500 }}
          >
            {operation === 'gradient' ? 'Gradiente:' : operation === 'lagrange' ? 'Resultado:' : 'Expresión simbólica:'}
          </Typography>
          <MathExpression expression={symbolic_form || mainResult || ''} />
        </Box>
      )}

      {/* Gradiente completo */}
      {result.gradient && result.gradient.symbolic && (
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 500 }}
          >
            Componentes del gradiente:
          </Typography>
          {result.gradient.symbolic.map((comp: string, idx: number) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <MathExpression expression={comp} />
            </Box>
          ))}
        </Box>
      )}

      {/* Análisis de Límites Multivariables - Trayectorias */}
      {result.limit_result && result.limit_result.paths_analysis && (
        <Box sx={{ mb: 3 }}>
          {/* Explicación del límite */}
          {result.limit_result.explanation && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: result.limit_result.limit_exists ? `${theme.palette.success.main}15` : `${theme.palette.warning.main}15`, borderRadius: '8px', border: `1px solid ${result.limit_result.limit_exists ? theme.palette.success.main : theme.palette.warning.main}55` }}>
              <Typography sx={{ color: result.limit_result.limit_exists ? theme.palette.success.main : theme.palette.warning.main, fontWeight: 500 }}>
                {result.limit_result.explanation}
              </Typography>
            </Box>
          )}

          <Typography 
            variant="subtitle2" 
            sx={{ color: theme.palette.text.secondary, mb: 2, fontWeight: 500 }}
          >
            Análisis por Trayectorias ({result.limit_result.total_paths_tested} caminos analizados):
          </Typography>
          
          {result.limit_result.paths_analysis.map((path: any, idx: number) => (
            <Accordion 
              key={idx}
              sx={{ 
                backgroundColor: 'rgba(10,10,10,0.5)',
                border: `1px solid ${theme.palette.primary.main}22`,
                mb: 1,
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: theme.palette.primary.main }} />}
                sx={{ 
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Typography sx={{ color: theme.palette.primary.main, fontWeight: 500, flex: 1 }}>
                    {path.path}
                  </Typography>
                  <Chip 
                    label={path.limit || path.error || 'N/A'} 
                    size="small" 
                    sx={{ 
                      backgroundColor: path.error ? `${theme.palette.error.main}22` : `${theme.palette.success.main}22`,
                      color: path.error ? theme.palette.error.main : theme.palette.success.main,
                      fontWeight: 500,
                      fontFamily: "'Fira Code', monospace"
                    }} 
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ pl: 2 }}>
                  {/* Descripción */}
                  <Typography sx={{ color: theme.palette.text.secondary, mb: 1, fontSize: '0.9rem' }}>
                    {path.description}
                  </Typography>
                  
                  {/* Forma simbólica */}
                  {path.symbolic && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem', mb: 0.5 }}>
                        Expresión simbólica:
                      </Typography>
                      <MathExpression expression={path.symbolic} />
                    </Box>
                  )}
                  
                  {/* Aproximación numérica */}
                  {path.numerical_approach && path.numerical_approach.length > 0 && (
                    <Box>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem', mb: 1 }}>
                        Valores de aproximación:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {path.numerical_approach.map((approx: any, aIdx: number) => (
                          <Box 
                            key={aIdx}
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              p: 1,
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              borderRadius: '4px',
                              fontFamily: "'Fira Code', monospace",
                              fontSize: '0.85rem'
                            }}
                          >
                            <Typography sx={{ color: theme.palette.info.main }}>
                              {Object.entries(approx.point).map(([k, v]) => `${k}=${v}`).join(', ')}
                            </Typography>
                            <Typography sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
                              → {approx.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Error */}
                  {path.error && (
                    <Box sx={{ mt: 1, p: 1, backgroundColor: `${theme.palette.error.main}15`, borderRadius: '4px' }}>
                      <Typography sx={{ color: theme.palette.error.main, fontSize: '0.85rem' }}>
                        Error: {path.error}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Soluciones de Lagrange */}
          {result.optimization_result && result.optimization_result.solutions && (
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 500 }}
          >
            Soluciones:
          </Typography>
              {/* Si el backend indicó familia infinita, mostrar razón y puntos de muestra */}
              {((result as any)._infinite_info) ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: theme.palette.warning.main, fontFamily: "'Fira Code', monospace" }}>
                    {((result as any)._infinite_info.reason)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontFamily: "'Fira Code', monospace", mt: 1 }}>
                    Valor objetivo en la restricción: {((result as any)._infinite_info.objective_on_constraint)}
                  </Typography>
                  {((result as any)._infinite_info.sample_points || []).length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>Puntos de ejemplo:</Typography>
                      {((result as any)._infinite_info.sample_points).map((p: any, i: number) => (
                        <Box key={i} sx={{ mt: 0.5, fontFamily: "'Fira Code', monospace", color: '#00C896' }}>{JSON.stringify(p)}</Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                result.optimization_result.solutions.map((sol: any, idx: number) => (
                  <Box key={idx} sx={{ mb: 2, p: 2, backgroundColor: 'rgba(5,5,5,0.85)', borderRadius: '8px' }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                      Solución {idx + 1}:
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.success.main, fontFamily: "'Fira Code', monospace" }}>
                      Punto: {JSON.stringify(sol.point)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.warning.main, fontFamily: "'Fira Code', monospace" }}>
                      λ = {sol.lambda}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontFamily: "'Fira Code', monospace" }}>
                      Valor objetivo: {sol.objective_value}
                    </Typography>
                  </Box>
                ))
              )}
        </Box>
      )}

      {/* Valor numérico (si existe) */}
      {numerical_value !== undefined && (
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 500 }}
          >
            Valor numérico:
          </Typography>
          <Box sx={{
            p: 2,
            backgroundColor: 'rgba(5,5,5,0.85)',
            borderRadius: '8px',
            color: theme.palette.warning.main,
            fontSize: '1.2rem',
            fontWeight: 600
          }}>
            {typeof numerical_value === 'number' 
              ? numerical_value.toFixed(6) 
              : numerical_value}
          </Box>
        </Box>
      )}

      {/* Dominio y Rango (para operación de dominio) */}
      {domain && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 500 }}
          >
            Dominio:
          </Typography>
          <Box sx={{
            p: 2,
            backgroundColor: 'rgba(5,5,5,0.85)',
            borderRadius: '8px',
            color: theme.palette.info.main,
            fontFamily: "'Fira Code', monospace",
            mb: 2
          }}>
            {domain}
          </Box>

          {/* Rango */}
          {result.range && (
            <>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 500 }}
              >
                Rango:
              </Typography>
              <Box sx={{
                p: 2,
                backgroundColor: 'rgba(5,5,5,0.85)',
                borderRadius: '8px',
                color: theme.palette.warning.main,
                fontFamily: "'Fira Code', monospace"
              }}>
                {result.range}
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Puntos críticos */}
      {critical_points && critical_points.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 500 }}
          >
            Puntos críticos:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {critical_points.map((point: any, index: number) => (
              <Chip
                key={index}
                label={`(${point.x}, ${point.y})`}
                sx={{
                  backgroundColor: `${theme.palette.error.main}1a`,
                  color: theme.palette.error.main,
                  fontFamily: "'Fira Code', monospace"
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Pasos de solución (acordeón expandible) */}
      {steps && steps.length > 0 && (
        <>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Accordion 
            sx={{ 
              backgroundColor: 'rgba(5,5,5,0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: theme.palette.primary.main }} />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculate sx={{ color: theme.palette.primary.main, fontSize: '1.2rem' }} />
                <Typography sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                  Ver pasos de solución ({steps.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="ol" sx={{ pl: 2, m: 0, color: theme.palette.text.secondary }}>
                {steps.map((step: string, index: number) => (
                  <Box component="li" key={index} sx={{ mb: 1.5 }}>
                    <Typography variant="body2">{step}</Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
      )}

      {/* JSON completo (para debugging) */}
      <Accordion 
        sx={{ 
          mt: 2,
          backgroundColor: 'rgba(5,5,5,0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore sx={{ color: theme.palette.text.secondary }} />}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Ver respuesta completa (JSON)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box 
            component="pre"
            sx={{
              p: 2,
              backgroundColor: '#000',
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: '0.75rem',
              color: theme.palette.success.main,
              fontFamily: "'Fira Code', monospace"
            }}
          >
            {JSON.stringify(result, null, 2)}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

// Declaración global de MathJax para TypeScript
declare global {
  interface Window {
    MathJax: any;
  }
}

export default ResultViewer;
