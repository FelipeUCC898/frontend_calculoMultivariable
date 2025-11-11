import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Slider, FormControlLabel, Switch } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as THREE from 'three';

interface IntegralVisualizationProps {
  functionData?: {
    x: number[];
    y: number[];
  } | null;
  limits?: [number, number];
  title?: string;
  showRiemannSums?: boolean;
  numRectangles?: number;
}

/**
 * IntegralVisualization: visualiza el área bajo la curva y sumas de Riemann
 */
const IntegralVisualization: React.FC<IntegralVisualizationProps> = ({
  functionData,
  limits = [-5, 5],
  title = 'Visualización de Integral',
  showRiemannSums = true,
  numRectangles = 10
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rectangleCount, setRectangleCount] = useState(numRectangles);
  const [showLeftSum, setShowLeftSum] = useState(true);
  const [showRightSum, setShowRightSum] = useState(false);
  const [showMidpointSum, setShowMidpointSum] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!functionData || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // Crear escena 2D (orthographic camera)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');

    // Calcular límites de la función
    const xMin = Math.min(...functionData.x);
    const xMax = Math.max(...functionData.x);
    const yMin = Math.min(...functionData.y, 0);
    const yMax = Math.max(...functionData.y);

    const aspectRatio = width / height;
    const viewHeight = (yMax - yMin) * 1.2;
    const viewWidth = viewHeight * aspectRatio;

    const camera = new THREE.OrthographicCamera(
      -viewWidth / 2,
      viewWidth / 2,
      viewHeight / 2,
      -viewHeight / 2,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Iluminación
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    // Crear ejes
    const axesGroup = new THREE.Group();

    // Eje X
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(xMin - 1, 0, 0),
      new THREE.Vector3(xMax + 1, 0, 0)
    ]);
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    axesGroup.add(xAxis);

    // Eje Y
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, yMin - 1, 0),
      new THREE.Vector3(0, yMax + 1, 0)
    ]);
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    axesGroup.add(yAxis);

    scene.add(axesGroup);

    // Crear curva de la función
    const curvePoints: THREE.Vector3[] = [];
    for (let i = 0; i < functionData.x.length; i++) {
      curvePoints.push(new THREE.Vector3(
        functionData.x[i],
        functionData.y[i],
        0
      ));
    }

    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMaterial = new THREE.LineBasicMaterial({
      color: theme.palette.primary.main,
      linewidth: 3
    });
    const curve = new THREE.Line(curveGeometry, curveMaterial);
    scene.add(curve);

    // Crear área bajo la curva (si está dentro de los límites)
    const [lowerLimit, upperLimit] = limits;
    const areaGroup = new THREE.Group();

    // Encontrar índices correspondientes a los límites
    const startIdx = functionData.x.findIndex(x => x >= lowerLimit);
    const endIdx = functionData.x.findIndex(x => x >= upperLimit);

    if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
      // Crear polígono del área
      const areaPoints: THREE.Vector3[] = [
        new THREE.Vector3(functionData.x[startIdx], 0, 0)
      ];

      for (let i = startIdx; i <= endIdx; i++) {
        areaPoints.push(new THREE.Vector3(
          functionData.x[i],
          functionData.y[i],
          0
        ));
      }

      areaPoints.push(new THREE.Vector3(functionData.x[endIdx], 0, 0));
      areaPoints.push(new THREE.Vector3(functionData.x[startIdx], 0, 0));

      const areaShape = new THREE.Shape();
      areaShape.moveTo(areaPoints[0].x, areaPoints[0].y);
      for (let i = 1; i < areaPoints.length; i++) {
        areaShape.lineTo(areaPoints[i].x, areaPoints[i].y);
      }

      const areaGeometry = new THREE.ShapeGeometry(areaShape);
      const areaMaterial = new THREE.MeshBasicMaterial({
        color: theme.palette.primary.main,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const areaMesh = new THREE.Mesh(areaGeometry, areaMaterial);
      areaGroup.add(areaMesh);
    }

    scene.add(areaGroup);

    // Crear rectángulos de Riemann si está habilitado
    if (showRiemannSums && rectangleCount > 0) {
      const dx = (upperLimit - lowerLimit) / rectangleCount;

      // Suma por la izquierda (Left Riemann Sum)
      if (showLeftSum) {
        for (let i = 0; i < rectangleCount; i++) {
          const x = lowerLimit + i * dx;
          const nextX = x + dx;

          // Encontrar el valor de la función en x
          const idx = functionData.x.findIndex(val => val >= x);
          if (idx !== -1 && functionData.y[idx] > 0) {
            const height = functionData.y[idx];

            // Crear rectángulo
            const rectShape = new THREE.Shape();
            rectShape.moveTo(x, 0);
            rectShape.lineTo(nextX, 0);
            rectShape.lineTo(nextX, height);
            rectShape.lineTo(x, height);
            rectShape.lineTo(x, 0);

            const rectGeometry = new THREE.ShapeGeometry(rectShape);
            const rectMaterial = new THREE.MeshBasicMaterial({
              color: 0x00ff00,
              transparent: true,
              opacity: 0.4,
              side: THREE.DoubleSide
            });
            const rectMesh = new THREE.Mesh(rectGeometry, rectMaterial);

            // Borde del rectángulo
            const edgeGeometry = new THREE.EdgesGeometry(rectGeometry);
            const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

            areaGroup.add(rectMesh);
            areaGroup.add(edges);
          }
        }
      }

      // Suma por la derecha (Right Riemann Sum)
      if (showRightSum) {
        for (let i = 1; i <= rectangleCount; i++) {
          const x = lowerLimit + (i - 1) * dx;
          const nextX = x + dx;

          // Encontrar el valor de la función en nextX
          const idx = functionData.x.findIndex(val => val >= nextX);
          if (idx !== -1 && functionData.y[idx] > 0) {
            const height = functionData.y[idx];

            const rectShape = new THREE.Shape();
            rectShape.moveTo(x, 0);
            rectShape.lineTo(nextX, 0);
            rectShape.lineTo(nextX, height);
            rectShape.lineTo(x, height);
            rectShape.lineTo(x, 0);

            const rectGeometry = new THREE.ShapeGeometry(rectShape);
            const rectMaterial = new THREE.MeshBasicMaterial({
              color: 0xff0000,
              transparent: true,
              opacity: 0.4,
              side: THREE.DoubleSide
            });
            const rectMesh = new THREE.Mesh(rectGeometry, rectMaterial);

            const edgeGeometry = new THREE.EdgesGeometry(rectGeometry);
            const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

            areaGroup.add(rectMesh);
            areaGroup.add(edges);
          }
        }
      }

      // Suma del punto medio (Midpoint Riemann Sum)
      if (showMidpointSum) {
        for (let i = 0; i < rectangleCount; i++) {
          const x = lowerLimit + i * dx;
          const midX = x + dx / 2;
          const nextX = x + dx;

          // Encontrar el valor de la función en midX
          const idx = functionData.x.findIndex(val => val >= midX);
          if (idx !== -1 && functionData.y[idx] > 0) {
            const height = functionData.y[idx];

            const rectShape = new THREE.Shape();
            rectShape.moveTo(x, 0);
            rectShape.lineTo(nextX, 0);
            rectShape.lineTo(nextX, height);
            rectShape.lineTo(x, height);
            rectShape.lineTo(x, 0);

            const rectGeometry = new THREE.ShapeGeometry(rectShape);
            const rectMaterial = new THREE.MeshBasicMaterial({
              color: 0xffaa00,
              transparent: true,
              opacity: 0.4,
              side: THREE.DoubleSide
            });
            const rectMesh = new THREE.Mesh(rectGeometry, rectMaterial);

            const edgeGeometry = new THREE.EdgesGeometry(rectGeometry);
            const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffaa00 });
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

            areaGroup.add(rectMesh);
            areaGroup.add(edges);
          }
        }
      }
    }

    // Renderizar escena
    renderer.render(scene, camera);

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [functionData, limits, rectangleCount, showLeftSum, showRightSum, showMidpointSum, theme]);

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(8,8,8,0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 35px 90px rgba(0,0,0,0.65)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(90deg, rgba(59,130,246,0.12), transparent)'
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>

      {/* Canvas container */}
      <div
        ref={containerRef}
        style={{
          height: 400,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!functionData && (
          <Box sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
            <Typography variant="h6">Visualización de Integral</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
              Ingrese una función para ver el área bajo la curva
            </Typography>
          </Box>
        )}
      </div>

      {/* Controls */}
      {functionData && showRiemannSums && (
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Número de rectángulos: {rectangleCount}
          </Typography>
          <Slider
            value={rectangleCount}
            onChange={(_, value) => setRectangleCount(value as number)}
            min={1}
            max={50}
            step={1}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showLeftSum}
                  onChange={(e) => setShowLeftSum(e.target.checked)}
                  sx={{ '& .MuiSwitch-thumb': { bgcolor: '#00ff00' } }}
                />
              }
              label={<Typography variant="caption">Suma Izquierda</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showRightSum}
                  onChange={(e) => setShowRightSum(e.target.checked)}
                  sx={{ '& .MuiSwitch-thumb': { bgcolor: '#ff0000' } }}
                />
              }
              label={<Typography variant="caption">Suma Derecha</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showMidpointSum}
                  onChange={(e) => setShowMidpointSum(e.target.checked)}
                  sx={{ '& .MuiSwitch-thumb': { bgcolor: '#ffaa00' } }}
                />
              }
              label={<Typography variant="caption">Suma Punto Medio</Typography>}
            />
          </Box>
        </Box>
      )}

      {/* Footer */}
      <Box
        sx={{
          p: 1.5,
          backgroundColor: 'rgba(5,5,5,0.85)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          {functionData ? 'Área bajo la curva visualizada' : 'Sin datos para visualizar'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default IntegralVisualization;

