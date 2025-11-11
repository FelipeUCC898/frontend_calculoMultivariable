/**
 * useApi.ts
 * Hook personalizado para manejar comunicación con el backend Flask
 * 
 * Proporciona una interfaz tipo para realizar operaciones matemáticas
 * con manejo de estado de carga y errores
 */

import { useState } from 'react';
import { AxiosError } from 'axios';
import api from '../services/api';
import { extractSurfaceDataset, normalizeSurfaceDataset } from '../utils/plotData';
import type { SurfaceDataset } from '../utils/plotData';

// Usar la instancia de API configurada con interceptors
const apiClient = api;

/**
 * Tipos de operaciones disponibles
 */
export type MathOperation = 
  | 'derivative' 
  | 'integral' 
  | 'gradient' 
  | 'limit' 
  | 'lagrange' 
  | 'domain';

/**
 * Estructura de la respuesta del backend Flask
 * Cada endpoint devuelve una estructura específica
 */
export interface ApiResponse {
  // Respuesta de /derivative
  derivative?: {
    symbolic: string;
    value?: number;
  };
  
  // Respuesta de /integral
  integral?: string;
  
  // Respuesta de /gradient
  gradient?: {
    symbolic: string[];
    value?: number[];
  };
  
  // Respuesta de /limit
  limit_result?: {
    function: string;
    variable: string;
    limit_to: string;
    limit: string;
  };
  
  // Respuesta de /lagrange
  optimization_result?: {
    solutions: Array<{
      point: Record<string, string>;
      lambda: string;
      objective_value: string;
    }>;
  };
  
  // Respuesta de /domain
  domain?: {
    domain_heuristic: string;
  };
  
  // Campos comunes
  function?: string;
  respect_to?: string | string[];
  variables?: string[];
  error?: string;
  message?: string;
  operation?: MathOperation; // Campo interno para identificar la operación
  plot_data?: any; // Datos para visualización 3D
}

/**
 * Parámetros para las operaciones matemáticas
 */
export interface MathOperationParams {
  function: string;
  respect_to?: string | string[]; // Variable(s) para derivada, integral, límite
  variables?: string[]; // Variables para gradient, lagrange
  point?: number | Record<string, number>; // Punto para evaluación o límite
  limits?: number[] | number[][]; // Límites para integrales
  constraints?: string[]; // Restricciones para Lagrange
  direction?: string; // Dirección para límites ('+' o '-')
  // Parámetros específicos para Lagrange
  objective_function?: string;
  constraint_function?: string;
  constraint_value?: string;
  // Agregar más parámetros según necesidad
}

/**
 * Hook personalizado para operaciones matemáticas
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  /**
   * Ejecuta una operación matemática
   * 
   * @param operation - Tipo de operación a realizar
   * @param params - Parámetros de la operación
   * @returns Promesa con la respuesta del backend
   */
  const executeOperation = async (
    operation: MathOperation,
    params: MathOperationParams
  ): Promise<ApiResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      // Preparar payload según la operación
      let payload: any = { ...params };
      
      // Ajustar payload para operaciones específicas
      if (operation === 'gradient') {
        // Gradient necesita variables como array
        payload.variables = params.variables || ['x', 'y'];
      } else if (operation === 'lagrange') {
        // Lagrange necesita objective_function, constraint_function, constraint_value, variables
        payload = {
          objective_function: params.objective_function || params.function,
          constraint_function: params.constraint_function || params.constraints?.[0] || '',
          constraint_value: params.constraint_value || '0',
          variables: params.variables || ['x', 'y']
        };
      } else if (operation === 'limit') {
        // Limit necesita variable y limit_to
        payload = {
          function: params.function,
          variable: params.respect_to || 'x',
          limit_to: params.point?.toString() || '0',
          direction: params.direction
        };
      } else if (operation === 'integral') {
        // Integral puede tener respect_to como string o array
        if (typeof params.respect_to === 'string') {
          payload.respect_to = [params.respect_to];
        }
      }
      
      // Realizar la petición POST al endpoint correspondiente
      const response = await apiClient.post<ApiResponse>(`/${operation}`, payload);
      
      // Normalizar la respuesta para que sea consistente
      const normalizedData: ApiResponse = {
        ...response.data,
        // Agregar campos adicionales para facilitar el renderizado
        operation,
      };
      
      setData(normalizedData);
      return normalizedData;

    } catch (err) {
      // Manejo de errores tipado
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error?: string; message?: string; details?: any }>;
        
        if (axiosError.response) {
          // Error del servidor (4xx, 5xx)
          const errorData = axiosError.response.data;
          let errorMessage = errorData?.error || errorData?.message;
          
          if (!errorMessage) {
            errorMessage = `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
          }
          
          // Si hay detalles, agregarlos
          if (errorData?.details) {
            errorMessage += ` - ${JSON.stringify(errorData.details)}`;
          }
          
          setError(errorMessage);
        } else if (axiosError.request) {
          // No se recibió respuesta
          setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:5000');
        } else {
          // Error en la configuración
          setError('Error al configurar la petición');
        }
      } else {
        setError('Error desconocido');
      }

      console.error('Error en executeOperation:', err);
      setData(null);
      return null;

    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpia el estado del hook
   */
  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    data,
    executeOperation,
    reset,
  };
};

/**
 * Hook simplificado para operaciones específicas
 * Útil cuando solo necesitas una operación en particular
 */
export const useDerivative = () => {
  const { loading, error, data, executeOperation } = useApi();

  const calculateDerivative = async (func: string, variable: string) => {
    return executeOperation('derivative', {
      function: func,
      respect_to: variable,
    });
  };

  return { loading, error, data, calculateDerivative };
};

export const useIntegral = () => {
  const { loading, error, data, executeOperation } = useApi();

  const calculateIntegral = async (func: string, variable: string) => {
    return executeOperation('integral', {
      function: func,
      respect_to: variable,
    });
  };

  return { loading, error, data, calculateIntegral };
};

export const useGradient = () => {
  const { loading, error, data, executeOperation } = useApi();

  const calculateGradient = async (func: string) => {
    return executeOperation('gradient', {
      function: func,
    });
  };

  return { loading, error, data, calculateGradient };
};

/**
 * Función auxiliar para verificar la disponibilidad del backend
 * Útil para mostrar un mensaje de estado en la UI
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    // El backend tiene un endpoint /test para verificar disponibilidad
    await apiClient.get('/test');
    return true;
  } catch (error) {
    console.error('Backend no disponible:', error);
    return false;
  }
};

export default useApi;

/**
 * Fetch mesh data directly from backend (/mesh).
 * Este helper se exporta por conveniencia para llamadas ad-hoc desde componentes.
 */
export const fetchMeshData = async (
  expression: string,
  variables: string[],
  ranges: Record<string, any>
): Promise<SurfaceDataset> => {
  try {
    const payload = {
      expression,
      variables,
      range: ranges,
    };

    const resp = await apiClient.post('/mesh', payload);
    const normalized = normalizeSurfaceDataset(extractSurfaceDataset(resp.data));

    if (!normalized) {
      throw new Error('Respuesta de malla inválida. El backend no envió x/y/z.');
    }

    return normalized;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        const respData: any = axiosError.response.data;
        throw new Error(respData?.error || respData?.message || 'Error fetching mesh');
      } else if (axiosError.request) {
        throw new Error('No response from server');
      }
    }
    throw err;
  }
};

/**
 * Send prompt to AI assistant
 * Helper function for AI chat functionality
 */
export const sendPromptToAI = async (prompt: string): Promise<string> => {
  try {
    const response = await apiClient.post('/ai/chat', { prompt });
    return response.data.response;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        const respData: any = axiosError.response.data;
        throw new Error(respData?.error || respData?.message || 'Error communicating with AI');
      } else if (axiosError.request) {
        throw new Error('No response from AI server');
      }
    }
    throw err;
  }
};

/**
 * Query Wolfram Alpha for mathematical computations
 * Helper function for Wolfram integration
 */
export const queryWolfram = async (query: string): Promise<{ query: string; result: string }> => {
  try {
    const response = await apiClient.post('/wolfram/query', { query });
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        const respData: any = axiosError.response.data;
        throw new Error(respData?.error || respData?.message || 'Error querying Wolfram');
      } else if (axiosError.request) {
        throw new Error('No response from Wolfram server');
      }
    }
    throw err;
  }
};

/**
 * Fetch gradient data with vector field for 3D visualization
 * Helper function for gradient visualization
 */
export const fetchGradientData = async (
  expression: string,
  variables: string[] = ['x', 'y'],
  ranges: Record<string, any> = { x: [-5, 5], y: [-5, 5] }
) => {
  try {
    const payload = {
      function: expression,
      variables: variables,
    };

    const response = await apiClient.post('/gradient', payload);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        const respData: any = axiosError.response.data;
        throw new Error(respData?.error || respData?.message || 'Error fetching gradient data');
      } else if (axiosError.request) {
        throw new Error('No response from server');
      }
    }
    throw err;
  }
};
