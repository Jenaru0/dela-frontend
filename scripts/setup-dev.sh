#!/bin/bash

# 🚀 Script de Setup para Desarrolladores - DELA Platform
# Este script configura el entorno de desarrollo completo

echo "🎯 Configurando DELA Platform - Entorno de Desarrollo"
echo "=================================================="

# Verificar Node.js version
echo "📋 Verificando requisitos..."
node_version=$(node -v 2>/dev/null || echo "No instalado")
if [[ $node_version == v1[8-9]* ]] || [[ $node_version == v2[0-9]* ]]; then
    echo "✅ Node.js: $node_version"
else
    echo "❌ Error: Node.js 18+ requerido. Versión actual: $node_version"
    echo "   Instalar desde: https://nodejs.org/"
    exit 1
fi

# Verificar Git
if command -v git &> /dev/null; then
    echo "✅ Git: $(git --version)"
else
    echo "❌ Error: Git no encontrado"
    exit 1
fi

# Instalar dependencias del monorepo
echo ""
echo "📦 Instalando dependencias..."
npm install

# Instalar dependencias de los workspaces
echo "📦 Instalando dependencias de API..."
cd api && npm install && cd ..

echo "📦 Instalando dependencias de Web..."
cd web && npm install && cd ..

# Configurar Prisma
echo ""
echo "🗄️  Configurando base de datos..."
cd api
npx prisma generate
npx prisma migrate dev --name init
cd ..

# Verificar builds
echo ""
echo "🔧 Verificando builds..."
npm run build

# Configurar Git hooks (opcional)
echo ""
echo "🔗 Configurando Git hooks..."
if [ -d ".git" ]; then
    echo "#!/bin/sh
npm run lint:fix
npm run format" > .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "✅ Pre-commit hook configurado"
fi

# Configurar variables de entorno
echo ""
echo "⚙️  Configurando variables de entorno..."

# API .env
if [ ! -f "api/.env" ]; then
    echo "# Base de datos
DATABASE_URL=\"postgresql://postgres:password@localhost:5432/dela_db?schema=public\"

# JWT
JWT_SECRET=\"tu-jwt-secret-super-seguro\"
JWT_EXPIRES_IN=\"7d\"

# API
PORT=3001
NODE_ENV=\"development\"

# CORS
FRONTEND_URL=\"http://localhost:3000\"" > api/.env
    echo "✅ Archivo api/.env creado"
else
    echo "ℹ️  api/.env ya existe"
fi

# Web .env.local
if [ ! -f "web/.env.local" ]; then
    echo "# API Backend
NEXT_PUBLIC_API_URL=\"http://localhost:3001\"

# Stripe (desarrollo)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\"pk_test_...\"
STRIPE_SECRET_KEY=\"sk_test_...\"

# NextAuth
NEXTAUTH_URL=\"http://localhost:3000\"
NEXTAUTH_SECRET=\"tu-nextauth-secret\"

# Base de datos (si usas NextAuth)
DATABASE_URL=\"postgresql://postgres:password@localhost:5432/dela_db?schema=public\"" > web/.env.local
    echo "✅ Archivo web/.env.local creado"
else
    echo "ℹ️  web/.env.local ya existe"
fi

echo ""
echo "🎉 ¡Setup completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar tu base de datos PostgreSQL"
echo "2. Actualizar las variables de entorno en api/.env y web/.env.local"
echo "3. Ejecutar: npm run dev (para desarrollo)"
echo "4. Visitar: http://localhost:3000 (frontend) y http://localhost:3001 (API)"
echo ""
echo "🔧 Comandos útiles:"
echo "  npm run dev          - Iniciar desarrollo (frontend + backend)"
echo "  npm run build        - Build completo del proyecto"
echo "  npm run lint         - Verificar código"
echo "  npm run test         - Ejecutar tests"
echo "  npm run clean        - Limpiar cache y node_modules"
echo ""
echo "📚 Documentación:"
echo "  docs/git-workflow.md - Flujo de trabajo Git"
echo "  README.md           - Documentación principal"
echo ""
echo "¡Feliz desarrollo! 🚀"
