@echo off
REM 🚀 Script de preparación para despliegue monorepo en Dokploy (Windows)
REM Ejecutar antes de hacer push al repositorio

echo 🔍 Verificando configuración de despliegue...

REM Verificar que todas las dependencias estén instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
)

REM Verificar que el build funcione correctamente
echo 🏗️ Probando build completo...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Error en el build - revisar antes de desplegar
    exit /b 1
)

echo ✅ Build exitoso - proyecto listo para despliegue

REM Verificar archivos de configuración críticos
echo 🔍 Verificando archivos de configuración...

if not exist "nixpacks.toml" (
    echo ❌ Archivo faltante: nixpacks.toml
    exit /b 1
) else (
    echo ✅ nixpacks.toml
)

if not exist "dokploy-monorepo.yml" (
    echo ❌ Archivo faltante: dokploy-monorepo.yml
    exit /b 1
) else (
    echo ✅ dokploy-monorepo.yml
)

if not exist "turbo.json" (
    echo ❌ Archivo faltante: turbo.json
    exit /b 1
) else (
    echo ✅ turbo.json
)

if not exist "api\package.json" (
    echo ❌ Archivo faltante: api\package.json
    exit /b 1
) else (
    echo ✅ api\package.json
)

if not exist "web\package.json" (
    echo ❌ Archivo faltante: web\package.json
    exit /b 1
) else (
    echo ✅ web\package.json
)

if not exist "api\prisma\schema.prisma" (
    echo ❌ Archivo faltante: api\prisma\schema.prisma
    exit /b 1
) else (
    echo ✅ api\prisma\schema.prisma
)

REM Verificar configuración de Tailwind CSS v4.1
echo 🎨 Verificando configuración de Tailwind CSS v4.1...
cd web

findstr /C:"tailwindcss.*4.1.8" package.json >nul
if %errorlevel% neq 0 (
    echo ❌ Versión incorrecta de Tailwind CSS
    exit /b 1
) else (
    echo ✅ Tailwind CSS v4.1.8 configurado
)

findstr /C:"@tailwindcss/postcss.*4.1.8" package.json >nul
if %errorlevel% neq 0 (
    echo ❌ Plugin PostCSS de Tailwind faltante
    exit /b 1
) else (
    echo ✅ @tailwindcss/postcss v4.1.8 configurado
)

cd ..

echo.
echo 🎉 ¡Proyecto completamente preparado para despliegue!
echo.
echo 📋 Próximos pasos:
echo 1. Configurar base de datos PostgreSQL en Neon
echo 2. Actualizar DATABASE_URL en dokploy-monorepo.yml
echo 3. Configurar dominio y certificados SSL
echo 4. Hacer push al repositorio
echo 5. Configurar proyecto en Dokploy usando dokploy-monorepo.yml
echo.
echo 🔗 Archivos de configuración creados:
echo    - dokploy-monorepo.yml (configuración principal)
echo    - nixpacks.toml (configuración de build optimizada)
echo.
