# 🚀 DOKPLOY - CONFIGURACIÓN LISTA PARA DESPLIEGUE

# ✅ Base de datos configurada

# ✅ Secretos generados

# ✅ Build verificado

# ==========================================

# 📋 CONFIGURACIÓN PARA DOKPLOY

# ==========================================

## 🔗 Repositorio

- URL: https://github.com/Jenaru0/dela-platform.git
- Rama: main
- Tipo: nixpacks

## ⚙️ Configuración de Build

- Install Command: npm ci --prefer-offline --no-audit
- Build Command: npm run build
- Start Command: cd api && npm run start:prod
- Port: 3000
- Health Check: /health

## 🌍 Variables de Entorno (COPIAR Y PEGAR EN DOKPLOY)

```bash
DATABASE_URL=postgresql://dela_owner:npg_o3LMdtgv4PhQ@ep-misty-glade-a8xsx3dv-pooler.eastus2.azure.neon.tech/dela?sslmode=require
JWT_SECRET=bb2626ceae438c9d0679c4185c39c4283c5f6051c8fb3a4946e9a294a77dad74
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-app.dokploy.dev
NEXT_PUBLIC_API_URL=https://your-app.dokploy.dev
ALLOWED_ORIGINS=https://your-app.dokploy.dev,https://www.your-domain.com
BCRYPT_SALT_ROUNDS=12
CORS_ENABLED=true
SESSION_SECRET=1805c1a99017fc57fa3906e68966ef8c5db0cbb68b971a2cb3bce56356025111
UPLOAD_MAX_SIZE=10485760
```

## 🔧 Configuración Avanzada (Opcional)

### Health Check

- Path: /health
- Interval: 30s
- Timeout: 10s
- Retries: 3

### Recursos

- Memory Limit: 1GB
- CPU Limit: 0.5

### Logs

- Max Size: 10MB
- Max Files: 3

## 📝 Post-Deploy Commands (Automático)

- cd api && npx prisma migrate deploy
- cd api && npx prisma generate

## 🎯 URL Final

Una vez desplegado, tu aplicación estará disponible en:

- Frontend: https://your-app.dokploy.dev
- API: https://your-app.dokploy.dev/api
- Health Check: https://your-app.dokploy.dev/health

## ⚠️ IMPORTANTE

Después del despliegue, actualiza las URLs en las variables de entorno:

- FRONTEND_URL
- NEXT_PUBLIC_API_URL
- ALLOWED_ORIGINS

¡Todo está listo para desplegar! 🚀
