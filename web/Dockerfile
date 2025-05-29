# Etapa de construcción
FROM node:18-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY turbo.json ./
COPY web/package*.json ./web/

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build --filter=web

# Etapa de producción
FROM node:18-alpine AS runner

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para Next.js
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/web/public ./web/public

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["node", "web/server.js"]
