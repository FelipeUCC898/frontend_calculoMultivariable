# Frontend - Aplicación de Cálculo Multivariado

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend Flask corriendo en `http://localhost:5000`

### Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env (si no existe)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/          # Navbar, Footer
│   │   ├── MathInput.tsx    # Input para funciones matemáticas
│   │   ├── OperationButtons.tsx  # Botones de operaciones
│   │   ├── ResultViewer.tsx      # Visualizador de resultados
│   │   ├── SurfacePlot.tsx       # Visualización 3D (Three.js)
│   │   └── VariableSelector.tsx  # Selector de variables
│   ├── hooks/
│   │   └── useApi.ts        # Hook para comunicación con backend
│   ├── utils/
│   │   └── formatMath.ts    # Utilidades para formateo matemático
│   ├── styles/
│   │   └── theme.ts         # Tema Material-UI
│   ├── App.tsx              # Componente principal
│   └── main.tsx            # Punto de entrada
├── .env                    # Variables de entorno
├── package.json
└── vite.config.ts         # Configuración de Vite
```

---

## 🔌 Conexión con Backend

### Configuración

El frontend se conecta al backend Flask a través de:

1. **Variable de entorno**: `VITE_API_URL` en `.env`
2. **Proxy de Vite**: Configurado en `vite.config.ts` para desarrollo
3. **CORS**: Habilitado en el backend

### Endpoints Utilizados

- `GET /api/test` - Verificación de salud
- `POST /api/derivative` - Derivadas parciales
- `POST /api/integral` - Integrales
- `POST /api/gradient` - Gradientes
- `POST /api/limit` - Límites
- `POST /api/lagrange` - Optimización de Lagrange
- `POST /api/domain` - Dominio de funciones

---

## 🎨 Características

### ✅ Implementado

- ✅ Input de funciones matemáticas con validación
- ✅ Selector de variables (x, y, z)
- ✅ Botones para todas las operaciones
- ✅ Renderizado de resultados con MathJax
- ✅ Visualización 3D de superficies (Three.js)
- ✅ Manejo de errores y notificaciones
- ✅ Diseño responsivo y moderno
- ✅ Tema oscuro con acentos neón

### 🔮 Pendiente (Mejoras Futuras)

- ⏳ Input separado para Lagrange (función objetivo + restricción)
- ⏳ Selector de límites para integrales definidas
- ⏳ Input para puntos de evaluación
- ⏳ Historial de operaciones
- ⏳ Exportar resultados
- ⏳ Integración con IA para explicaciones

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Build
npm run build        # Construye para producción

# Testing
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos TypeScript

# Preview
npm run preview      # Previsualiza build de producción
```

---

## 📦 Dependencias Principales

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Material-UI v5** - Componentes UI
- **Axios** - Cliente HTTP
- **Three.js** - Visualización 3D
- **MathJax** - Renderizado de fórmulas matemáticas

---

## 🐛 Troubleshooting

### El backend no responde
1. Verifica que el backend esté corriendo: `curl http://localhost:5000/api/test`
2. Revisa la URL en `.env`: `VITE_API_URL=http://localhost:5000/api`
3. Verifica CORS en el backend

### MathJax no renderiza
- Espera unos segundos después de cargar la página
- Verifica la consola del navegador
- MathJax se carga desde CDN, verifica conexión a internet

### Errores de TypeScript
- Ejecuta `npm run type-check` para ver errores detallados
- Asegúrate de tener todas las dependencias instaladas

---

## 📝 Notas de Desarrollo

- El frontend usa **React 18** con **TypeScript**
- El estado se maneja con **hooks** de React
- Las peticiones HTTP se centralizan en `useApi.ts`
- El tema oscuro está configurado en `styles/theme.ts`
- MathJax se carga desde CDN en `index.html`

---

## 🔗 Enlaces Útiles

- [Documentación de React](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [Vite Docs](https://vitejs.dev)
- [MathJax Docs](https://docs.mathjax.org)
- [Three.js Docs](https://threejs.org/docs)

---

**Estado**: ✅ Frontend completamente funcional y conectado al backend
