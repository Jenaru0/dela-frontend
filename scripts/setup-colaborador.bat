@echo off
REM Script de configuración para nuevos colaboradores (Windows)
REM Dela Platform - Setup para desarrollo

echo 🚀 Configurando Dela Platform para desarrollo...

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está instalado. Por favor instala Docker Desktop desde https://docker.com/
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo ✅ Docker detectado

REM Instalar dependencias del workspace principal
echo 📦 Instalando dependencias del workspace principal...
npm install

REM Configurar variables de entorno si no existen
if not exist "api\.env" (
    echo 📝 Copiando variables de entorno del backend...
    copy "api\.env.example" "api\.env"
    echo ⚠️  Por favor actualiza las variables en api\.env con tus configuraciones locales
)

if not exist "web\.env.local" (
    echo 📝 Copiando variables de entorno del frontend...
    copy "web\.env.example" "web\.env.local"
    echo ⚠️  Por favor actualiza las variables en web\.env.local con tus configuraciones locales
)

REM Generar Prisma Client
echo 🗄️  Generando Prisma Client...
cd api
npx prisma generate
cd ..

REM Mostrar información de configuración
echo.
echo 🎉 ¡Configuración completada!
echo.
echo 📋 Próximos pasos:
echo 1. Actualiza las variables de entorno en:
echo    - api\.env
echo    - web\.env.local
echo.
echo 2. Para desarrollo con Docker:
echo    docker-compose up -d
echo.
echo 3. Para desarrollo local:
echo    npm run dev
echo.
echo 4. Para ejecutar migraciones de base de datos:
echo    cd api ^&^& npx prisma migrate dev
echo.
echo 5. Para ver la base de datos:
echo    cd api ^&^& npx prisma studio
echo.
echo 📚 Documentación completa en: docs\
echo 🐛 Reportar issues en: GitHub Issues
echo.
pause
