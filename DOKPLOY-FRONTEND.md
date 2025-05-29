# 🎨 FRONTEND WEB - CONFIGURACIÓN DOKPLOY

# ✅ Next.js 15 + Tailwind CSS v4.1

## 📋 CONFIGURACIÓN PARA DOKPLOY (FRONTEND)

### 🔧 **Configuración Básica**

- **Nombre**: dela-platform-web
- **Tipo**: Application
- **Build**: Nixpacks
- **Puerto**: 3000
- **Build Path**: /web

### 🔗 **Repositorio**

- **Git Repository**: https://github.com/Jenaru0/dela-platform.git
- **Branch**: develop
- **Build Directory**: web

### 🌍 **Variables de Entorno (FRONTEND)**

```env
# 🌐 API Connection (actualizar después del deploy del backend)
NEXT_PUBLIC_API_URL=https://dela-platform-api.dokploy.dev

# 🚀 Next.js
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# 🎨 Tailwind CSS v4.1 (ya configurado)
# No se requieren variables adicionales
```

### ⚙️ **Comandos de Build**

- **Install Command**: `npm ci --prefer-offline --no-audit`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

### 🏥 **Health Check**

- **Path**: `/`
- **Interval**: 30s
- **Timeout**: 10s
- **Retries**: 3

### 💾 **Recursos**

- **Memory**: 512MB
- **CPU**: 0.25 cores
- **Restart Policy**: unless-stopped

### 📍 **URL Final**

- **Web App**: https://dela-platform-web.dokploy.dev

### 🔗 **Dependencias**

- ✅ **Tailwind CSS v4.1.8** - Configurado correctamente
- ✅ **@tailwindcss/postcss** - Plugin configurado
- ✅ **PostCSS** - Configuración optimizada
- ✅ **Next.js 15** - Build optimizado para producción
