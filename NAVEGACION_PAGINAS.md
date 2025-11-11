# 🧭 Sistema de Navegación - Calculadora Multivariable

## ✅ **Implementado Exitosamente**

Se ha creado un sistema de navegación funcional con 4 páginas/vistas principales.

---

## 📄 **Páginas Disponibles**

### 1. **Página de Inicio (`HomePage`)**
**Ruta:** Estado `currentPage = 'home'`

**Contenido:**
- Hero section con presentación del proyecto
- Estadísticas clave (10+ operaciones, 50+ funciones, etc.)
- Características principales con iconos
- Beneficios para estudiantes
- Call to Action para comenzar a calcular

**Acciones:**
- Botón "Comenzar a Calcular" → Lleva a la calculadora
- Botón "Ver Documentación" → Lleva a Docs
- Navegación desde Navbar: Botón "Inicio"

---

### 2. **Página de Documentación (`DocsPage`)**
**Ruta:** Estado `currentPage = 'docs'`

**Contenido:**
- Guía de sintaxis de funciones (x**2, sin(), cos(), etc.)
- Lista de operaciones disponibles con ejemplos
- Explicación de visualizaciones 3D
- Ejemplos prácticos (Paraboloide, Silla de Montar, etc.)
- Acordeones expandibles para mejor organización

**Acciones:**
- Navegación desde Navbar: Botón "Docs"
- Enlaces del Footer: "Documentación" y "Guía de uso"

---

### 3. **Página Sobre el Proyecto (`AboutPage`)**
**Ruta:** Estado `currentPage = 'about'`

**Contenido:**
- Descripción del proyecto académico
- Objetivos y metas
- Características técnicas
- Stack tecnológico (Frontend + Backend)
- Logros del proyecto
- Enlaces a API Docs y código fuente

**Acciones:**
- Navegación desde Navbar: Botón "Sobre el proyecto"
- Enlaces del Footer: "GitHub" y "Código fuente"

---

### 4. **Calculadora (`Calculator`)**
**Ruta:** Estado `currentPage = 'calculator'`

**Contenido:**
- Sidebar fijo con controles (solo visible en esta vista)
- Input de función
- Selector de variable
- Botones de operaciones
- Visualización 3D grande
- ResultViewer debajo de la gráfica

**Acciones:**
- Desde HomePage: Botón "Comenzar a Calcular"
- Desde cualquier página: Haciendo cálculos

---

## 🔧 **Implementación Técnica**

### **Estado de Navegación**

```typescript
const [currentPage, setCurrentPage] = useState<'calculator' | 'home' | 'docs' | 'about'>('home');
```

### **Renderizado Condicional**

```typescript
{currentPage === 'home' && <HomePage />}
{currentPage === 'docs' && <DocsPage />}
{currentPage === 'about' && <AboutPage />}
{currentPage === 'calculator' && <Calculator />}
```

### **Sidebar Condicional**

El sidebar solo se muestra cuando `currentPage === 'calculator'`:

```typescript
{currentPage === 'calculator' && (
  <Box sx={{ /* sidebar styles */ }}>
    {/* Controles de la calculadora */}
  </Box>
)}
```

### **Margen Dinámico**

El área principal ajusta su margin-left según la página:

```typescript
marginLeft: { 
  xs: 0, 
  md: currentPage === 'calculator' ? '380px' : 0 
}
```

---

## 🎨 **Navbar con Indicadores**

Los botones del navbar muestran qué página está activa:

```typescript
<Button
  onClick={() => onNavigate?.('home')}
  sx={{
    color: currentPage === 'home' 
      ? theme.palette.primary.main 
      : theme.palette.text.secondary,
    backgroundColor: currentPage === 'home' 
      ? 'rgba(59, 130, 246, 0.15)' 
      : 'transparent',
  }}
>
  Inicio
</Button>
```

**Estado Activo:**
- Color: Azul primario
- Background: Azul con 15% opacidad
- Hover: Azul con 8% opacidad

---

## 🔗 **Enlaces del Footer**

| Enlace | Destino | Tipo |
|--------|---------|------|
| **Documentación** | DocsPage | Navegación interna |
| **Guía de uso** | DocsPage | Navegación interna |
| **API Reference** | http://localhost:5000/api/docs | Enlace externo |
| **GitHub** | AboutPage | Navegación interna |
| **Código fuente** | AboutPage | Navegación interna |

---

## 📱 **Responsive**

### **Desktop (≥ 960px)**
- Navbar completo con todos los botones
- Sidebar visible en calculadora (380px)
- Layout horizontal óptimo

### **Mobile (< 960px)**
- Navbar adaptado (botones ocultos en xs)
- Sin sidebar en mobile
- Layout vertical
- Contenido apilado

---

## 🎯 **Flujo de Usuario Recomendado**

### **Usuario Nuevo:**
```
1. Llega a HomePage (inicio)
   ↓
2. Lee características y beneficios
   ↓
3. Click en "Ver Documentación"
   ↓
4. Aprende sintaxis y operaciones
   ↓
5. Click en "Comenzar a Calcular"
   ↓
6. Usa la calculadora
```

### **Usuario Experimentado:**
```
1. Ingresa directamente a la calculadora
   ↓
2. Usa el sidebar para operaciones rápidas
   ↓
3. Si necesita ayuda → "Docs" en navbar
   ↓
4. Vuelve a la calculadora
```

---

## 🚀 **Archivos Creados**

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `pages/HomePage.tsx` | ~350 | Página de inicio con features |
| `pages/DocsPage.tsx` | ~500 | Documentación completa |
| `pages/AboutPage.tsx` | ~400 | Info del proyecto |
| `NAVEGACION_PAGINAS.md` | Este archivo | Documentación de navegación |

---

## 🔧 **Archivos Modificados**

| Archivo | Cambios |
|---------|---------|
| `App.tsx` | + Estado de navegación<br>+ Renderizado condicional<br>+ Props para Navbar/Footer |
| `Navbar.tsx` | + Props onNavigate/currentPage<br>+ Handlers de click<br>+ Indicadores visuales |
| `Footer.tsx` | + Props onNavigate<br>+ Enlaces funcionales |

---

## ✅ **Checklist de Funcionalidades**

- [x] HomePage con presentación del proyecto
- [x] DocsPage con guías y ejemplos
- [x] AboutPage con información técnica
- [x] Navegación desde Navbar
- [x] Navegación desde Footer
- [x] Indicadores visuales de página activa
- [x] Sidebar solo visible en calculadora
- [x] Margen dinámico según página
- [x] Responsive en mobile
- [x] Sin errores de linting
- [x] Enlaces externos funcionando (API Docs)
- [x] Call to Actions funcionales

---

## 🎨 **Características Visuales**

### **HomePage:**
- Gradientes de color en títulos
- Cards con hover effects
- Iconos de Material-UI
- Estadísticas destacadas
- CTA con sombras y animaciones

### **DocsPage:**
- Acordeones Material-UI
- Chips para categorías
- Código syntax highlighting
- Alertas informativas
- Grid layouts

### **AboutPage:**
- Cards de tecnologías
- Avatars con iconos
- Badges de logros
- Links externos
- Timeline visual

---

## 📊 **Performance**

- **Renderizado condicional** - Solo se monta la página activa
- **No React Router** - Menos dependencias
- **Estado local simple** - Sin complejidad adicional
- **Lazy loading ready** - Fácil implementar si es necesario

---

## 🔄 **Extensibilidad**

### **Agregar Nueva Página:**

1. Crear componente en `pages/`:
```typescript
// pages/NewPage.tsx
export const NewPage = () => {
  return <div>Nueva Página</div>;
};
```

2. Importar en `App.tsx`:
```typescript
import NewPage from './pages/NewPage';
```

3. Agregar al estado:
```typescript
const [currentPage, setCurrentPage] = useState<
  'calculator' | 'home' | 'docs' | 'about' | 'new'
>('home');
```

4. Agregar renderizado:
```typescript
{currentPage === 'new' && (
  <Container maxWidth="lg">
    <NewPage />
  </Container>
)}
```

5. Agregar botón en Navbar:
```typescript
<Button onClick={() => onNavigate?.('new')}>
  Nueva Página
</Button>
```

---

## 🎉 **Resultado Final**

✅ **Sistema de navegación completo y funcional**  
✅ **4 páginas con contenido rico**  
✅ **Enlaces del Navbar funcionando**  
✅ **Enlaces del Footer funcionando**  
✅ **Indicadores visuales de página activa**  
✅ **Sidebar condicional (solo en calculadora)**  
✅ **Responsive y adaptativo**  
✅ **Sin errores de linting**  

**Estado:** ✅ **COMPLETADO Y LISTO PARA USO**

---

## 📞 **Uso**

### **Iniciar Aplicación:**
```bash
cd frontcalculo
npm run dev
```

### **Navegación:**
1. La app inicia en HomePage
2. Usa los botones del Navbar para navegar
3. Los enlaces del Footer también navegan
4. El botón "Comenzar a Calcular" lleva a la calculadora

---

_Desarrollado para maximizar la experiencia del usuario y facilitar el aprendizaje._

