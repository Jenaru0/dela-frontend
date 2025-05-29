# 🚀 Deployment con Dokploy - Dela Platform

## Configuración Rápida

### 1. Variables de Entorno Requeridas

#### Backend (API)

```bash
DATABASE_URL="postgresql://usuario:password@host:5432/database"
JWT_SECRET="tu_jwt_secret_super_seguro_de_al_menos_32_caracteres"
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
PORT="3000"
FRONTEND_URL="https://tu-dominio.com"
ALLOWED_ORIGINS="https://tu-dominio.com,http://localhost:3000"
BCRYPT_SALT_ROUNDS="12"
CORS_ENABLED="true"
```

#### Frontend (Web)

```bash
NEXT_PUBLIC_API_URL="https://api.tu-dominio.com"
NODE_ENV="production"
NEXT_PUBLIC_APP_NAME="Dela Platform"
NEXT_PUBLIC_ENVIRONMENT="production"
```

### 2. Configuración en Dokploy

1. **Crear nuevo proyecto** en Dokploy
2. **Conectar repositorio**: `https://github.com/Jenaru0/dela-platform.git`
3. **Branch**: `develop`
4. **Tipo de build**: Nixpacks
5. **Puerto**: 3000
6. **Health check**: `/health`

### 3. Configuración de Build

El proyecto incluye `nixpacks.toml` que configura:

- Node.js 18
- Generación automática de Prisma Client
- Build optimizado con Turbo

### 4. Base de Datos

#### Opción A: Neon (Recomendado)

1. Crear cuenta en [Neon](https://neon.tech/)
2. Crear nueva base de datos PostgreSQL
3. Copiar DATABASE_URL a las variables de entorno

#### Opción B: Dokploy PostgreSQL

1. Crear instancia PostgreSQL en Dokploy
2. Configurar DATABASE_URL con los datos de conexión

### 5. Proceso de Deployment

El deployment automático incluye:

1. ✅ Instalación de dependencias
2. ✅ Generación de Prisma Client
3. ✅ Build del proyecto con Turbo
4. ✅ Migración de base de datos
5. ✅ Health check automático

### 6. Verificación

Una vez deployado, verificar:

- ✅ API responde en: `https://api.tu-dominio.com/health`
- ✅ Frontend carga en: `https://tu-dominio.com`
- ✅ Conexión a base de datos funcional

### 7. Monitoreo

- **Health endpoint**: `/health`
- **Logs**: Disponibles en Dokploy dashboard
- **Métricas**: CPU, memoria, requests

## 🆘 Solución de Problemas

### Build fallido

```bash
# Verificar localmente
npm run build
```

### Errores de Prisma

```bash
# Regenerar cliente
cd api && npx prisma generate
```

### Problemas de conexión DB

```bash
# Verificar DATABASE_URL
cd api && npx prisma db pull
```

## 📚 Documentación Adicional

- [Guía completa de deployment](docs/dokploy-despliegue.md)
- [Variables de entorno](docs/variables-entorno.md)
- [Setup para colaboradores](docs/setup-colaboradores.md)
