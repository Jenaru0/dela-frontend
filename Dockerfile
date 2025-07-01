# 🚀 Dockerfile optimizado para Next.js - DELA Platform
# Usando multi-stage build para optimizar el tamaño de la imagen

# ========================================
# 🔨 Stage 1: Builder
# ========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Instalamos dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Copiamos archivos de configuración de paquetes
COPY web/package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY web/ ./

# Variables de entorno para el build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_STANDALONE=true

# Variables para build-time (Dokploy las pasa como --build-arg)
# ARG permite pasar la variable durante el build, ENV la hace disponible en runtime
ARG NEXT_PUBLIC_API_URL=https://delabackend.episundc.pe
ARG NEXT_PUBLIC_APP_NAME=DELA
ARG NEXT_PUBLIC_APP_VERSION=1.0.0
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Construimos la aplicación
RUN npm run build

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

# Aseguramos que el puerto esté disponible
EXPOSE 3000

# Cambiamos al usuario no-root
USER nextjs

# Comando de inicio optimizado para standalone
CMD ["node", "server.js"]
