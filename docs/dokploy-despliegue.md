# 🚀 Guía de Despliegue en Dokploy - Dela Platform

## ⚠️ IMPORTANTE: NO es suficiente con solo el Repository URL

En Dokploy necesitas configurar manualmente cada aplicación y sus variables de entorno. Esta guía te explica paso a paso todo lo que debes hacer.

## 📋 Prerrequisitos

1. **Servidor con Dokploy instalado**
2. **Base de datos PostgreSQL** (puedes usar la de Dokploy o externa como Neon)
3. **Dominio configurado** (opcional pero recomendado)
4. **Variables de entorno** configuradas según esta guía

## 🔧 Configuración Paso a Paso en Dokploy

### PASO 1: Crear Base de Datos (Opcional)

Si no tienes una base de datos externa:

1. **En Dokploy, ir a "Databases"**
2. **Crear nueva PostgreSQL database:**
   - Nombre: `dela-database`
   - Usuario: `dela_user`
   - Password: `[generar password seguro]`
   - Database: `dela_platform`
3. **Guardar la connection string para usar en las apps**

### PASO 2: Configurar Backend (API)

#### 2.1 Crear la Aplicación Backend:

1. **Ir a "Applications" → "Create Application"**
2. **Configurar:**
   - **Nombre**: `dela-api`
   - **Tipo**: `Docker`
   - **Repository**: `https://github.com/Jenaru0/dela-platform.git`
   - **Branch**: `main` o `develop`
   - **Build Path**: `./` (raíz del proyecto)
   - **Dockerfile Path**: `api/Dockerfile`

#### 2.2 Configuración de Build y Deploy:

- **Build Context**: `./`
- **Port**: `3000`
- **Health Check Path**: `/health`
- **Health Check Timeout**: `30s`

#### 2.3 Variables de Entorno del Backend:

```env
# Base de datos (OBLIGATORIO)
DATABASE_URL=postgresql://dela_user:tu_password@tu_host:5432/dela_platform?sslmode=require

# Autenticación (OBLIGATORIO)
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_obligatorio_2025
JWT_EXPIRES_IN=24h

# Servidor (OBLIGATORIO)
NODE_ENV=production
PORT=3000

# CORS (OBLIGATORIO)
FRONTEND_URL=https://tu-dominio.com
ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com

# Seguridad
BCRYPT_SALT_ROUNDS=12

# Opcional - Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu_sendgrid_api_key
EMAIL_FROM=noreply@tu-dominio.com
```

### PASO 3: Configurar Frontend (Web)

#### 3.1 Crear la Aplicación Frontend:

1. **Ir a "Applications" → "Create Application"**
2. **Configurar:**
   - **Nombre**: `dela-web`
   - **Tipo**: `Docker`
   - **Repository**: `https://github.com/Jenaru0/dela-platform.git`
   - **Branch**: `main` o `develop`
   - **Build Path**: `./` (raíz del proyecto)
   - **Dockerfile Path**: `web/Dockerfile`

#### 3.2 Configuración de Build y Deploy:

- **Build Context**: `./`
- **Port**: `3000`
- **Health Check Path**: `/`

#### 3.3 Variables de Entorno del Frontend:

```env
# API Backend (OBLIGATORIO)
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com

# Aplicación (OBLIGATORIO)
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_APP_NAME=Dela Platform

# URLs (si usas autenticación)
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=tu_nextauth_secret_super_seguro_2025

# Features (opcional)
NEXT_PUBLIC_ENABLE_CART=true
NEXT_PUBLIC_ENABLE_WISHLIST=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
```

### PASO 4: Configurar Dominios y SSL

#### 4.1 Para el Backend (API):

1. **En la app `dela-api`, ir a "Domains"**
2. **Agregar dominio**: `api.tu-dominio.com`
3. **Habilitar SSL automático**

#### 4.2 Para el Frontend:

1. **En la app `dela-web`, ir a "Domains"**
2. **Agregar dominio**: `tu-dominio.com`
3. **Habilitar SSL automático**

### PASO 5: Deploy y Verificación

#### 5.1 Orden de Despliegue:

1. **Primero desplegar el Backend** (`dela-api`)
2. **Esperar que esté funcionando**
3. **Luego desplegar el Frontend** (`dela-web`)

#### 5.2 Verificar que funciona:

1. **Backend**: Visitar `https://api.tu-dominio.com/health`
2. **Frontend**: Visitar `https://tu-dominio.com`

## 🔧 Configuración Avanzada

NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Dela Platform
NEXT_PUBLIC_ENVIRONMENT=production

````

### 4. Configurar Base de Datos (Opcional)

Si usas Dokploy para la base de datos:

1. Crear servicio PostgreSQL
2. Configurar:
   - **Nombre**: `dela-postgres`
   - **Usuario**: `dela_user`
   - **Contraseña**: (genera una segura)
   - **Base de datos**: `dela_platform`

### 5. Configurar Dominios

1. **API**: `api.tu-dominio.com` → `dela-api:3000`
2. **Web**: `tu-dominio.com` → `dela-web:3000`
3. **SSL**: Activar certificados automáticos

## 🔄 Proceso de Despliegue

### Orden de Despliegue:

1. Base de datos (si aplica)
2. Backend (API)
3. Frontend (Web)

### Comandos de Verificación:

```bash
# Verificar salud del backend
curl https://api.tu-dominio.com/health

# Verificar frontend
curl https://tu-dominio.com
````

## 🐛 Troubleshooting

### Error de Conexión de Base de Datos:

1. Verificar `DATABASE_URL`
2. Comprobar conectividad de red
3. Verificar credenciales

### Error de Build:

1. Verificar variables de entorno
2. Comprobar logs de build
3. Verificar dependencias en `package.json`

### Error de CORS:

1. Verificar `ALLOWED_ORIGINS`
2. Comprobar `FRONTEND_URL`
3. Verificar configuración de dominios

## 📊 Monitoreo

### Health Checks:

- **API**: `GET /health`
- **Web**: Respuesta HTTP 200

### Logs:

- Monitorear logs en tiempo real desde Dokploy
- Configurar alertas para errores críticos

## 🔒 Seguridad

### Variables Críticas:

- `JWT_SECRET`: Mínimo 32 caracteres
- `DATABASE_URL`: Conexión SSL habilitada
- Dominios HTTPS únicamente

### Backup:

- Configurar backup automático de base de datos
- Versionar despliegues para rollback rápido

## 📞 Soporte

Si encuentras problemas:

1. Revisar logs en Dokploy
2. Verificar variables de entorno
3. Comprobar conectividad de servicios
4. Consultar documentación en `docs/`
