# 🚀 Guía de Despliegue en Dokploy - Dela Platform

## 📋 Prerrequisitos

1. **Servidor con Dokploy instalado**
2. **Base de datos PostgreSQL** (puedes usar la de Dokploy o externa)
3. **Dominio configurado** (opcional pero recomendado)

## 🔧 Configuración en Dokploy

### 1. Crear Nuevo Proyecto

1. En Dokploy, crear nuevo proyecto: `dela-platform`
2. Conectar repositorio de GitHub
3. Configurar rama: `main` o `develop`

### 2. Configurar Backend (API)

#### Configuración de la Aplicación:
- **Nombre**: `dela-api`
- **Tipo**: `Docker`
- **Dockerfile**: `api/Dockerfile`
- **Puerto**: `3000`
- **Health Check Path**: `/health`

#### Variables de Entorno:
```env
DATABASE_URL=postgresql://usuario:password@host:5432/database?sslmode=require
JWT_SECRET=tu_jwt_secret_super_seguro_para_produccion
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-dominio.com
ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
BCRYPT_SALT_ROUNDS=12
```

### 3. Configurar Frontend (Web)

#### Configuración de la Aplicación:
- **Nombre**: `dela-web`
- **Tipo**: `Docker`
- **Dockerfile**: `web/Dockerfile`
- **Puerto**: `3000`

#### Variables de Entorno:
```env
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Dela Platform
NEXT_PUBLIC_ENVIRONMENT=production
```

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
```

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
