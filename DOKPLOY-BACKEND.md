# 🚀 BACKEND API - CONFIGURACIÓN DOKPLOY

# ✅ NestJS + Prisma + PostgreSQL

## 📋 CONFIGURACIÓN PARA DOKPLOY (BACKEND)

### 🔧 **Configuración Básica**

- **Nombre**: dela-platform-api
- **Tipo**: Application
- **Build**: Nixpacks
- **Puerto**: 3000
- **Build Path**: /api

### 🔗 **Repositorio**

- **Git Repository**: https://github.com/Jenaru0/dela-platform.git
- **Branch**: develop
- **Build Directory**: api

### 🌍 **Variables de Entorno (BACKEND)**

```env
# 🔐 Base de datos
DATABASE_URL=postgresql://dela_owner:npg_o3LMdtgv4PhQ@ep-misty-glade-a8xsx3dv-pooler.eastus2.azure.neon.tech/dela?sslmode=require

# 🔑 Seguridad
JWT_SECRET=bb2626ceae438c9d0679c4185c39c4283c5f6051c8fb3a4946e9a294a77dad74
JWT_EXPIRES_IN=7d
SESSION_SECRET=1805c1a99017fc57fa3906e68966ef8c5db0cbb68b971a2cb3bce56356025111
BCRYPT_SALT_ROUNDS=12

# 🌐 Servidor
NODE_ENV=production
PORT=3000

# 🔒 CORS (actualizar después del deploy del frontend)
FRONTEND_URL=https://dela-platform-web.dokploy.dev
ALLOWED_ORIGINS=https://dela-platform-web.dokploy.dev
CORS_ENABLED=true

# 📁 Archivos
UPLOAD_MAX_SIZE=10485760
MAX_FILE_SIZE=5mb
UPLOAD_PATH=./uploads

# 📊 Configuración
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
LOG_LEVEL=info
```

### ⚙️ **Comandos de Build**

- **Install Command**: `npm ci --prefer-offline --no-audit`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`

### 🏥 **Health Check**

- **Path**: `/health`
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

### 💾 **Recursos**

- **Memory**: 1GB
- **CPU**: 0.5 cores
- **Restart Policy**: unless-stopped

### 🔄 **Post-Deploy Script**

```bash
npx prisma migrate deploy
npx prisma generate
```

### 📍 **URL Final**

- **API**: https://dela-platform-api.dokploy.dev
- **Health**: https://dela-platform-api.dokploy.dev/health
- **Docs**: https://dela-platform-api.dokploy.dev/api
