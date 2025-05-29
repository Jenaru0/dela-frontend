#!/bin/bash

# Script de configuración para nuevos colaboradores
# Dela Platform - Setup para desarrollo

echo "🚀 Configurando Dela Platform para desarrollo..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/"
    exit 1
fi

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker desde https://docker.com/"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior. Versión actual: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"
echo "✅ Docker detectado"

# Instalar dependencias del workspace principal
echo "📦 Instalando dependencias del workspace principal..."
npm install

# Configurar variables de entorno si no existen
if [ ! -f "api/.env" ]; then
    echo "📝 Copiando variables de entorno del backend..."
    cp api/.env.example api/.env
    echo "⚠️  Por favor actualiza las variables en api/.env con tus configuraciones locales"
fi

if [ ! -f "web/.env.local" ]; then
    echo "📝 Copiando variables de entorno del frontend..."
    cp web/.env.example web/.env.local
    echo "⚠️  Por favor actualiza las variables en web/.env.local con tus configuraciones locales"
fi

# Generar Prisma Client
echo "🗄️  Generando Prisma Client..."
cd api && npx prisma generate && cd ..

# Mostrar información de configuración
echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Actualiza las variables de entorno en:"
echo "   - api/.env"
echo "   - web/.env.local"
echo ""
echo "2. Para desarrollo con Docker:"
echo "   docker-compose up -d"
echo ""
echo "3. Para desarrollo local:"
echo "   npm run dev"
echo ""
echo "4. Para ejecutar migraciones de base de datos:"
echo "   cd api && npx prisma migrate dev"
echo ""
echo "5. Para ver la base de datos:"
echo "   cd api && npx prisma studio"
echo ""
echo "📚 Documentación completa en: docs/"
echo "🐛 Reportar issues en: GitHub Issues"
echo ""
