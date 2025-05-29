# 🚀 DESPLIEGUE SEPARADO - DOKPLOY

# ✅ Frontend y Backend independientes

## 📋 **ORDEN DE DESPLIEGUE (IMPORTANTE)**

### 1️⃣ **DESPLEGAR PRIMERO: BACKEND API**

#### Configuración Dokploy (Backend):

- **Nombre**: `dela-platform-api`
- **Repositorio**: `https://github.com/Jenaru0/dela-platform.git`
- **Branch**: `develop`
- **Build Directory**: `api`
- **Build Type**: Nixpacks
- **Puerto**: 3000

#### Variables de Entorno (Backend):

```env
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

#### Comandos (Backend):

- **Install**: `npm ci --prefer-offline --no-audit`
- **Build**: `npm run build`
- **Start**: `npm run start:prod`
- **Health Check**: `/health`

---

### 2️⃣ **DESPLEGAR SEGUNDO: FRONTEND WEB**

#### Configuración Dokploy (Frontend):

- **Nombre**: `dela-platform-web`
- **Repositorio**: `https://github.com/Jenaru0/dela-platform.git`
- **Branch**: `develop`
- **Build Directory**: `web`
- **Build Type**: Nixpacks
- **Puerto**: 3000

#### Variables de Entorno (Frontend):

```env
NEXT_PUBLIC_API_URL=https://dela-platform-api.dokploy.dev
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### Comandos (Frontend):

- **Install**: `npm ci --prefer-offline --no-audit`
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Health Check**: `/`

---

### 3️⃣ **ACTUALIZAR URLS DESPUÉS DEL DESPLIEGUE**

Una vez que tengas las URLs reales de Dokploy, actualiza estas variables:

#### En el Backend:

```env
FRONTEND_URL=https://tu-frontend-real.dokploy.dev
ALLOWED_ORIGINS=https://tu-frontend-real.dokploy.dev
```

#### En el Frontend:

```env
NEXT_PUBLIC_API_URL=https://tu-backend-real.dokploy.dev
```

---

## 🎯 **RESULTADO ESPERADO**

- ✅ **Backend API**: `https://dela-platform-api.dokploy.dev`
- ✅ **Frontend Web**: `https://dela-platform-web.dokploy.dev`
- ✅ **Health Checks**: Funcionando independientemente
- ✅ **Base de datos**: Migraciones aplicadas automáticamente
- ✅ **CORS**: Configurado entre frontend y backend

---

## 📁 **ARCHIVOS CONFIGURADOS**

- ✅ `api/nixpacks.toml` - Build optimizado para backend
- ✅ `web/nixpacks.toml` - Build optimizado para frontend
- ✅ `DOKPLOY-BACKEND.md` - Instrucciones detalladas backend
- ✅ `DOKPLOY-FRONTEND.md` - Instrucciones detalladas frontend

---

## ⚡ **VENTAJAS DEL DESPLIEGUE SEPARADO**

1. **Escalabilidad**: Escalar frontend/backend independientemente
2. **Mantenimiento**: Actualizaciones sin afectar el otro servicio
3. **Debugging**: Logs y errores más específicos
4. **Performance**: Optimización específica por servicio
5. **Costo**: Recursos asignados según necesidades

**¡Listo para desplegar por separado en Dokploy!** 🚀
