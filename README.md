# DELA Platform - Frontend

Frontend de la plataforma de e-commerce DELA, desarrollado con Next.js 14 y tecnologías modernas.

## 🚀 Características

- ⚡ Next.js 14 con App Router
- 🎨 Tailwind CSS para estilos
- 📱 Diseño responsive y mobile-first
- 🛒 Carrito de compras funcional
- ❤️ Sistema de favoritos
- 🔍 Búsqueda y filtrado de productos
- 📦 Gestión de categorías
- 🎯 Optimizado para producción

## 🛠️ Tecnologías

- **Framework:** Next.js 14
- **Estilos:** Tailwind CSS
- **Lenguaje:** TypeScript
- **Estado:** Context API de React
- **Imágenes:** Next.js Image Optimization

## 📦 Instalación y Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/Jenaru0/dela-platform.git
cd dela-platform

# Instalar dependencias
cd web && npm install

# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm run start
```

## 🚀 CI/CD y Deploy

### Configuración Automática

- **GitHub Actions**: Validación automática en cada push
- **Dokploy**: Deploy automático desde `frontend/production`
- **Nixpacks**: Build optimizado para producción

### Variables de Entorno (Dokploy)

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=https://delabackend.episundc.pe
HOSTNAME=0.0.0.0
PORT=3000
```

**⚠️ IMPORTANTE**: La variable `NEXT_PUBLIC_API_URL` debe estar configurada en Dokploy para que el frontend funcione correctamente. Ver [DOKPLOY_CONFIG.md](./DOKPLOY_CONFIG.md) para instrucciones detalladas.

### Proceso de Deploy

1. Push a `frontend/production` → GitHub Actions valida código
2. Dokploy detecta cambios → Build automático con Nixpacks
3. Deploy en producción → Sitio actualizado

## 📁 Estructura del Proyecto

```
├── web/                   # Aplicación Next.js
│   ├── src/
│   │   ├── app/          # App Router de Next.js
│   │   ├── components/   # Componentes reutilizables
│   │   ├── context/      # Context API
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilidades y configuración
│   │   ├── services/     # Servicios y APIs
│   │   └── types/        # Tipos TypeScript
│   ├── public/           # Archivos estáticos
│   ├── package.json      # Dependencias del frontend
│   └── nixpacks.toml     # Configuración de deploy
├── .github/workflows/    # CI/CD con GitHub Actions
├── package.json          # Metadatos del proyecto
└── README.md            # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# En el directorio /web
npm run dev         # Desarrollo
npm run build       # Build para producción
npm run start       # Ejecutar build de producción
npm run lint        # Linting
npm run type-check  # Verificar tipos TypeScript
```

## 🌐 URLs

- **Desarrollo:** http://localhost:3000
- **Producción:** [Configurar en Dokploy]

## 📝 Notas de Desarrollo

- Esta es la rama de producción del frontend (`frontend/production`)
- Optimizada para despliegue independiente en Dokploy
- CI/CD automatizado con GitHub Actions
- Build optimizado con Nixpacks para máximo rendimiento
