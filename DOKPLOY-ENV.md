# 🔒 Variables de Entorno Seguras en Dokploy

## Configuración Recomendada

Para cumplir con las mejores prácticas de seguridad de Docker y Dokploy, las variables sensibles se manejan a través del sistema de **Variables Compartidas del Proyecto**.

### Variables a Configurar en Dokploy

Ve a tu proyecto en Dokploy → **Environment Variables** y configura:

```env
# Variables sensibles (NO van en el Dockerfile)
DATABASE_URL=postgresql://postgres:password@host:5432/database
JWT_SECRET=tu_jwt_secret_super_seguro_de_32_caracteres
NEXTAUTH_SECRET=tu_nextauth_secret_super_seguro_de_32_caracteres
NEXTAUTH_URL=https://tu-dominio.com

# Variables de Cloudinary (si las usas)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Variables Públicas en el Dockerfile

Solo las variables públicas (que empiezan con `NEXT_PUBLIC_`) se definen en el Dockerfile:

```dockerfile
ENV NEXT_PUBLIC_API_URL=https://delabackend.episundc.pe
ENV NEXT_PUBLIC_APP_NAME=DELA
ENV NEXT_PUBLIC_APP_VERSION=1.0.0
```

## ✅ Beneficios de esta Configuración

1. **Seguridad**: Las variables sensibles no están expuestas en el código
2. **Flexibilidad**: Puedes cambiar variables sin reconstruir la imagen
3. **Compliance**: Cumple con las mejores prácticas de Docker Security
4. **Dokploy Native**: Usa el sistema recomendado por Dokploy

## 🔄 Flujo de Deployment

1. **Build Time**: Solo variables públicas se usan para el build
2. **Runtime**: Dokploy inyecta automáticamente las variables del proyecto
3. **Next.js**: Accede a todas las variables normalmente

## 🚨 Notas Importantes

- Las variables sensibles se inyectan en **runtime**, no en **build time**
- Next.js puede acceder a todas las variables sin cambios en el código
- Las variables compartidas tienen prioridad sobre las definidas en la aplicación
