# Variables de Entorno - Dela Platform

Esta documentación describe todas las variables de entorno necesarias para el correcto funcionamiento de la plataforma Dela Platform en desarrollo y producción.

## 📁 Estructura de Archivos de Entorno

```
dela-platform/
├── api/
│   ├── .env                    # Variables actuales de desarrollo (Backend)
│   ├── .env.example           # Ejemplo de configuración (Backend)
│   └── .env.production        # Variables para producción (Backend)
└── web/
    ├── .env.local             # Variables actuales de desarrollo (Frontend)
    ├── .env.example           # Ejemplo de configuración (Frontend)
    └── .env.production        # Variables para producción (Frontend)
```

## 🔧 Backend (API) - Variables de Entorno

### Base de Datos

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `BCRYPT_SALT_ROUNDS`: Número de rondas para el hash de contraseñas (10-12)

### Autenticación JWT

- `JWT_SECRET`: Clave secreta para firmar tokens JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración de tokens (ej: "7d", "24h")

### Servidor

- `PORT`: Puerto del servidor (por defecto 3000)
- `NODE_ENV`: Entorno de ejecución (development/production)

### CORS

- `FRONTEND_URL`: URL del frontend para CORS
- `ALLOWED_ORIGINS`: Lista de orígenes permitidos separados por comas

### Archivos y Uploads

- `MAX_FILE_SIZE`: Tamaño máximo de archivo (ej: "5mb")
- `UPLOAD_PATH`: Ruta donde se guardan los archivos subidos

### Email (Opcional)

- `SMTP_HOST`: Servidor SMTP
- `SMTP_PORT`: Puerto SMTP (587 para TLS)
- `SMTP_USER`: Usuario SMTP
- `SMTP_PASS`: Contraseña SMTP
- `EMAIL_FROM`: Email remitente por defecto

### Paginación

- `DEFAULT_PAGE_SIZE`: Tamaño de página por defecto (10-20)
- `MAX_PAGE_SIZE`: Tamaño máximo de página (100)

### Redis (Opcional)

- `REDIS_HOST`: Host de Redis
- `REDIS_PORT`: Puerto de Redis (6379)
- `REDIS_PASSWORD`: Contraseña de Redis

### Logs

- `LOG_LEVEL`: Nivel de logs (info/warn/error)

## 🎨 Frontend (Web) - Variables de Entorno

### API Backend

- `NEXT_PUBLIC_API_URL`: URL de la API backend
- `NEXT_PUBLIC_API_TIMEOUT`: Timeout para peticiones HTTP (ms)

### Aplicación

- `NEXT_PUBLIC_APP_NAME`: Nombre de la aplicación
- `NEXT_PUBLIC_APP_VERSION`: Versión de la aplicación
- `NEXT_PUBLIC_APP_DESCRIPTION`: Descripción de la aplicación

### Entorno

- `NODE_ENV`: Entorno de Node.js
- `NEXT_PUBLIC_ENVIRONMENT`: Entorno público (development/production)

### URLs y Autenticación

- `NEXTAUTH_URL`: URL base para NextAuth.js
- `NEXTAUTH_SECRET`: Secreto para NextAuth.js

### Imágenes y Assets

- `NEXT_PUBLIC_IMAGES_DOMAIN`: Dominio permitido para imágenes
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Nombre de cloud en Cloudinary
- `NEXT_PUBLIC_CLOUDINARY_API_KEY`: API Key de Cloudinary

### Analytics (Opcional)

- `NEXT_PUBLIC_GA_TRACKING_ID`: ID de Google Analytics
- `NEXT_PUBLIC_HOTJAR_ID`: ID de Hotjar

### Pagos (Opcional)

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Clave pública de Stripe
- `STRIPE_SECRET_KEY`: Clave secreta de Stripe

### Mapas (Opcional)

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: API Key de Google Maps

### Notificaciones

- `NEXT_PUBLIC_ENABLE_NOTIFICATIONS`: Habilitar notificaciones (true/false)
- `NEXT_PUBLIC_NOTIFICATION_DURATION`: Duración de notificaciones (ms)

### Cache y Performance

- `NEXT_PUBLIC_CACHE_DURATION`: Duración del cache (ms)
- `NEXT_PUBLIC_ENABLE_SW`: Habilitar Service Worker (true/false)

### Feature Flags

- `NEXT_PUBLIC_ENABLE_CART`: Habilitar carrito de compras
- `NEXT_PUBLIC_ENABLE_WISHLIST`: Habilitar lista de deseos
- `NEXT_PUBLIC_ENABLE_REVIEWS`: Habilitar reseñas
- `NEXT_PUBLIC_ENABLE_CHAT`: Habilitar chat en vivo

## 🚀 Configuración para Desarrollo

### 1. Backend (API)

```bash
cd api
cp .env.example .env
# Editar .env con tus valores específicos
```

### 2. Frontend (Web)

```bash
cd web
cp .env.example .env.local
# Editar .env.local con tus valores específicos
```

## 📦 Configuración para Producción

### 1. Backend (API)

```bash
cp .env.production .env
# Configurar todas las variables con valores de producción
```

### 2. Frontend (Web)

```bash
cp .env.production .env.local
# Configurar todas las variables con valores de producción
```

## ⚠️ Consideraciones de Seguridad

1. **Nunca** commitear archivos `.env` reales al repositorio
2. **Siempre** usar secretos únicos y seguros para producción
3. **Rotar** regularmente las claves JWT y secretos
4. **Usar** variables de entorno del proveedor de hosting en producción
5. **Validar** todas las variables de entorno al inicio de la aplicación

## 🔄 Variables Requeridas vs Opcionales

### ✅ Requeridas (Backend)

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`

### ✅ Requeridas (Frontend)

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NODE_ENV`

### 🔧 Opcionales

- Variables de email
- Variables de Redis
- Variables de analytics
- Variables de pagos
- Variables de mapas

## 📝 Scripts de Validación

Considera agregar scripts para validar que todas las variables requeridas estén configuradas antes de iniciar la aplicación.
