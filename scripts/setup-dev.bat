@echo off
echo 🎯 Configurando DELA Platform - Entorno de Desarrollo
echo ==================================================

:: Verificar Node.js version
echo 📋 Verificando requisitos...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no encontrado
    echo    Instalar desde: https://nodejs.org/
    exit /b 1
)

for /f %%i in ('node -v') do set node_version=%%i
echo ✅ Node.js: %node_version%

:: Verificar Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Git no encontrado
    exit /b 1
)

for /f "tokens=*" %%i in ('git --version') do set git_version=%%i
echo ✅ Git: %git_version%

:: Instalar dependencias del monorepo
echo.
echo 📦 Instalando dependencias...
call npm install

:: Instalar dependencias de los workspaces
echo 📦 Instalando dependencias de API...
cd api
call npm install
cd ..

echo 📦 Instalando dependencias de Web...
cd web
call npm install
cd ..

:: Configurar Prisma
echo.
echo 🗄️  Configurando base de datos...
cd api
call npx prisma generate
call npx prisma migrate dev --name init
cd ..

:: Verificar builds
echo.
echo 🔧 Verificando builds...
call npm run build

:: Configurar variables de entorno
echo.
echo ⚙️  Configurando variables de entorno...

:: API .env
if not exist "api\.env" (
    echo # Base de datos > api\.env
    echo DATABASE_URL="postgresql://postgres:password@localhost:5432/dela_db?schema=public" >> api\.env
    echo. >> api\.env
    echo # JWT >> api\.env
    echo JWT_SECRET="tu-jwt-secret-super-seguro" >> api\.env
    echo JWT_EXPIRES_IN="7d" >> api\.env
    echo. >> api\.env
    echo # API >> api\.env
    echo PORT=3001 >> api\.env
    echo NODE_ENV="development" >> api\.env
    echo. >> api\.env
    echo # CORS >> api\.env
    echo FRONTEND_URL="http://localhost:3000" >> api\.env
    echo ✅ Archivo api\.env creado
) else (
    echo ℹ️  api\.env ya existe
)

:: Web .env.local
if not exist "web\.env.local" (
    echo # API Backend > web\.env.local
    echo NEXT_PUBLIC_API_URL="http://localhost:3001" >> web\.env.local
    echo. >> web\.env.local
    echo # Stripe ^(desarrollo^) >> web\.env.local
    echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." >> web\.env.local
    echo STRIPE_SECRET_KEY="sk_test_..." >> web\.env.local
    echo. >> web\.env.local
    echo # NextAuth >> web\.env.local
    echo NEXTAUTH_URL="http://localhost:3000" >> web\.env.local
    echo NEXTAUTH_SECRET="tu-nextauth-secret" >> web\.env.local
    echo ✅ Archivo web\.env.local creado
) else (
    echo ℹ️  web\.env.local ya existe
)

echo.
echo 🎉 ¡Setup completado!
echo.
echo 📋 Próximos pasos:
echo 1. Configurar tu base de datos PostgreSQL
echo 2. Actualizar las variables de entorno en api\.env y web\.env.local
echo 3. Ejecutar: npm run dev ^(para desarrollo^)
echo 4. Visitar: http://localhost:3000 ^(frontend^) y http://localhost:3001 ^(API^)
echo.
echo 🔧 Comandos útiles:
echo   npm run dev          - Iniciar desarrollo ^(frontend + backend^)
echo   npm run build        - Build completo del proyecto
echo   npm run lint         - Verificar código
echo   npm run test         - Ejecutar tests
echo   npm run clean        - Limpiar cache y node_modules
echo.
echo 📚 Documentación:
echo   docs\git-workflow.md - Flujo de trabajo Git
echo   README.md           - Documentación principal
echo.
echo ¡Feliz desarrollo! 🚀
pause
