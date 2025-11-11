/**
 * formatMath.ts
 * Utilidades para formatear expresiones matemáticas
 * 
 * Convierte sintaxis de Python/SymPy a LaTeX para renderizado con MathJax
 */

/**
 * Convierte una expresión matemática de Python a LaTeX
 * 
 * @param expression - Expresión en sintaxis Python (ej: "x**2 + sin(x)")
 * @returns Expresión en sintaxis LaTeX (ej: "x^{2} + \sin(x)")
 */
export const formatMathExpression = (expression: string): string => {
    if (!expression) return '';
  
    let formatted = expression;
  
    // Reemplazos básicos de operadores
    const replacements: [RegExp, string][] = [
      // Potencias: x**2 -> x^{2}
      [/\*\*(\d+)/g, '^{$1}'],
      [/\*\*\(([^)]+)\)/g, '^{$1}'],
      
      // Funciones trigonométricas
      [/\bsin\b/g, '\\sin'],
      [/\bcos\b/g, '\\cos'],
      [/\btan\b/g, '\\tan'],
      [/\bsinh\b/g, '\\sinh'],
      [/\bcosh\b/g, '\\cosh'],
      [/\btanh\b/g, '\\tanh'],
      [/\barcsin\b/g, '\\arcsin'],
      [/\barccos\b/g, '\\arccos'],
      [/\barctan\b/g, '\\arctan'],
      
      // Funciones exponenciales y logarítmicas
      [/\bexp\b/g, '\\exp'],
      [/\blog\b/g, '\\log'],
      [/\bln\b/g, '\\ln'],
      
      // Raíces y valores absolutos
      [/\bsqrt\(([^)]+)\)/g, '\\sqrt{$1}'],
      [/\babs\(([^)]+)\)/g, '|$1|'],
      
      // Constantes
      [/\bpi\b/g, '\\pi'],
      [/\be\b(?![a-zA-Z])/g, 'e'], // e no como exponencial sino como constante
      
      // Fracciones (básico)
      [/(\d+)\/(\d+)/g, '\\frac{$1}{$2}'],
      
      // Derivadas parciales
      [/d\/d([a-z])/g, '\\frac{\\partial}{\\partial $1}'],
      
      // Multiplicación implícita con paréntesis
      [/(\d)\(/g, '$1 \\cdot ('],
      [/\)(\d)/g, ') \\cdot $1'],
      [/([a-z])\(/g, '$1('], // Mantener para funciones
    ];
  
    // Aplicar todos los reemplazos
    for (const [pattern, replacement] of replacements) {
      formatted = formatted.replace(pattern, replacement);
    }
  
    return formatted;
  };
  
  /**
   * Formatea un número con precisión científica
   * 
   * @param value - Número a formatear
   * @param precision - Número de decimales
   * @returns String formateado
   */
  export const formatNumber = (value: number, precision: number = 6): string => {
    if (Math.abs(value) < 0.0001 || Math.abs(value) > 1000000) {
      return value.toExponential(precision);
    }
    return value.toFixed(precision);
  };
  
  /**
   * Convierte una matriz/vector a formato LaTeX
   * 
   * @param matrix - Array de arrays o array simple
   * @returns String en formato LaTeX de matriz
   */
  export const formatMatrix = (matrix: number[][] | number[]): string => {
    // Vector simple
    if (!Array.isArray(matrix[0])) {
      const vector = matrix as number[];
      const elements = vector.map(v => formatNumber(v)).join(' \\\\ ');
      return `\\begin{bmatrix} ${elements} \\end{bmatrix}`;
    }
  
    // Matriz
    const rows = (matrix as number[][]).map(row => 
      row.map(v => formatNumber(v)).join(' & ')
    ).join(' \\\\ ');
    
    return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
  };
  
  /**
   * Formatea un gradiente
   * 
   * @param gradient - Objeto con componentes del gradiente
   * @returns String en formato LaTeX
   */
  export const formatGradient = (gradient: { x?: string; y?: string; z?: string }): string => {
    const components = [];
    
    if (gradient.x) components.push(`\\frac{\\partial f}{\\partial x} = ${formatMathExpression(gradient.x)}`);
    if (gradient.y) components.push(`\\frac{\\partial f}{\\partial y} = ${formatMathExpression(gradient.y)}`);
    if (gradient.z) components.push(`\\frac{\\partial f}{\\partial z} = ${formatMathExpression(gradient.z)}`);
    
    return `\\nabla f = \\begin{bmatrix} ${components.join(' \\\\ ')} \\end{bmatrix}`;
  };
  
  /**
   * Detecta el tipo de expresión matemática
   * 
   * @param expression - Expresión a analizar
   * @returns Tipo de expresión
   */
  export const detectExpressionType = (expression: string): 
    'polynomial' | 'trigonometric' | 'exponential' | 'logarithmic' | 'mixed' => {
    
    if (/sin|cos|tan/.test(expression)) return 'trigonometric';
    if (/exp|e\^/.test(expression)) return 'exponential';
    if (/log|ln/.test(expression)) return 'logarithmic';
    if (/\*\*|\^/.test(expression) && !/sin|cos|exp|log/.test(expression)) return 'polynomial';
    
    return 'mixed';
  };
  
  /**
   * Limpia y normaliza una expresión matemática
   * Útil antes de enviar al backend
   * 
   * @param expression - Expresión a limpiar
   * @returns Expresión limpia
   */
  export const cleanExpression = (expression: string): string => {
    return expression
      .trim()
      .replace(/\s+/g, '') // Remover espacios
      .replace(/×/g, '*')   // Reemplazar símbolo de multiplicación
      .replace(/÷/g, '/')   // Reemplazar símbolo de división
      .replace(/²/g, '**2') // Reemplazar superíndices comunes
      .replace(/³/g, '**3');
  };
  
  /**
   * Valida si una expresión es segura para evaluar
   * Previene inyección de código
   * 
   * @param expression - Expresión a validar
   * @returns true si es segura
   */
  export const isSafeExpression = (expression: string): boolean => {
    // Lista negra de patrones peligrosos
    const dangerousPatterns = [
      /import\s/,
      /eval\s*\(/,
      /exec\s*\(/,
      /\_\_.*\_\_/, // Métodos dunder de Python
      /system\(/,
      /os\./,
      /subprocess/,
    ];
  
    return !dangerousPatterns.some(pattern => pattern.test(expression));
  };
  
  /**
   * Extrae variables de una expresión matemática
   * 
   * @param expression - Expresión a analizar
   * @returns Array de variables encontradas
   */
  export const extractVariables = (expression: string): string[] => {
    // Buscar letras individuales que no sean parte de funciones conocidas
    const knownFunctions = ['sin', 'cos', 'tan', 'exp', 'log', 'ln', 'abs', 'sqrt', 'sinh', 'cosh', 'tanh'];
    
    let cleaned = expression;
    knownFunctions.forEach(func => {
      cleaned = cleaned.replace(new RegExp(func, 'g'), '');
    });
  
    const variables = cleaned.match(/[a-z]/gi) || [];
    return [...new Set(variables)].sort(); // Únicas y ordenadas
  };
  
  /**
   * Formatea una expresión para display en UI
   * Versión más legible que LaTeX para inputs
   * 
   * @param expression - Expresión a formatear
   * @returns Expresión formateada para display
   */
  export const formatForDisplay = (expression: string): string => {
    return expression
      .replace(/\*\*/g, '^')
      .replace(/\*/g, '·')
      .replace(/sqrt\(([^)]+)\)/g, '√($1)');
  };
  
  export default {
    formatMathExpression,
    formatNumber,
    formatMatrix,
    formatGradient,
    detectExpressionType,
    cleanExpression,
    isSafeExpression,
    extractVariables,
    formatForDisplay,
  };