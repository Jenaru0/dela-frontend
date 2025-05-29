#!/bin/bash
# Script de post-deployment para Dokploy
# Este script se ejecuta después del deployment para configurar la base de datos

echo "🚀 Ejecutando post-deployment..."

# Navegar al directorio de la API
cd api

# Ejecutar migraciones de Prisma en producción
echo "📊 Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

# Verificar que las migraciones se ejecutaron correctamente
if [ $? -eq 0 ]; then
    echo "✅ Migraciones ejecutadas correctamente"
else
    echo "❌ Error ejecutando migraciones"
    exit 1
fi

echo "🎉 Post-deployment completado exitosamente"
