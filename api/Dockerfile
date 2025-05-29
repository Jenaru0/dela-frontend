# ===========================================
# DOCKERFILE - BACKEND API INDEPENDIENTE
# ===========================================
# Optimizado para deployment separado en Dokploy

# Etapa de construcción
FROM node:18-alpine AS builder

# Instalar dependencias del sistema y herramientas necesarias
RUN apk add --no-cache libc6-compat curl

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo archivos necesarios para el backend
COPY api/package*.json ./
COPY api/prisma ./prisma/

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Instalar dependencias de desarrollo para build
RUN npm ci

# Copiar código fuente del backend
COPY api/src ./src/
COPY api/nest-cli.json ./
COPY api/tsconfig*.json ./

# Generar Prisma Client
RUN npx prisma generate

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat curl

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de producción
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist/
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules/
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma/
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Crear directorio para logs
RUN mkdir -p logs && chown nestjs:nodejs logs

# Cambiar a usuario no-root
USER nestjs

# Exponer puerto
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Comando de inicio con migraciones automáticas
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["node", "dist/main.js"]
