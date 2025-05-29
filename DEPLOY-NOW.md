# 🚀 CONFIGURACIÓN FINAL PARA DOKPLOY

# ✅ Todo listo para despliegue inmediato

## 📋 PASOS PARA DESPLEGAR EN DOKPLOY

### 1️⃣ CREAR PROYECTO EN DOKPLOY

**Configuración básica:**

- **Nombre**: dela-platform
- **Tipo**: Application
- **Build**: Nixpacks
- **Puerto**: 3000

### 2️⃣ CONFIGURAR REPOSITORIO

- **Git Repository**: https://github.com/Jenaru0/dela-platform.git
- **Branch**: main
- **Build Path**: / (raíz del proyecto)

### 3️⃣ VARIABLES DE ENTORNO (COPIAR EXACTAMENTE)

```env
DATABASE_URL=postgresql://dela_owner:npg_o3LMdtgv4PhQ@ep-misty-glade-a8xsx3dv-pooler.eastus2.azure.neon.tech/dela?sslmode=require
JWT_SECRET=bb2626ceae438c9d0679c4185c39c4283c5f6051c8fb3a4946e9a294a77dad74
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
BCRYPT_SALT_ROUNDS=12
CORS_ENABLED=true
SESSION_SECRET=1805c1a99017fc57fa3906e68966ef8c5db0cbb68b971a2cb3bce56356025111
UPLOAD_MAX_SIZE=10485760
```

### 4️⃣ CONFIGURACIÓN DE BUILD

**Install Command:**

```bash
npm ci --prefer-offline --no-audit --progress=false
```

**Build Command:**

```bash
npm run build
```

**Start Command:**

```bash
cd api && npm run start:prod
```

### 5️⃣ CONFIGURACIÓN DE SALUD

- **Health Check Path**: `/health`
- **Health Check Interval**: 30s
- **Health Check Timeout**: 10s
- **Health Check Retries**: 3

### 6️⃣ CONFIGURACIÓN DE RECURSOS

- **Memory Limit**: 1GB
- **CPU Limit**: 0.5 cores
- **Restart Policy**: unless-stopped

### 7️⃣ DESPUÉS DEL PRIMER DESPLIEGUE

Una vez que obtengas tu URL de Dokploy (ej: `https://dela-platform-xyz.dokploy.dev`), actualiza estas variables:

```env
FRONTEND_URL=https://tu-url-dokploy.dokploy.dev
NEXT_PUBLIC_API_URL=https://tu-url-dokploy.dokploy.dev
ALLOWED_ORIGINS=https://tu-url-dokploy.dokploy.dev
```

## 🎯 RESULTADO ESPERADO

- ✅ **Frontend**: Accesible en tu URL de Dokploy
- ✅ **API**: Disponible en `tu-url/api`
- ✅ **Health Check**: Funcionando en `tu-url/health`
- ✅ **Base de datos**: Conectada y migraciones aplicadas automáticamente

## ⏱️ TIEMPO ESTIMADO DE DESPLIEGUE

- **Configuración**: 5 minutos
- **Build y deploy**: 5-10 minutos
- **Total**: 10-15 minutos

## 🔧 ARCHIVOS CRÍTICOS YA CONFIGURADOS

- ✅ `nixpacks.toml` - Build optimizado
- ✅ `turbo.json` - Monorepo configurado
- ✅ `api/.env` - Variables con BD real
- ✅ `web/postcss.config.js` - Tailwind v4.1
- ✅ Scripts de migración automática

¡TODO ESTÁ LISTO! Solo sube la URL del repositorio a Dokploy y despliega. 🚀
