/**
 * colors.ts
 * Paleta de colores inspirada en Vercel para toda la aplicación.
 * Centraliza los valores para reutilizarlos en componentes y tema MUI.
 */

export const vercelColors = {
  black: '#000000',
  white: '#ffffff',
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717'
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  accent: {
    pink: '#ec4899',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
    lime: '#84cc16'
  }
} as const;

export type VercelColorName = keyof typeof vercelColors;
