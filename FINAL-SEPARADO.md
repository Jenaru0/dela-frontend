# ✅ CONFIGURACIÓN FINAL - DESPLIEGUE SEPARADO

# 🚀 Frontend y Backend independientes en Dokploy

## 📋 VERIFICACIÓN COMPLETADA

- ✅ **Frontend Build**: Exitoso (Next.js 15 + Tailwind v4.1)
- ✅ **Backend Build**: Exitoso (NestJS + Prisma)
- ✅ **Base de datos**: Configurada (Neon PostgreSQL)
- ✅ **Secretos**: Generados criptográficamente
- ✅ **Archivos nixpacks**: Optimizados por separado
- ✅ **Variables de entorno**: Configuradas para producción

---

## 🚀 PASOS PARA DESPLEGAR

### **PASO 1: BACKEND API (DESPLEGAR PRIMERO)**

1. **Crear aplicación en Dokploy**:

   - Nombre: `dela-platform-api`
   - Tipo: Application
   - Build: Nixpacks

2. **Configurar repositorio**:

   - URL: `https://github.com/Jenaru0/dela-platform.git`
   - Branch: `develop`
   - **Build Directory**: `api` ⚠️ **IMPORTANTE**

3. **Variables de entorno** (copiar exactamente):

```
DATABASE_URL=postgresql://dela_owner:npg_o3LMdtgv4PhQ@ep-misty-glade-a8xsx3dv-pooler.eastus2.azure.neon.tech/dela?sslmode=require
JWT_SECRET=bb2626ceae438c9d0679c4185c39c4283c5f6051c8fb3a4946e9a294a77dad74
JWT_EXPIRES_IN=7d
SESSION_SECRET=1805c1a99017fc57fa3906e68966ef8c5db0cbb68b971a2cb3bce56356025111
BCRYPT_SALT_ROUNDS=12
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://dela-platform-web.dokploy.dev
ALLOWED_ORIGINS=https://dela-platform-web.dokploy.dev
CORS_ENABLED=true
UPLOAD_MAX_SIZE=10485760
MAX_FILE_SIZE=5mb
UPLOAD_PATH=./uploads
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
LOG_LEVEL=info
```

4. **Comandos**:

   - Install: `npm ci --prefer-offline --no-audit`
   - Build: `npm run build`
   - Start: `npm run start:prod`

5. **Health Check**: `/health`

---

### **PASO 2: FRONTEND WEB (DESPLEGAR SEGUNDO)**

1. **Crear aplicación en Dokploy**:

   - Nombre: `dela-platform-web`
   - Tipo: Application
   - Build: Nixpacks

2. **Configurar repositorio**:

   - URL: `https://github.com/Jenaru0/dela-platform.git`
   - Branch: `develop`
   - **Build Directory**: `web` ⚠️ **IMPORTANTE**

3. **Variables de entorno**:

```
NEXT_PUBLIC_API_URL=https://dela-platform-api.dokploy.dev
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

4. **Comandos**:
   - Install: `npm ci --prefer-offline --no-audit`
   - Build: `npm run build`
   - Start: `npm run start`

---

### **PASO 3: ACTUALIZAR URLS REALES**

Después del despliegue, actualiza con las URLs reales:

**Backend** (`FRONTEND_URL` y `ALLOWED_ORIGINS`):

```
FRONTEND_URL=https://tu-frontend-real.dokploy.dev
ALLOWED_ORIGINS=https://tu-frontend-real.dokploy.dev
```

**Frontend** (`NEXT_PUBLIC_API_URL`):

```
NEXT_PUBLIC_API_URL=https://tu-backend-real.dokploy.dev
```

---

## ⏱️ TIEMPO ESTIMADO: 15-20 MINUTOS

1. **Backend**: 5-8 minutos
2. **Frontend**: 3-5 minutos
3. **Actualización URLs**: 2 minutos

---

## 🎯 URLS FINALES

- **Backend API**: `https://dela-platform-api.dokploy.dev`
- **Frontend Web**: `https://dela-platform-web.dokploy.dev`
- **API Health**: `https://dela-platform-api.dokploy.dev/health`
- **API Docs**: `https://dela-platform-api.dokploy.dev/api`

---

## 📁 ARCHIVOS CONFIGURADOS

- ✅ `api/nixpacks.toml` - Build backend optimizado
- ✅ `web/nixpacks.toml` - Build frontend optimizado
- ✅ `api/.env.production` - Variables backend
- ✅ `web/.env.production` - Variables frontend
- ✅ `DOKPLOY-BACKEND.md` - Instrucciones detalladas backend
- ✅ `DOKPLOY-FRONTEND.md` - Instrucciones detalladas frontend

**¡TODO LISTO PARA DESPLIEGUE SEPARADO!** 🚀
