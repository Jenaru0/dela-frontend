# Script para ejecutar Hadolint en Windows
# Uso: .\hadolint-check.ps1

Write-Host "Ejecutando Hadolint para validar Dockerfile..." -ForegroundColor Cyan

# Verificar si Docker esta ejecutandose
try {
    docker version | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker no esta ejecutandose"
    }
} catch {
    Write-Host "Error: Docker no esta disponible o no esta ejecutandose" -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop e intenta nuevamente" -ForegroundColor Yellow
    exit 1
}

# Ejecutar Hadolint
Write-Host "Analizando Dockerfile..." -ForegroundColor Yellow

$dockerfilePath = "../Dockerfile"
$configPath = "../.hadolint.yaml"

if (Test-Path $configPath) {
    Write-Host "Usando configuracion personalizada: .hadolint.yaml" -ForegroundColor Green
    docker run --rm -i -v "${PWD}/..:/workspace" hadolint/hadolint hadolint --config /workspace/.hadolint.yaml /workspace/Dockerfile
} else {
    Write-Host "Usando configuracion por defecto" -ForegroundColor Yellow
    Get-Content $dockerfilePath | docker run --rm -i hadolint/hadolint
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Dockerfile validado correctamente!" -ForegroundColor Green
} else {
    Write-Host "Se encontraron problemas en el Dockerfile" -ForegroundColor Red
    Write-Host "Revisa las sugerencias arriba para mejorar tu Dockerfile" -ForegroundColor Yellow
}
