import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Refresh,
  ZoomIn,
  ZoomOut,
  ThreeDRotation,
  GridOn
} from '@mui/icons-material';
import * as THREE from 'three';
import type { SurfaceDataset } from '../utils/plotData';
import { normalizeSurfaceDataset } from '../utils/plotData';

interface SurfacePlotProps {
  data?: SurfaceDataset | null;
  meshData?: SurfaceDataset | null;
  gradientData?: {
    x: number[][];
    y: number[][];
    z: number[][];
    u: number[][];
    v: number[][];
    w: number[][];
  } | any;
  contourData?: {
    x: number[][];
    y: number[][];
    z: number[][];
    levels: number[];
  } | null;
  tangentPlaneData?: {
    mesh: {
      x: number[][];
      y: number[][];
      z: number[][];
      point: { x: number; y: number; z: number };
    };
  } | null;
  criticalPoints?: Array<{
    point: { [key: string]: number };
    classification: string;
    value: number;
  }> | null;
  title?: string;
  showGrid?: boolean;
  showGradient?: boolean;
  showContours?: boolean;
  showTangentPlane?: boolean;
  showCriticalPoints?: boolean;
  onReady?: () => void;
}

/**
 * Crea un sprite de texto para etiquetas en 3D
 */
const createTextSprite = (text: string, color: number): THREE.Sprite => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return new THREE.Sprite();
  }
  
  canvas.width = 256;
  canvas.height = 64;
  
  context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
  context.font = 'Bold 24px Arial';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(1, 0.25, 1);
  
  return sprite;
};

/**
 * SurfacePlot: renderiza una malla 3D usando Three.js.
 * - Espera meshData con { x: number[][], y: number[][], z: number[][] }.
 * - Crea BufferGeometry con posiciones e índices.
 * - Usa OrbitControls (import dinámico) para interacción.
 * - Maneja resize y cleanup.
 */
const SurfacePlot: React.FC<SurfacePlotProps> = ({
  data,
  meshData,
  gradientData,
  contourData,
  tangentPlaneData,
  criticalPoints,
  title = 'Visualización 3D',
  showGrid = true,
  showGradient = true,
  showContours = false,
  showTangentPlane = false,
  showCriticalPoints = true,
  onReady
}) => {
  // contenedor DOM (div) donde se anexa el canvas de three.js
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const theme = useTheme();

  const resolvedSurface = useMemo(() => normalizeSurfaceDataset(meshData ?? data ?? null), [data, meshData]);

  useEffect(() => {
    const currentData = resolvedSurface;
    if (!currentData) return;

    const container = containerRef.current;
    if (!container) return;

    console.log('[SurfacePlot] Inicializando escena Three.js');

    // Dimensiones
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // Escena y cámara
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(5, 5, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // controls será inicializado dinámicamente
    let controls: any = null;

    // Import dinámico para OrbitControls (reduce problemas de tipado en build)
    import('three/examples/jsm/controls/OrbitControls')
      .then((module) => {
        const OrbitControls = module.OrbitControls;
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
      })
      .catch((e) => {
        console.warn('[SurfacePlot] No se pudo cargar OrbitControls dinámicamente:', e);
      });

    // Iluminación
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    // Grid y ejes
    if (showGrid) {
      const grid = new THREE.GridHelper(
        10,
        10,
        new THREE.Color(theme.palette.primary.main),
        new THREE.Color('#1f2937')
      );
      (grid.material as any).opacity = 0.25;
      (grid.material as any).transparent = true;
      scene.add(grid);
    }
    const axes = new THREE.AxesHelper(3);
    scene.add(axes);

    // Función que crea BufferGeometry a partir de matrices x,y,z
    const createSurfaceGeometry = (xIn: any, yIn: any, zIn: any): THREE.BufferGeometry => {
      const zs: number[][] = zIn || [];
      // Normalize x,y to be 2D arrays aligned with z
      let xs: number[][] = [];
      let ys: number[][] = [];

      // Si xIn es 1D (array de numbers) y z es 2D -> expandir x
      if (Array.isArray(xIn) && xIn.length > 0 && typeof xIn[0] === 'number') {
        const cols = (zs && zs[0]) ? zs[0].length : xIn.length;
        const rows = zs.length || 0;
        for (let i = 0; i < rows; i++) {
          // slice en caso de que xIn tenga más elementos
          xs.push((xIn as number[]).slice(0, cols));
        }
      } else {
        xs = xIn as number[][];
      }

      if (Array.isArray(yIn) && yIn.length > 0 && typeof yIn[0] === 'number') {
        const cols = (zs && zs[0]) ? zs[0].length : yIn.length;
        const rows = zs.length || 0;
        for (let i = 0; i < rows; i++) {
          ys.push((yIn as number[]).slice(0, cols));
        }
      } else {
        ys = yIn as number[][];
      }

      const rows = zs.length;
      const cols = rows > 0 ? zs[0].length : 0;

      const positions = new Float32Array(rows * cols * 3);
      let ptr = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const xv = (xs[i] && xs[i][j] !== undefined) ? xs[i][j] : (xs[0] ? xs[0][j] : j);
          // Intercambiar Y y Z para que la gráfica aparezca horizontal
          const yv = (zs[i] && zs[i][j] !== undefined) ? zs[i][j] : 0; // Z se mapea a Y
          const zv = (ys[i] && ys[i][j] !== undefined) ? ys[i][j] : (ys[0] ? ys[0][j] : i); // Y se mapea a Z
          positions[ptr++] = xv;
          positions[ptr++] = yv;
          positions[ptr++] = zv;
        }
      }

      const indices: number[] = [];
      // Al crear índices, omitir triángulos que contengan vértices no finitos (NaN/Inf).
      const isVertexFinite = (idx: number) => {
        const vx = positions[idx * 3 + 0];
        const vy = positions[idx * 3 + 1];
        const vz = positions[idx * 3 + 2];
        return Number.isFinite(vx) && Number.isFinite(vy) && Number.isFinite(vz);
      };

      for (let i = 0; i < rows - 1; i++) {
        for (let j = 0; j < cols - 1; j++) {
          const a = i * cols + j;
          const b = (i + 1) * cols + j;
          const c = i * cols + (j + 1);
          const d = (i + 1) * cols + (j + 1);
          // Triángulo (a,b,c)
          if (isVertexFinite(a) && isVertexFinite(b) && isVertexFinite(c)) {
            indices.push(a, b, c);
          }
          // Triángulo (b,d,c)
          if (isVertexFinite(b) && isVertexFinite(d) && isVertexFinite(c)) {
            indices.push(b, d, c);
          }
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      return geometry;
    };

    // Crear geometría y añadir malla
    try {
      console.log('[SurfacePlot] Creando geometría desde meshData');
      const geom = createSurfaceGeometry(currentData.x || [], currentData.y || [], currentData.z || []);
      const material = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.1,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geom, material);
      scene.add(mesh);

      console.log('[SurfacePlot] Malla añadida a la escena (mesh loaded)');

      // Ajustar cámara en base a boundingSphere
      geom.computeBoundingSphere();
      const bs = geom.boundingSphere;
      if (bs) {
        const r = bs.radius;
        camera.position.set(r * 1.5, r * 1.2, r * 2.0);
        camera.lookAt(bs.center);
      }

      // Renderizar puntos críticos si están disponibles
      if (showCriticalPoints && criticalPoints && criticalPoints.length > 0) {
        console.log(`[SurfacePlot] Renderizando ${criticalPoints.length} puntos críticos`);
        
        criticalPoints.forEach((cp) => {
          try {
            const x = cp.point.x || 0;
            const y = cp.point.y || 0;
            const z = cp.value || 0;
            
            // Color según clasificación
            let color = 0xffff00; // amarillo por defecto
            if (cp.classification === 'máximo local') {
              color = 0xff0000; // rojo para máximo
            } else if (cp.classification === 'mínimo local') {
              color = 0x00ff00; // verde para mínimo
            } else if (cp.classification === 'punto silla') {
              color = 0xff00ff; // magenta para punto silla
            }
            
            // Crear esfera en el punto crítico
            const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const sphereMaterial = new THREE.MeshStandardMaterial({
              color: color,
              emissive: color,
              emissiveIntensity: 0.5,
              metalness: 0.8,
              roughness: 0.2
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(x, z, y); // Intercambiar Y y Z
            scene.add(sphere);
            
            // Agregar etiqueta con clasificación
            const spriteText = createTextSprite(cp.classification, color);
            spriteText.position.set(x, z + 0.5, y);
            scene.add(spriteText);
            
          } catch (cpError) {
            console.error('[SurfacePlot] Error renderizando punto crítico:', cpError);
          }
        });
      }
      
      // Renderizar plano tangente si está disponible
      if (showTangentPlane && tangentPlaneData && tangentPlaneData.mesh) {
        console.log('[SurfacePlot] Renderizando plano tangente');
        
        try {
          const planeGeom = createSurfaceGeometry(
            tangentPlaneData.mesh.x,
            tangentPlaneData.mesh.y,
            tangentPlaneData.mesh.z
          );
          
          const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            metalness: 0.3,
            roughness: 0.7
          });
          
          const planeMesh = new THREE.Mesh(planeGeom, planeMaterial);
          scene.add(planeMesh);
          
          // Marcar el punto de tangencia
          if (tangentPlaneData.mesh.point) {
            const pointGeometry = new THREE.SphereGeometry(0.12, 16, 16);
            const pointMaterial = new THREE.MeshStandardMaterial({
              color: 0xffaa00,
              emissive: 0xffaa00,
              emissiveIntensity: 0.7
            });
            const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
            pointMesh.position.set(
              tangentPlaneData.mesh.point.x,
              tangentPlaneData.mesh.point.z,
              tangentPlaneData.mesh.point.y
            );
            scene.add(pointMesh);
          }
          
        } catch (planeError) {
          console.error('[SurfacePlot] Error renderizando plano tangente:', planeError);
        }
      }
      
      // Renderizar curvas de nivel si están disponibles
      if (showContours && contourData && contourData.levels && contourData.x) {
        console.log(`[SurfacePlot] Renderizando ${contourData.levels.length} curvas de nivel`);
        
        try {
          const { x, y, z, levels } = contourData;
          
          // Crear líneas de contorno para cada nivel
          levels.forEach((level: number, idx: number) => {
            // Color interpolado del azul al rojo según el nivel
            const t = idx / (levels.length - 1);
            const color = new THREE.Color();
            color.setHSL(0.6 - t * 0.6, 1.0, 0.5); // De azul a rojo
            
            // Encontrar puntos en este nivel (usando un threshold)
            const contourPoints: THREE.Vector3[] = [];
            
            for (let i = 0; i < z.length - 1; i++) {
              for (let j = 0; j < z[0].length - 1; j++) {
                const z1 = z[i][j];
                const z2 = z[i + 1][j];
                const z3 = z[i][j + 1];
                
                // Verificar si el nivel cruza esta celda
                const threshold = 0.1;
                if ((z1 <= level + threshold && z2 >= level - threshold) ||
                    (z1 >= level - threshold && z2 <= level + threshold)) {
                  const t_interp = (level - z1) / (z2 - z1 + 0.001);
                  const x_interp = x[i][j] + t_interp * (x[i + 1][j] - x[i][j]);
                  const y_interp = y[i][j] + t_interp * (y[i + 1][j] - y[i][j]);
                  
                  contourPoints.push(new THREE.Vector3(x_interp, level, y_interp));
                }
              }
            }
            
            // Crear línea si hay suficientes puntos
            if (contourPoints.length > 2) {
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(contourPoints);
              const lineMaterial = new THREE.LineBasicMaterial({
                color: color,
                linewidth: 2,
                transparent: true,
                opacity: 0.7
              });
              const line = new THREE.Line(lineGeometry, lineMaterial);
              scene.add(line);
            }
          });
          
        } catch (contourError) {
          console.error('[SurfacePlot] Error renderizando curvas de nivel:', contourError);
        }
      }

      // Renderizar vectores de gradiente si están disponibles
      if (showGradient && gradientData && gradientData.x && gradientData.y && gradientData.z && gradientData.u && gradientData.v) {
        console.log('[SurfacePlot] Renderizando vectores de gradiente');
        
        // Crear grupo para los vectores
        const gradientGroup = new THREE.Group();
        scene.add(gradientGroup);

        try {
          // Extraer datos del gradiente
          const { x, y, z, u, v, w } = gradientData;
          
          // Validar estructura de datos
          if (!Array.isArray(x) || !Array.isArray(y) || !Array.isArray(z) ||
              !Array.isArray(u) || !Array.isArray(v) || x.length === 0) {
            throw new Error('Estructura de datos de gradiente inválida');
          }
          
          // Determinar resolución óptima basada en los datos
          const rows = x.length;
          const cols = x[0] ? x[0].length : 0;
          
          if (rows === 0 || cols === 0) {
            throw new Error('Datos de gradiente vacíos');
          }
          
          // Configurar resolución para mejor visualización del campo vectorial
          // Con backend generando 15x15 = 225 puntos, mostramos la mayoría
          const step = Math.max(1, Math.floor(Math.min(rows, cols) / 15)); // Más denso
          const maxArrows = Math.min(225, rows * cols); // Permitir hasta 225 flechas
          
          console.log(`[SurfacePlot] Grid: ${rows}x${cols}, step: ${step}, max arrows: ${maxArrows}`);
          
          let arrowCount = 0;
          let skippedCount = 0;
          
          // Crear flechas en una cuadrícula
          for (let i = 0; i < rows && arrowCount < maxArrows; i += step) {
            for (let j = 0; j < cols && arrowCount < maxArrows; j += step) {
              // Validar que los datos existen y son finitos
              if (x[i] && x[i][j] !== undefined &&
                  y[i] && y[i][j] !== undefined &&
                  z[i] && z[i][j] !== undefined &&
                  u[i] && u[i][j] !== undefined &&
                  v[i] && v[i][j] !== undefined &&
                  Number.isFinite(x[i][j]) &&
                  Number.isFinite(y[i][j]) &&
                  Number.isFinite(z[i][j]) &&
                  Number.isFinite(u[i][j]) &&
                  Number.isFinite(v[i][j])) {
                
                // Posición de origen (punto en la superficie)
                const origin = new THREE.Vector3(
                  x[i][j],
                  z[i][j],  // Usar z como coordenada Y para la superficie
                  y[i][j]   // Usar y como coordenada Z
                );
                
                // Vector dirección del gradiente
                const dir = new THREE.Vector3(
                  u[i][j],
                  0,        // Componente Y del gradiente para visualización 2D
                  v[i][j]   // Componente Z del gradiente
                );
                
                // Normalizar la dirección
                if (dir.length() > 0) {
                  dir.normalize();
                  
                  // Determinar la longitud de la flecha basada en la magnitud del gradiente
                  // Flechas más grandes para mejor visualización
                  const magnitude = Math.sqrt(u[i][j] * u[i][j] + v[i][j] * v[i][j]);
                  const arrowLength = Math.min(1.5, Math.max(0.3, magnitude * 0.25));
                  
                  // Validar longitud de flecha razonable
                  if (arrowLength > 0.01) {
                    // Color basado en la magnitud del gradiente
                    const color = new THREE.Color();
                    const normalizedMag = Math.min(1, magnitude / 3); // Normalizar a [0,1]
                    color.setHSL(0.0 + 0.6 * normalizedMag, 1.0, 0.5 * (1 - normalizedMag) + 0.3); // De rojo (grande) a azul (pequeño)
                    
                    // Crear flecha
                    const arrow = new THREE.ArrowHelper(
                      dir,
                      origin,
                      arrowLength,
                      color.getHex()
                    );
                    
                    gradientGroup.add(arrow);
                    arrowCount++;
                  }
                }
              } else {
                skippedCount++;
              }
            }
          }
          
          console.log(`[SurfacePlot] Flechas: ${arrowCount} creadas, ${skippedCount} saltadas de ${rows * cols} puntos totales`);
          
          if (arrowCount === 0) {
            console.warn('[SurfacePlot] No se crearon vectores de gradiente - datos inválidos');
          }
          
        } catch (gradError) {
          console.error('[SurfacePlot] Error renderizando vectores de gradiente:', gradError);
          // Remover grupo vacío si hay error
          if (gradientGroup.parent) {
            scene.remove(gradientGroup);
          }
        }
      } else {
        if (gradientData) {
          console.log('[SurfacePlot] Datos de gradiente incompletos, saltando visualización de vectores');
        }
      }

      // Loop de animación
      let mounted = true;
      const animate = () => {
        if (!mounted) return;
        requestAnimationFrame(animate);
        if (controls && controls.update) controls.update();
        renderer.render(scene, camera);
      };
      animate();

      console.log('[SurfacePlot] Loop de render iniciado');

      // Resize handler
      const handleResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight || 400;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup al desmontar o al re-render del useEffect
      return () => {
        mounted = false;
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        geom.dispose();
        material.dispose();
        if (controls && controls.dispose) controls.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    } catch (err) {
      console.error('[SurfacePlot] Error creando la geometría:', err);
    }
  }, [resolvedSurface, gradientData, contourData, tangentPlaneData, criticalPoints, showGrid, showGradient, showContours, showTangentPlane, showCriticalPoints, onReady, theme]);

  const handleReset = () => {
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

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
      {/* Header con controles */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThreeDRotation sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Acercar">
            <IconButton size="small" onClick={handleZoomIn} sx={{ color: theme.palette.text.secondary }}>
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Alejar">
            <IconButton size="small" onClick={handleZoomOut} sx={{ color: theme.palette.text.secondary }}>
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reiniciar vista">
            <IconButton size="small" onClick={handleReset} sx={{ color: theme.palette.text.secondary }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle grid">
            <IconButton size="small" sx={{ color: showGrid ? theme.palette.primary.main : theme.palette.text.secondary }}>
              <GridOn />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Contenedor para el canvas (div) */}
      <div
        ref={containerRef}
        className="surface-plot"
        style={{
          height: 400,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Si no hay datos, mostrar placeholder */}
        {!resolvedSurface && (
          <Box sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                opacity: 0.4,
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ fontSize: '3rem', mb: 2 }}>📊</Box>
              <Typography variant="h6">Visualización 3D</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
                Ingrese una función para ver la gráfica
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: 'rgba(59,130,246,0.08)',
                  borderRadius: '8px',
                  display: 'inline-block',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  💡 Integración con Three.js lista
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </div>

      {/* Footer con info */}
      <Box
        sx={{
          p: 1.5,
          backgroundColor: 'rgba(5,5,5,0.85)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          {resolvedSurface ? 'Usa el mouse para rotar • Scroll para zoom' : 'Sin datos para visualizar'}
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
          Zoom: {(zoom * 100).toFixed(0)}%
        </Typography>
      </Box>
    </Paper>
  );
};

export default SurfacePlot;
