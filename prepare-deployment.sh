#!/bin/bash

# 🚀 Script de preparación para despliegue monorepo en Dokploy
# Ejecutar antes de hacer push al repositorio

echo "🔍 Verificando configuración de despliegue..."

# Verificar que todas las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que el build funcione correctamente
echo "🏗️ Probando build completo..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso - proyecto listo para despliegue"
else
    echo "❌ Error en el build - revisar antes de desplegar"
    exit 1
fi

# Verificar archivos de configuración críticos
echo "🔍 Verificando archivos de configuración..."

required_files=(
    "nixpacks.toml"
    "dokploy-monorepo.yml"
    "turbo.json"
    "api/package.json"
    "web/package.json"
    "api/prisma/schema.prisma"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Archivo faltante: $file"
        exit 1
    else
        echo "✅ $file"
    fi
done

# Verificar configuración de Tailwind CSS v4.1
echo "🎨 Verificando configuración de Tailwind CSS v4.1..."
cd web

if grep -q '"tailwindcss": "4.1.8"' package.json; then
    echo "✅ Tailwind CSS v4.1.8 configurado"
else
    echo "❌ Versión incorrecta de Tailwind CSS"
    exit 1
fi

if grep -q '"@tailwindcss/postcss": "4.1.8"' package.json; then
    echo "✅ @tailwindcss/postcss v4.1.8 configurado"
else
    echo "❌ Plugin PostCSS de Tailwind faltante"
    exit 1
fi

cd ..

# Verificar configuración de Prisma
echo "🗄️ Verificando configuración de Prisma..."
cd api

if [ -f "prisma/schema.prisma" ]; then
    echo "✅ Schema de Prisma encontrado"
else
    echo "❌ Schema de Prisma faltante"
    exit 1
fi

cd ..

echo ""
echo "🎉 ¡Proyecto completamente preparado para despliegue!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar base de datos PostgreSQL en Neon"
echo "2. Actualizar DATABASE_URL en dokploy-monorepo.yml"
echo "3. Configurar dominio y certificados SSL"
echo "4. Hacer push al repositorio"
echo "5. Configurar proyecto en Dokploy usando dokploy-monorepo.yml"
echo ""
echo "🔗 Archivos de configuración creados:"
echo "   - dokploy-monorepo.yml (configuración principal)"
echo "   - nixpacks.toml (configuración de build optimizada)"
echo ""
