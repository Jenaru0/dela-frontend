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

# Variables ARG para build-time (opcionales - se usan variables compartidas del proyecto)
ARG NEXT_PUBLIC_API_URL=https://delabackend.episundc.pe
ARG NEXT_PUBLIC_APP_NAME=DELA
ARG NEXT_PUBLIC_APP_VERSION=1.0.0
ARG DATABASE_URL
ARG JWT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

# ENV para runtime (las variables sensibles vienen del proyecto)
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION

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

# Solo variables públicas en el Dockerfile
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME  
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION

# Variables sensibles para runtime (vienen de Dokploy como build-args)
ARG DATABASE_URL
ARG JWT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

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
