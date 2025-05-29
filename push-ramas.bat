@echo off
echo ========================================
echo  SUBIR RAMAS SEPARADAS A GITHUB
echo ========================================
echo.

echo [1/3] Intentando subir rama backend/production...
git push origin backend/production
if %errorlevel% neq 0 (
    echo ERROR: No se pudo subir backend/production
    echo Verifica tu conexion a internet e intenta de nuevo
    pause
    exit /b 1
)
echo ✅ backend/production subida exitosamente

echo.
echo [2/3] Cambiando a rama frontend/production...
git checkout frontend/production
if %errorlevel% neq 0 (
    echo ERROR: No se pudo cambiar a frontend/production
    pause
    exit /b 1
)

echo [3/3] Intentando subir rama frontend/production...
git push origin frontend/production
if %errorlevel% neq 0 (
    echo ERROR: No se pudo subir frontend/production
    echo Verifica tu conexion a internet e intenta de nuevo
    pause
    exit /b 1
)
echo ✅ frontend/production subida exitosamente

echo.
echo ========================================
echo     ✅ AMBAS RAMAS SUBIDAS CON EXITO
echo ========================================
echo.
echo Proximos pasos:
echo 1. Ir a Dokploy
echo 2. Crear aplicacion para backend usando rama: backend/production
echo 3. Crear aplicacion para frontend usando rama: frontend/production
echo 4. Ver BACKEND-DEPLOY.md y FRONTEND-DEPLOY.md para configuracion
echo.
pause
