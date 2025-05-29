#!/bin/bash
# Script de verificación pre-deployment
# Ejecuta todas las verificaciones necesarias antes de hacer deployment

echo "🔍 Verificando configuración para deployment..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
    else
        echo -e "${RED}✗${NC} $1 NO EXISTE"
        ((ERRORS++))
    fi
}

# Función para verificar comando
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 está instalado"
    else
        echo -e "${RED}✗${NC} $1 NO está instalado"
        ((ERRORS++))
    fi
}

echo "📋 Verificando archivos de configuración..."
check_file "package.json"
check_file "turbo.json"
check_file "nixpacks.toml"
check_file "dokploy.yml"
check_file "api/Dockerfile"
check_file "web/Dockerfile"
check_file "api/package.json"
check_file "web/package.json"
check_file "api/prisma/schema.prisma"
check_file ".nixpacksignore"
check_file ".dockerignore"

echo ""
echo "🔧 Verificando dependencias..."
check_command "node"
check_command "npm"
check_command "git"

echo ""
echo "📦 Verificando estructura del proyecto..."
if [ -d "api/src" ]; then
    echo -e "${GREEN}✓${NC} Directorio api/src existe"
else
    echo -e "${RED}✗${NC} Directorio api/src NO existe"
    ((ERRORS++))
fi

if [ -d "web/src" ]; then
    echo -e "${GREEN}✓${NC} Directorio web/src existe"
else
    echo -e "${RED}✗${NC} Directorio web/src NO existe"
    ((ERRORS++))
fi

echo ""
echo "🔍 Verificando variables de entorno..."
if [ -f "api/.env.example" ]; then
    echo -e "${GREEN}✓${NC} api/.env.example existe"
else
    echo -e "${YELLOW}⚠${NC} api/.env.example no existe (recomendado)"
fi

if [ -f "web/.env.example" ]; then
    echo -e "${GREEN}✓${NC} web/.env.example existe"
else
    echo -e "${YELLOW}⚠${NC} web/.env.example no existe (recomendado)"
fi

echo ""
echo "🏗️ Verificando que el build funciona..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build exitoso"
else
    echo -e "${RED}✗${NC} Build FALLÓ"
    echo -e "${YELLOW}💡${NC} Ejecuta 'npm run build' para ver detalles del error"
    ((ERRORS++))
fi

echo ""
echo "🧪 Verificando Prisma..."
cd api
if npx prisma generate > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Prisma client generado correctamente"
else
    echo -e "${RED}✗${NC} Error generando Prisma client"
    ((ERRORS++))
fi
cd ..

echo ""
echo "📊 Resumen de verificación:"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Todo listo para deployment!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Configura la base de datos (Neon recomendado)"
    echo "2. Crea las aplicaciones en Dokploy"
    echo "3. Configura las variables de entorno"
    echo "4. Inicia el deployment"
    echo ""
    echo "📚 Consulta DEPLOYMENT.md para instrucciones detalladas"
    exit 0
else
    echo -e "${RED}❌ Se encontraron $ERRORS errores${NC}"
    echo ""
    echo "Por favor, corrige los errores antes de hacer deployment."
    exit 1
fi
