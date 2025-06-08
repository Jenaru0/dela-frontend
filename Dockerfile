# 🚀 Dockerfile optimizado para Next.js - DELA Platform
# Usando multi-stage build para optimizar el tamaño de la imagen

# ========================================
# 🔨 Stage 1: Builder
# ========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Instalamos libc6-compat para compatibilidad
RUN apk add --no-cache libc6-compat

# Copiamos package.json primero
COPY web/package*.json ./

# Instalamos todas las dependencias (incluyendo devDependencies para el build)
# Usamos npm ci con cache para builds más rápidos y suprimimos warnings
RUN npm ci --no-audit --no-fund --silent

# Copiamos el resto del código
COPY web/ ./

# Variables de entorno para el build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Construimos la aplicación con logging reducido
RUN npm run build --silent

# ========================================
# 🚀 Stage 2: Runner (Imagen final)
# ========================================
FROM node:20-alpine AS runner
WORKDIR /app

# Variables de entorno para producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Creamos un usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos los archivos necesarios para ejecutar
COPY --from=builder /app/public ./public

# Verificamos que .next/standalone existe y lo copiamos
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Exponemos el puerto
EXPOSE 3000

# Cambiamos al usuario no-root
USER nextjs

# Comando de inicio
CMD ["node", "server.js"]
