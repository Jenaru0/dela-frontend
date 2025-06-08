# 🚀 Dockerfile optimizado para Next.js - DELA Platform
# Usando multi-stage build para optimizar el tamaño de la imagen

# ========================================
# 📦 Stage 1: Dependencies
# ========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos solo los archivos de dependencias
COPY web/package*.json ./
RUN npm ci --only=production

# ========================================
# 🔨 Stage 2: Builder
# ========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos las dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY web/ ./

# Variables de entorno para el build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Construimos la aplicación
RUN npm run build

# ========================================
# 🚀 Stage 3: Runner (Imagen final)
# ========================================
FROM node:20-alpine AS runner
WORKDIR /app

# Variables de entorno para producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=80
ENV HOSTNAME=0.0.0.0

# Creamos un usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos los archivos necesarios para ejecutar
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Exponemos el puerto
EXPOSE 80

# Cambiamos al usuario no-root
USER nextjs

# Comando de inicio
CMD ["node", "server.js"]
