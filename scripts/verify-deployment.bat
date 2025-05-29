@echo off
REM Script de verificación pre-deployment para Windows
REM Ejecuta todas las verificaciones necesarias antes de hacer deployment

echo 🔍 Verificando configuración para deployment...
echo.

set ERRORS=0

REM Función para verificar archivo
:check_file
if exist "%~1" (
    echo ✓ %~1 existe
) else (
    echo ✗ %~1 NO EXISTE
    set /a ERRORS+=1
)
goto :eof

REM Función para verificar comando
:check_command
where "%~1" >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo ✓ %~1 está instalado
) else (
    echo ✗ %~1 NO está instalado
    set /a ERRORS+=1
)
goto :eof

echo 📋 Verificando archivos de configuración...
call :check_file "package.json"
call :check_file "turbo.json"
call :check_file "nixpacks.toml"
call :check_file "dokploy.yml"
call :check_file "api\Dockerfile"
call :check_file "web\Dockerfile"
call :check_file "api\package.json"
call :check_file "web\package.json"
call :check_file "api\prisma\schema.prisma"
call :check_file ".nixpacksignore"
call :check_file ".dockerignore"

echo.
echo 🔧 Verificando dependencias...
call :check_command "node"
call :check_command "npm"
call :check_command "git"

echo.
echo 📦 Verificando estructura del proyecto...
if exist "api\src" (
    echo ✓ Directorio api\src existe
) else (
    echo ✗ Directorio api\src NO existe
    set /a ERRORS+=1
)

if exist "web\src" (
    echo ✓ Directorio web\src existe
) else (
    echo ✗ Directorio web\src NO existe
    set /a ERRORS+=1
)

echo.
echo 🔍 Verificando variables de entorno...
if exist "api\.env.example" (
    echo ✓ api\.env.example existe
) else (
    echo ⚠ api\.env.example no existe ^(recomendado^)
)

if exist "web\.env.example" (
    echo ✓ web\.env.example existe
) else (
    echo ⚠ web\.env.example no existe ^(recomendado^)
)

echo.
echo 🏗️ Verificando que el build funciona...
npm run build >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ✓ Build exitoso
) else (
    echo ✗ Build FALLÓ
    echo 💡 Ejecuta 'npm run build' para ver detalles del error
    set /a ERRORS+=1
)

echo.
echo 🧪 Verificando Prisma...
cd api
npx prisma generate >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ✓ Prisma client generado correctamente
) else (
    echo ✗ Error generando Prisma client
    set /a ERRORS+=1
)
cd ..

echo.
echo 📊 Resumen de verificación:
if %ERRORS% == 0 (
    echo 🎉 ¡Todo listo para deployment!
    echo.
    echo Próximos pasos:
    echo 1. Configura la base de datos ^(Neon recomendado^)
    echo 2. Crea las aplicaciones en Dokploy
    echo 3. Configura las variables de entorno
    echo 4. Inicia el deployment
    echo.
    echo 📚 Consulta DEPLOYMENT.md para instrucciones detalladas
    exit /b 0
) else (
    echo ❌ Se encontraron %ERRORS% errores
    echo.
    echo Por favor, corrige los errores antes de hacer deployment.
    exit /b 1
)
