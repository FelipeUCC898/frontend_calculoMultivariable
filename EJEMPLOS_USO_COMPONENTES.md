# 📘 EJEMPLOS DE USO - Componentes Mejorados

## Introducción

Este documento proporciona ejemplos prácticos de cómo usar los componentes mejorados de visualización en tu aplicación React.

---

## 1. SurfacePlot - Visualización Completa

### Ejemplo Básico: Superficie con Gradiente

```typescript
import React, { useState, useEffect } from 'react';
import SurfacePlot from './components/SurfacePlot';

function Example1() {
  const [meshData, setMeshData] = useState(null);
  const [gradientData, setGradientData] = useState(null);

  useEffect(() => {
    // Obtener malla de la superficie
    fetch('/api/mesh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expression: "x**2 + y**2",
        variables: ["x", "y"],
        range: {
          x: [-3, 3],
          y: [-3, 3],
          resolution: 50
        }
      })
    })
    .then(res => res.json())
    .then(data => setMeshData(data));

    // Obtener gradiente
    fetch('/api/gradient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        function: "x**2 + y**2",
        variables: ["x", "y"]
      })
    })
    .then(res => res.json())
    .then(data => setGradientData(data.gradient.vector_field));
  }, []);

  return (
    <SurfacePlot
      meshData={meshData}
      gradientData={gradientData}
      showGradient={true}
      title="Paraboloide con Campo Gradiente"
    />
  );
}
```

---

## 2. Superficie con Puntos Críticos

### Ejemplo: Identificar y Visualizar Extremos

```typescript
import React, { useState, useEffect } from 'react';
import SurfacePlot from './components/SurfacePlot';
import { Box, Typography } from '@mui/material';

function Example2() {
  const [meshData, setMeshData] = useState(null);
  const [criticalPoints, setCriticalPoints] = useState(null);

  const analyzeFunction = async () => {
    // 1. Generar superficie
    const meshResponse = await fetch('/api/mesh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expression: "x**2 - y**2",
        variables: ["x", "y"],
        range: {
          x: [-2, 2],
          y: [-2, 2],
          resolution: 40
        }
      })
    });
    const meshData = await meshResponse.json();
    setMeshData(meshData);

    // 2. Calcular puntos críticos
    const cpResponse = await fetch('/api/critical-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        function: "x**2 - y**2",
        variables: ["x", "y"]
      })
    });
    const cpData = await cpResponse.json();
    setCriticalPoints(cpData.critical_points_analysis.critical_points);
  };

  useEffect(() => {
    analyzeFunction();
  }, []);

  return (
    <Box>
      <SurfacePlot
        meshData={meshData}
        criticalPoints={criticalPoints}
        showCriticalPoints={true}
        title="Silla de Montar - Punto Crítico"
      />
      
      {/* Información de puntos críticos */}
      {criticalPoints && criticalPoints.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6">Puntos Críticos Encontrados:</Typography>
          {criticalPoints.map((cp, idx) => (
            <Box key={idx} sx={{ mt: 1 }}>
              <Typography>
                📍 ({cp.point.x.toFixed(2)}, {cp.point.y.toFixed(2)})
              </Typography>
              <Typography color="primary">
                🎯 {cp.classification}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valor: {cp.value.toFixed(4)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
```

---

## 3. Plano Tangente Interactivo

### Ejemplo: Calcular y Visualizar Plano Tangente

```typescript
import React, { useState } from 'react';
import SurfacePlot from './components/SurfacePlot';
import { Box, TextField, Button } from '@mui/material';

function Example3() {
  const [meshData, setMeshData] = useState(null);
  const [tangentPlaneData, setTangentPlaneData] = useState(null);
  const [point, setPoint] = useState({ x: 1, y: 1 });

  const calculateTangentPlane = async () => {
    // 1. Generar superficie
    const meshResponse = await fetch('/api/mesh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expression: "x**2 + y**2",
        variables: ["x", "y"],
        range: {
          x: [-3, 3],
          y: [-3, 3],
          resolution: 40
        }
      })
    });
    setMeshData(await meshResponse.json());

    // 2. Calcular plano tangente en el punto
    const tpResponse = await fetch('/api/tangent-plane', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        function: "x**2 + y**2",
        variables: ["x", "y"],
        point: point
      })
    });
    const tpData = await tpResponse.json();
    setTangentPlaneData({
      mesh: tpData.tangent_plane.plane_mesh
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="X"
          type="number"
          value={point.x}
          onChange={(e) => setPoint({ ...point, x: parseFloat(e.target.value) })}
        />
        <TextField
          label="Y"
          type="number"
          value={point.y}
          onChange={(e) => setPoint({ ...point, y: parseFloat(e.target.value) })}
        />
        <Button variant="contained" onClick={calculateTangentPlane}>
          Calcular Plano Tangente
        </Button>
      </Box>

      <SurfacePlot
        meshData={meshData}
        tangentPlaneData={tangentPlaneData}
        showTangentPlane={true}
        title={`Plano Tangente en (${point.x}, ${point.y})`}
      />
    </Box>
  );
}
```

---

## 4. Curvas de Nivel en 3D

### Ejemplo: Visualizar Isolíneas

```typescript
import React, { useState, useEffect } from 'react';
import SurfacePlot from './components/SurfacePlot';
import { Box, Slider, Typography } from '@mui/material';

function Example4() {
  const [meshData, setMeshData] = useState(null);
  const [contourData, setContourData] = useState(null);
  const [numLevels, setNumLevels] = useState(10);

  const generateVisualization = async () => {
    const functionExpr = "x**2 + y**2";
    const variables = ["x", "y"];
    const range = {
      x: [-3, 3],
      y: [-3, 3],
      resolution: 60
    };

    // 1. Generar superficie
    const meshResponse = await fetch('/api/mesh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expression: functionExpr,
        variables: variables,
        range: range
      })
    });
    setMeshData(await meshResponse.json());

    // 2. Generar curvas de nivel
    const contourResponse = await fetch('/api/contour-lines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expression: functionExpr,
        variables: variables,
        range: range,
        num_levels: numLevels
      })
    });
    setContourData(await contourResponse.json());
  };

  useEffect(() => {
    generateVisualization();
  }, [numLevels]);

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>
          Número de Curvas de Nivel: {numLevels}
        </Typography>
        <Slider
          value={numLevels}
          onChange={(_, value) => setNumLevels(value as number)}
          min={3}
          max={20}
          step={1}
          marks
        />
      </Box>

      <SurfacePlot
        meshData={meshData}
        contourData={contourData}
        showContours={true}
        title="Superficie con Curvas de Nivel"
      />
    </Box>
  );
}
```

---

## 5. Visualización Completa (Todo Incluido)

### Ejemplo: Análisis Completo de una Función

```typescript
import React, { useState } from 'react';
import SurfacePlot from './components/SurfacePlot';
import { Box, Button, FormGroup, FormControlLabel, Switch } from '@mui/material';

function Example5() {
  const [data, setData] = useState({
    mesh: null,
    gradient: null,
    criticalPoints: null,
    contour: null
  });

  const [show, setShow] = useState({
    gradient: true,
    criticalPoints: true,
    contours: true
  });

  const analyzeFunction = async () => {
    const functionExpr = "x**2 - y**2";
    const variables = ["x", "y"];
    const range = {
      x: [-2, 2],
      y: [-2, 2],
      resolution: 50
    };

    // Hacer todas las peticiones en paralelo
    const [meshRes, gradRes, cpRes, contourRes] = await Promise.all([
      // Superficie
      fetch('/api/mesh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression: functionExpr,
          variables: variables,
          range: range
        })
      }),
      // Gradiente
      fetch('/api/gradient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          function: functionExpr,
          variables: variables
        })
      }),
      // Puntos críticos
      fetch('/api/critical-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          function: functionExpr,
          variables: variables
        })
      }),
      // Curvas de nivel
      fetch('/api/contour-lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression: functionExpr,
          variables: variables,
          range: range,
          num_levels: 8
        })
      })
    ]);

    const meshData = await meshRes.json();
    const gradData = await gradRes.json();
    const cpData = await cpRes.json();
    const contourData = await contourRes.json();

    setData({
      mesh: meshData,
      gradient: gradData.gradient.vector_field,
      criticalPoints: cpData.critical_points_analysis.critical_points,
      contour: contourData
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button variant="contained" onClick={analyzeFunction}>
          Analizar Función
        </Button>

        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={show.gradient}
                onChange={(e) => setShow({ ...show, gradient: e.target.checked })}
              />
            }
            label="Gradiente"
          />
          <FormControlLabel
            control={
              <Switch
                checked={show.criticalPoints}
                onChange={(e) => setShow({ ...show, criticalPoints: e.target.checked })}
              />
            }
            label="Puntos Críticos"
          />
          <FormControlLabel
            control={
              <Switch
                checked={show.contours}
                onChange={(e) => setShow({ ...show, contours: e.target.checked })}
              />
            }
            label="Curvas de Nivel"
          />
        </FormGroup>
      </Box>

      <SurfacePlot
        meshData={data.mesh}
        gradientData={data.gradient}
        criticalPoints={data.criticalPoints}
        contourData={data.contour}
        showGradient={show.gradient}
        showCriticalPoints={show.criticalPoints}
        showContours={show.contours}
        title="Análisis Completo: x² - y²"
      />
    </Box>
  );
}
```

---

## 6. IntegralVisualization - Área Bajo la Curva

### Ejemplo: Visualizar Integral con Sumas de Riemann

```typescript
import React, { useState, useEffect } from 'react';
import IntegralVisualization from './components/IntegralVisualization';
import { Box, Typography } from '@mui/material';

function Example6() {
  const [functionData, setFunctionData] = useState(null);

  useEffect(() => {
    // Generar datos de la función f(x) = x²
    const generateData = () => {
      const xMin = -3;
      const xMax = 3;
      const numPoints = 200;
      
      const x = Array.from({ length: numPoints }, (_, i) => 
        xMin + (xMax - xMin) * i / (numPoints - 1)
      );
      
      const y = x.map(val => val * val); // f(x) = x²
      
      return { x, y };
    };

    setFunctionData(generateData());
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Integral de x² de 0 a 2
      </Typography>
      
      <IntegralVisualization
        functionData={functionData}
        limits={[0, 2]}
        title="Área bajo x² = 8/3"
        showRiemannSums={true}
        numRectangles={12}
      />

      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="body1">
          💡 <strong>Nota:</strong> Al aumentar el número de rectángulos, 
          las sumas de Riemann se aproximan mejor al valor exacto de la integral.
        </Typography>
      </Box>
    </Box>
  );
}
```

---

## 7. Hook Personalizado para API

### Crear un Hook Reutilizable

```typescript
// hooks/useMathAPI.ts
import { useState, useCallback } from 'react';

export const useMathAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMesh = useCallback(async (
    expression: string,
    variables: string[],
    range: any
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mesh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, variables, range })
      });
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
      return null;
    }
  }, []);

  const calculateCriticalPoints = useCallback(async (
    func: string,
    variables: string[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/critical-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ function: func, variables })
      });
      const data = await response.json();
      setLoading(false);
      return data.critical_points_analysis.critical_points;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
      return null;
    }
  }, []);

  const calculateTangentPlane = useCallback(async (
    func: string,
    variables: string[],
    point: { [key: string]: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tangent-plane', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ function: func, variables, point })
      });
      const data = await response.json();
      setLoading(false);
      return data.tangent_plane;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    generateMesh,
    calculateCriticalPoints,
    calculateTangentPlane
  };
};

// Uso del hook:
function MyComponent() {
  const { loading, error, generateMesh, calculateCriticalPoints } = useMathAPI();
  const [meshData, setMeshData] = useState(null);

  const analyze = async () => {
    const mesh = await generateMesh("x**2 + y**2", ["x", "y"], {
      x: [-3, 3],
      y: [-3, 3],
      resolution: 50
    });
    setMeshData(mesh);
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={analyze}>Analizar</button>
      {meshData && <SurfacePlot meshData={meshData} />}
    </div>
  );
}
```

---

## 8. Integración Completa en tu Aplicación

### Ejemplo: Página de Análisis Completo

```typescript
import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import SurfacePlot from './components/SurfacePlot';
import IntegralVisualization from './components/IntegralVisualization';
import ResultViewer from './components/ResultViewer';

function CompleteAnalysisPage() {
  const [function_input, setFunctionInput] = useState("x**2 + y**2");
  const [currentTab, setCurrentTab] = useState(0);
  const [visualizationData, setVisualizationData] = useState({
    mesh: null,
    gradient: null,
    criticalPoints: null,
    result: null
  });

  const analyzeFunction = async () => {
    // Análisis completo similar al Ejemplo 5
    // ... código de fetching ...
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Análisis de Funciones Multivariables
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Función"
                value={function_input}
                onChange={(e) => setFunctionInput(e.target.value)}
                placeholder="x**2 + y**2"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={analyzeFunction}
              >
                Analizar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab label="Visualización 3D" />
          <Tab label="Resultados" />
          <Tab label="Integral" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {currentTab === 0 && (
            <SurfacePlot
              meshData={visualizationData.mesh}
              gradientData={visualizationData.gradient}
              criticalPoints={visualizationData.criticalPoints}
              showGradient
              showCriticalPoints
            />
          )}

          {currentTab === 1 && (
            <ResultViewer
              result={visualizationData.result}
              loading={false}
              operation="gradient"
            />
          )}

          {currentTab === 2 && (
            <IntegralVisualization
              functionData={null}
              limits={[-2, 2]}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default CompleteAnalysisPage;
```

---

## 📚 Resumen de Props

### SurfacePlot

| Prop | Tipo | Descripción |
|------|------|-------------|
| `meshData` | `SurfaceDataset` | Datos de la malla 3D |
| `gradientData` | `object` | Campo vectorial del gradiente |
| `contourData` | `object` | Datos de curvas de nivel |
| `tangentPlaneData` | `object` | Malla del plano tangente |
| `criticalPoints` | `array` | Puntos críticos clasificados |
| `showGradient` | `boolean` | Mostrar vectores gradiente |
| `showContours` | `boolean` | Mostrar curvas de nivel |
| `showTangentPlane` | `boolean` | Mostrar plano tangente |
| `showCriticalPoints` | `boolean` | Mostrar puntos críticos |

### IntegralVisualization

| Prop | Tipo | Descripción |
|------|------|-------------|
| `functionData` | `{x: number[], y: number[]}` | Datos de la función |
| `limits` | `[number, number]` | Límites de integración |
| `showRiemannSums` | `boolean` | Mostrar sumas de Riemann |
| `numRectangles` | `number` | Número de rectángulos |

---

## 🎯 Conclusión

Estos ejemplos cubren todos los casos de uso principales. ¡Combínalos y personalízalos según tus necesidades!

**Recuerda:**
- Los componentes son completamente reutilizables
- Todos los props son opcionales (tienen valores por defecto)
- Puedes combinar múltiples características en una sola visualización
- Los datos se obtienen del backend Flask mediante fetch/axios

¡Feliz codificación! 🚀

