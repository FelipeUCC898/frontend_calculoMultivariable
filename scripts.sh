#!/bin/bash

# ============================================
# SCRIPTS DE UTILIDAD - Frontend
# Cálculo Multivariado
# ============================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# FUNCIONES DE UTILIDAD
# ============================================

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# ============================================
# SCRIPT 1: Setup Inicial
# ============================================

setup() {
    print_header "Configuración Inicial del Frontend"
    
    # Verificar Node.js
    echo "Verificando Node.js..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_success "Node.js instalado: $NODE_VERSION"
    else
        print_error "Node.js no encontrado. Instala Node.js >= 18.0.0"
        exit 1
    fi
    
    # Verificar npm
    echo "Verificando npm..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_success "npm instalado: $NPM_VERSION"
    else
        print_error "npm no encontrado"
        exit 1
    fi
    
    # Instalar dependencias
    echo ""
    print_header "Instalando dependencias"
    npm install
    
    # Crear .env si no existe
    if [ ! -f .env ]; then
        print_warning ".env no encontrado. Creando desde .env.example..."
        cp .env.example .env
        print_success ".env creado"
    else
        print_success ".env ya existe"
    fi
    
    print_success "Setup completado exitosamente!"
    echo ""
    echo "Siguiente paso: npm run dev"
}

# ============================================
# SCRIPT 2: Verificar Conexión con Backend
# ============================================

check_backend() {
    print_header "Verificando Backend"
    
    # Leer URL del .env
    if [ -f .env ]; then
        source .env
        API_URL=${VITE_API_URL:-"http://localhost:5000/api"}
    else
        API_URL="http://localhost:5000/api"
    fi
    
    echo "Probando conexión a: $API_URL"
    
    # Intentar conectar
    if curl -s --head --request GET "$API_URL/health" | grep "200 OK" > /dev/null; then
        print_success "Backend disponible en $API_URL"
    else
        print_error "No se pudo conectar al backend"
        print_warning "Asegúrate de que el backend esté corriendo:"
        echo "  cd ../backend && docker-compose up -d"
    fi
}

# ============================================
# SCRIPT 3: Limpiar y Reinstalar
# ============================================

clean_install() {
    print_header "Limpieza e Instalación Fresca"
    
    print_warning "Esto eliminará node_modules y reinstalará todo"
    read -p "¿Continuar? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Eliminando node_modules..."
        rm -rf node_modules
        
        echo "Eliminando package-lock.json..."
        rm -f package-lock.json
        
        echo "Eliminando caché de npm..."
        npm cache clean --force
        
        echo "Instalando dependencias..."
        npm install
        
        print_success "Instalación fresca completada"
    else
        print_warning "Operación cancelada"
    fi
}

# ============================================
# SCRIPT 4: Build y Preview
# ============================================

build_and_preview() {
    print_header "Build de Producción"
    
    echo "Compilando aplicación..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Build exitoso"
        echo ""
        echo "Iniciando preview..."
        npm run preview
    else
        print_error "Error en el build"
        exit 1
    fi
}

# ============================================
# SCRIPT 5: Verificar Salud del Proyecto
# ============================================

health_check() {
    print_header "Verificación de Salud del Proyecto"
    
    # 1. Verificar archivos importantes
    echo "Verificando archivos..."
    
    files=("package.json" "vite.config.ts" "tsconfig.json" ".env" "src/main.tsx" "src/App.tsx")
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file existe"
        else
            print_error "$file no encontrado"
        fi
    done
    
    # 2. Verificar node_modules
    echo ""
    echo "Verificando node_modules..."
    if [ -d "node_modules" ]; then
        print_success "node_modules existe"
    else
        print_error "node_modules no encontrado. Ejecuta: npm install"
    fi
    
    # 3. Verificar tipos
    echo ""
    echo "Verificando tipos TypeScript..."
    npm run type-check --if-present
    
    # 4. Verificar backend
    echo ""
    check_backend
    
    print_success "Verificación completada"
}

# ============================================
# SCRIPT 6: Desarrollo con Auto-restart
# ============================================

dev_watch() {
    print_header "Modo Desarrollo con Watch"
    
    print_success "Iniciando servidor de desarrollo..."
    print_warning "Presiona Ctrl+C para detener"
    
    npm run dev
}

# ============================================
# SCRIPT 7: Análisis de Bundle
# ============================================

analyze_bundle() {
    print_header "Análisis de Bundle"
    
    echo "Compilando con análisis..."
    npm run build
    
    echo ""
    echo "Tamaño del bundle:"
    du -sh dist/
    
    echo ""
    echo "Archivos más grandes:"
    find dist/ -type f -exec du -h {} + | sort -rh | head -10
}

# ============================================
# SCRIPT 8: Tests Rápidos
# ============================================

quick_test() {
    print_header "Tests Rápidos"
    
    # Test 1: Compilación TypeScript
    echo "Test 1: Verificando TypeScript..."
    npm run type-check --if-present
    
    # Test 2: Linting
    echo ""
    echo "Test 2: Verificando ESLint..."
    npm run lint --if-present
    
    # Test 3: Build
    echo ""
    echo "Test 3: Build de prueba..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Todos los tests pasaron"
    else
        print_error "Algunos tests fallaron"
    fi
}

# ============================================
# MENÚ PRINCIPAL
# ============================================

show_menu() {
    clear
    print_header "Scripts de Utilidad - Frontend"
    echo ""
    echo "1) Setup inicial (install + config)"
    echo "2) Verificar conexión con backend"
    echo "3) Limpiar y reinstalar"
    echo "4) Build y preview"
    echo "5) Health check del proyecto"
    echo "6) Iniciar modo desarrollo"
    echo "7) Analizar tamaño del bundle"
    echo "8) Ejecutar tests rápidos"
    echo "9) Salir"
    echo ""
}

# ============================================
# EJECUCIÓN PRINCIPAL
# ============================================

# Si se pasa argumento, ejecutar directamente
if [ $# -gt 0 ]; then
    case $1 in
        setup) setup ;;
        check) check_backend ;;
        clean) clean_install ;;
        build) build_and_preview ;;
        health) health_check ;;
        dev) dev_watch ;;
        analyze) analyze_bundle ;;
        test) quick_test ;;
        *)
            echo "Opción no válida: $1"
            echo "Uso: ./scripts.sh [setup|check|clean|build|health|dev|analyze|test]"
            exit 1
            ;;
    esac
    exit 0
fi

# Menú interactivo
while true; do
    show_menu
    read -p "Selecciona una opción: " choice
    
    case $choice in
        1) setup ;;
        2) check_backend ;;
        3) clean_install ;;
        4) build_and_preview ;;
        5) health_check ;;
        6) dev_watch ;;
        7) analyze_bundle ;;
        8) quick_test ;;
        9) 
            print_success "¡Hasta luego!"
            exit 0
            ;;
        *)
            print_error "Opción no válida"
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
done