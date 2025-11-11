/**
 * App.tsx
 * Componente principal de la aplicación
 * 
 * Orquesta todos los componentes y maneja el estado global
 * de la aplicación de cálculo multivariado
 */

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Container,
  Typography,
  type AlertColor
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Componentes de Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Componentes principales
import MathInput from './components/MathInput';
import OperationButtons from './components/OperationButtons';
import ResultViewer from './components/ResultViewer';
import SurfacePlot from './components/SurfacePlot';
import VariableSelector from './components/VariableSelector';
import LagrangeInput from './components/LagrangeInput';
import AIPanel from './components/AIPanel';

// Páginas
import HomePage from './pages/HomePage';
import DocsPage from './pages/DocsPage';
import AboutPage from './pages/AboutPage';

// Autenticación e Historial
import LoginModal from './components/Auth/LoginModal';
import HistoryPanel from './components/HistoryPanel';
import { useAuth } from './context/AuthContext';

// Hooks personalizados
import useApi, { fetchMeshData, fetchGradientData } from './hooks/useApi';
import type { MathOperation } from './hooks/useApi';
import type { SurfaceDataset } from './utils/plotData';
import { extractSurfaceDataset, normalizeSurfaceDataset } from './utils/plotData';

/**
 * Componente principal de la aplicación
 */
function App() {
  // ============================================
  // ESTADO DE LA APLICACIÓN
  // ============================================
  const theme = useTheme();
  
  // Estado del input matemático
  const [mathFunction, setMathFunction] = useState('');
  const [variable, setVariable] = useState('x');
  const [isValidFunction, setIsValidFunction] = useState(true);

  // Estado específico para Lagrange
  const [objectiveFunction, setObjectiveFunction] = useState('');
  const [constraintFunction, setConstraintFunction] = useState('');
  const [constraintValue, setConstraintValue] = useState('0');
  const [isValidObjective, setIsValidObjective] = useState(false);
  const [isValidConstraint, setIsValidConstraint] = useState(false);

  // Estado de la última operación ejecutada
  const [lastOperation, setLastOperation] = useState<MathOperation | null>(null);

  // Hook personalizado para API
  const { loading, error, data, executeOperation, reset } = useApi();

  // Estado de notificaciones
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Estado del panel de IA
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // Estado de navegación
  const [currentPage, setCurrentPage] = useState<'calculator' | 'home' | 'docs' | 'about'>('home');

  // Estado de autenticación
  const { user, isLoggedIn, login, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);

  // ============================================
  // Estado específico de visualización 3D
  const [meshDataState, setMeshDataState] = useState<SurfaceDataset | null>(null);
  const [meshLoading, setMeshLoading] = useState(false);
  const [gradientDataState, setGradientDataState] = useState<any | null>(null);
  const [gradientLoading, setGradientLoading] = useState(false);

  const plotData = useMemo(
    () => normalizeSurfaceDataset(extractSurfaceDataset((data as any)?.plot_data ?? null)),
    [data]
  );

  const meshData = useMemo(() => {
    if (meshDataState) {
      return normalizeSurfaceDataset(meshDataState);
    }
    return normalizeSurfaceDataset(extractSurfaceDataset((data as any)?.mesh_data ?? null));
  }, [data, meshDataState]);
  // HANDLERS
  // ============================================

  /**
   * Maneja la ejecución de operaciones matemáticas
   */
  const handleOperation = async (operation: MathOperation) => {
    // Validaciones previas
    if (!mathFunction.trim()) {
      showNotification('Por favor ingresa una función matemática', 'warning');
      return;
    }

    if (!isValidFunction) {
      showNotification('La función contiene errores de sintaxis', 'error');
      return;
    }

    // Preparar parámetros según la operación
    const params: any = {
      function: mathFunction,
    };

    // Operaciones que requieren variable específica
    if (['derivative', 'integral', 'limit'].includes(operation)) {
      params.respect_to = variable;
    }

    // Operaciones que requieren múltiples variables
    if (operation === 'gradient') {
      // Extraer variables de la función (básico: x, y, z)
      // Usar regex para encontrar variables (letras que no sean parte de funciones)
      const functionNames = ['sin', 'cos', 'tan', 'exp', 'log', 'ln', 'sqrt', 'abs', 'sinh', 'cosh', 'tanh'];
      let funcCopy = mathFunction;
      functionNames.forEach(fn => {
        funcCopy = funcCopy.replace(new RegExp(fn, 'g'), '');
      });
      const vars = ['x', 'y', 'z', 't', 'u', 'v'].filter(v => funcCopy.includes(v));
      params.variables = vars.length > 0 ? vars : ['x', 'y'];
    }
    
    if (operation === 'domain') {
      // Domain puede funcionar sin variables específicas, pero es mejor proporcionarlas
      const vars = ['x', 'y', 'z'].filter(v => mathFunction.includes(v));
      if (vars.length > 0) {
        params.variables = vars;
      }
    }

    if (operation === 'lagrange') {
      // Validar que ambos campos estén llenos
      if (objectiveFunction.trim() === '' || constraintFunction.trim() === '') {
        setLastOperation(operation); // Asegurar que se muestre el componente
        showNotification('Ingresa la función objetivo y la restricción para continuar', 'info');
        return;
      }

      // Validar sintaxis
      if (!isValidObjective || !isValidConstraint) {
        showNotification('Las funciones contienen errores de sintaxis', 'error');
        return;
      }

      // Preparar parámetros para Lagrange
      params.objective_function = objectiveFunction;
      params.constraint_function = constraintFunction;
      params.constraint_value = constraintValue;
      params.variables = ['x', 'y']; // Por ahora fijo, podría extraerse automáticamente
    }

    // Ejecutar operación
    setLastOperation(operation);
    const result = await executeOperation(operation, params);

    // Si es operación gradient, generar automáticamente el campo vectorial
    if (operation === 'gradient' && result) {
      setGradientLoading(true);
      try {
        const gradientData = await fetchGradientData(mathFunction, params.variables, { x: [-5, 5], y: [-5, 5] });
        setGradientDataState(gradientData);
        showNotification('Gradiente y campo vectorial generados exitosamente', 'success');
      } catch (err: any) {
        console.error('Error fetching gradient data:', err);
        showNotification('Gradiente simbólico calculado, pero error al generar campo vectorial: ' + (err?.message || 'Error desconocido'), 'warning');
        // Limpiar datos de gradiente previos
        setGradientDataState(null);
      } finally {
        setGradientLoading(false);
      }
    }

    // Mostrar resultado o error
    if (result && !error) {
      showNotification('Operación completada exitosamente', 'success');
    } else if (error) {
      showNotification(error, 'error');
    }
  };

  /**
   * Muestra una notificación temporal
   */
  const showNotification = (message: string, severity: AlertColor) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  /**
   * Cierra la notificación
   */
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  /**
   * Limpia el estado y reinicia la aplicación
   */
  const handleReset = () => {
    setMathFunction('');
    setVariable('x');
    setObjectiveFunction('');
    setConstraintFunction('');
    setConstraintValue('0');
    setLastOperation(null);
    setMeshDataState(null);
    setGradientDataState(null);
    reset();
  };

  // ============================================
  // RENDER
  // ============================================

  const panelStyles = {
    borderRadius: '24px',
    padding: theme.spacing(3),
    background: 'rgba(15,15,15,0.86)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 45px 120px rgba(0,0,0,0.55)',
    backdropFilter: 'blur(20px)',
  } as const;

  const statusMessage =
    lastOperation === 'gradient'
      ? gradientLoading
        ? 'Generando campo vectorial...'
        : gradientDataState
          ? 'Gradiente renderizado'
          : loading
            ? 'Procesando gradiente...'
            : 'Listo para graficar el gradiente'
      : meshLoading
        ? 'Generando malla...'
        : meshData || plotData
          ? 'Superficie generada'
          : loading
            ? 'Procesando resultado...'
            : 'Grafica tu función para visualizarla';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      {/* Fondo decorativo */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background: `
            radial-gradient(circle at 25% 20%, rgba(59,130,246,0.18), transparent 45%),
            radial-gradient(circle at 75% 0%, rgba(6,182,212,0.18), transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(139,92,246,0.22), transparent 35%)
          `,
          opacity: 0.9,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Sidebar fijo a la izquierda - Solo visible en la calculadora */}
      {currentPage === 'calculator' && (
        <Box
          sx={{
            width: { xs: '100%', md: '380px' },
            minWidth: { md: '380px' },
            maxWidth: { md: '380px' },
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: 'rgba(10,10,10,0.95)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            // Scrollbar personalizado
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.02)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              '&:hover': {
                background: 'rgba(255,255,255,0.15)',
              },
            },
          }}
        >
        {/* Header del Sidebar */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <Typography variant="caption" sx={{ letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
              En línea
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Cálculo Simbólico
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.875rem' }}>
            Ingresa tu función y selecciona una operación
          </Typography>
        </Box>

        {/* Controles del Sidebar */}
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1 }}>
          <MathInput value={mathFunction} onChange={setMathFunction} onValidate={setIsValidFunction} />

          <VariableSelector selected={variable} onChange={setVariable} />

          {lastOperation === 'lagrange' && (
            <LagrangeInput
              objectiveFunction={objectiveFunction}
              constraintFunction={constraintFunction}
              constraintValue={constraintValue}
              onObjectiveChange={setObjectiveFunction}
              onConstraintChange={setConstraintFunction}
              onConstraintValueChange={setConstraintValue}
              onObjectiveValidate={setIsValidObjective}
              onConstraintValidate={setIsValidConstraint}
            />
          )}

          <OperationButtons
            onOperation={handleOperation}
            loading={loading}
            disabled={
              lastOperation === 'lagrange'
                ? !isValidObjective ||
                  !isValidConstraint ||
                  !objectiveFunction.trim() ||
                  !constraintFunction.trim()
                : !isValidFunction || !mathFunction.trim()
            }
          />

          {/* Botón de reset */}
          <Button
            onClick={handleReset}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            Limpiar Todo
          </Button>
        </Box>
        </Box>
      )}

      {/* Botones flotantes */}
      <Box
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {/* Botón de IA */}
        <Button
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: '#000',
            borderRadius: '50%',
            width: 58,
            height: 58,
            minWidth: 58,
            boxShadow: '0 20px 60px rgba(15,118,255,0.35)',
            '&:hover': {
              transform: 'translateY(-1px) scale(1.02)',
              boxShadow: '0 25px 80px rgba(6,182,212,0.35)',
            },
          }}
        >
          🤖
        </Button>

        {/* Botón de Historial (solo si está autenticado) */}
        {isLoggedIn && currentPage === 'calculator' && (
          <Button
            onClick={() => setHistoryPanelOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: '#fff',
              borderRadius: '50%',
              width: 58,
              height: 58,
              minWidth: 58,
              boxShadow: '0 20px 60px rgba(139,92,246,0.35)',
              '&:hover': {
                transform: 'translateY(-1px) scale(1.02)',
                boxShadow: '0 25px 80px rgba(139,92,246,0.45)',
              },
            }}
          >
            📋
          </Button>
        )}
      </Box>

      {/* Área principal - con margin-left para compensar el sidebar */}
      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, md: currentPage === 'calculator' ? '380px' : 0 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Navbar 
          onReset={handleReset} 
          onNavigate={(page) => setCurrentPage(page as any)}
          currentPage={currentPage}
          onLoginClick={() => setLoginModalOpen(true)}
        />

        {/* Contenido principal - Renderizar según página */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          {/* Página de Inicio */}
          {currentPage === 'home' && (
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
              <HomePage 
                onNavigate={(page) => setCurrentPage(page as any)}
                onStartCalculating={() => setCurrentPage('calculator')}
              />
            </Container>
          )}

          {/* Página de Documentación */}
          {currentPage === 'docs' && (
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
              <DocsPage />
            </Container>
          )}

          {/* Página Sobre el Proyecto */}
          {currentPage === 'about' && (
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
              <AboutPage />
            </Container>
          )}

          {/* Calculadora (vista original) */}
          {currentPage === 'calculator' && (
            <Box sx={{ p: { xs: 2, md: 4 }, gap: 3, display: 'flex', flexDirection: 'column' }}>
              {/* Header con botón de generar malla */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Visualización 3D
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {statusMessage}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={async () => {
                    if (!mathFunction.trim()) {
                      showNotification('Ingresa una función para visualizar', 'warning');
                      return;
                    }
                    setMeshLoading(true);
                    try {
                      const mesh = await fetchMeshData(mathFunction, ['x', 'y'], {
                        x: [-5, 5],
                        y: [-5, 5],
                        resolution: 50,
                      });
                      setMeshDataState(mesh);
                      showNotification('Malla generada correctamente', 'success');
                    } catch (err: any) {
                      console.error('Error fetching mesh:', err);
                      showNotification(err?.message || 'Error al generar la malla', 'error');
                    } finally {
                      setMeshLoading(false);
                    }
                  }}
                  disabled={meshLoading}
                  sx={{
                    minWidth: 180,
                    height: 48,
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                    },
                  }}
                >
                  {meshLoading ? 'Generando...' : 'Generar Malla 3D'}
                </Button>
              </Box>

              {/* Gráfica 3D - Toma más espacio vertical */}
              <Box
                sx={{
                  ...panelStyles,
                  flex: '0 0 auto',
                  height: { xs: '500px', md: '600px', lg: '650px' },
                  minHeight: { xs: '500px', md: '600px' },
                }}
              >
                <SurfacePlot
                  data={plotData || undefined}
                  meshData={meshData || undefined}
                  gradientData={lastOperation === 'gradient' ? gradientDataState?.gradient?.vector_field : null}
                  title={
                    lastOperation === 'gradient'
                      ? 'Superficie + Campo de Gradiente'
                      : mathFunction || 'Superficie 3D'
                  }
                />
              </Box>

              {/* ResultViewer - Abajo de la gráfica */}
              <Box sx={{ ...panelStyles, flex: '1 1 auto', minHeight: '300px' }}>
                <ResultViewer result={data} loading={loading} operation={lastOperation || undefined} />
              </Box>
            </Box>
          )}
        </Box>

        <Footer onNavigate={(page) => setCurrentPage(page as any)} />
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <AIPanel isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />
      
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(token, userData) => {
          login(token, userData);
          showNotification(`Bienvenido ${userData.nombre}!`, 'success');
        }}
      />
      
      <HistoryPanel
        open={historyPanelOpen}
        onClose={() => setHistoryPanelOpen(false)}
        onSelectOperation={(operation) => {
          // Cargar operación en la calculadora
          setMathFunction(operation.expression);
          setHistoryPanelOpen(false);
          showNotification('Operación cargada desde historial', 'info');
        }}
      />
    </Box>
  );
}

export default App;
