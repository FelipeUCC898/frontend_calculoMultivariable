/**
 * Utilidades para normalizar los datos de graficación que provienen del backend.
 * Algunos endpoints devuelven { plot_data }, otros { mesh_data } y otros la malla directamente.
 * Estas funciones unifican la estructura para que Three.js solo reciba x/y/z compatibles.
 */

export interface SurfaceDataset {
  x: number[] | number[][];
  y: number[] | number[][];
  z: number[][];
}

const hasSurfaceShape = (payload: any): payload is SurfaceDataset => {
  return Boolean(
    payload &&
      payload.x !== undefined &&
      payload.y !== undefined &&
      payload.z !== undefined
  );
};

/**
 * Extrae recursivamente el bloque que contiene la malla (x,y,z) desde distintas estructuras.
 */
export const extractSurfaceDataset = (payload: any): SurfaceDataset | null => {
  if (!payload) return null;
  if (hasSurfaceShape(payload)) {
    return payload;
  }
  if (payload.mesh_data) {
    return extractSurfaceDataset(payload.mesh_data);
  }
  if (payload.plot_data) {
    return extractSurfaceDataset(payload.plot_data);
  }
  if (payload.data) {
    return extractSurfaceDataset(payload.data);
  }
  return null;
};

/**
 * Intenta garantizar que x/y/z sean matrices bidimensionales para simplificar la renderización.
 * Si recibe arreglos unidimensionales los replica tantas filas como requiera z.
 */
export const normalizeSurfaceDataset = (dataset: SurfaceDataset | null): SurfaceDataset | null => {
  if (!dataset || !dataset.z?.length) {
    return null;
  }

  const rows = dataset.z.length;
  const cols = dataset.z[0]?.length || 0;

  const ensureMatrix = (axis: number[] | number[][] | undefined): number[][] => {
    if (!axis) {
      const fallback: number[][] = [];
      for (let i = 0; i < rows; i++) {
        fallback.push(Array.from({ length: cols }, (_, j) => j));
      }
      return fallback;
    }
    if (Array.isArray(axis) && axis.length > 0 && typeof axis[0] !== 'number') {
      return axis as number[][];
    }
    const asArray = axis as number[];
    const matrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      if (cols === 0) {
        matrix.push([...asArray]);
      } else {
        matrix.push(asArray.slice(0, cols));
      }
    }
    return matrix;
  };

  return {
    x: ensureMatrix(dataset.x),
    y: ensureMatrix(dataset.y),
    z: dataset.z,
  };
};
