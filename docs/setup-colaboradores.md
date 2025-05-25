# 🚀 Guía de Setup para Nuevos Colaboradores

## Requisitos Previos

- **Node.js** v18+ instalado
- **Git** configurado con tu cuenta
- **npm** o **pnpm** instalado
- Acceso al repositorio GitHub

## Pasos para Comenzar

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Jenaru0/dela-platform.git
cd dela-platform
```

### 2. Configurar el Ambiente Local

**En Windows:**

```bash
./scripts/setup-dev.bat
```

**En Linux/Mac:**

```bash
chmod +x ./scripts/setup-dev.sh
./scripts/setup-dev.sh
```

### 3. Verificar la Instalación

```bash
# Verificar que todo funcione
npm run build
npm run lint
npm run test

# Iniciar desarrollo
npm run dev
```

## Workflow de Desarrollo

### Crear Nueva Feature

```bash
# Usar el script automatizado
./scripts/create-feature.sh nombre-de-tu-feature

# O manualmente:
git checkout develop
git pull origin develop
git checkout -b feature/tu-nueva-feature
```

### Estructura de Ramas

- **`main`** - Producción (solo releases)
- **`develop`** - Integración de features
- **`feature/*`** - Desarrollo de nuevas funcionalidades
- **`hotfix/*`** - Correcciones urgentes

### Convención de Commits

```bash
feat(scope): descripción de la nueva funcionalidad
fix(scope): descripción de la corrección
docs(scope): cambios en documentación
style(scope): cambios de formato/estilo
refactor(scope): refactoring de código
test(scope): agregar o corregir tests
chore(scope): tareas de mantenimiento
```

## Features Disponibles para Desarrollo

### 🔥 Prioridad Alta

- [ ] **Sistema de Autenticación** (`feature/autenticacion`)

  - Login/Register
  - JWT tokens
  - Roles de usuario

- [ ] **Carrito de Compras** (`feature/carrito-compras`)
  - Agregar/quitar productos
  - Persistencia local
  - Integración con checkout

### 📋 Prioridad Media

- [ ] **Proceso de Checkout** (`feature/checkout`)

  - Formulario de envío
  - Métodos de pago
  - Confirmación de pedido

- [ ] **Gestión de Pedidos** (`feature/gestion-pedidos`)
  - Historial de pedidos
  - Estados de pedido
  - Notificaciones

### 🎨 Mejoras de UI/UX

- [ ] **Búsqueda Avanzada** (`feature/busqueda`)

  - Filtros por categoría/precio
  - Autocompletado
  - Resultados paginados

- [ ] **Optimización Mobile** (`feature/mobile-optimization`)
  - Touch gestures
  - PWA features
  - Performance

## Estructura del Proyecto

```
dela-platform/
├── web/                    # Frontend Next.js
│   ├── src/components/     # Componentes React
│   ├── src/app/           # Pages y routing
│   └── src/lib/           # Utilidades y tipos
├── api/                   # Backend NestJS
│   ├── src/modules/       # Módulos de negocio
│   ├── prisma/           # Base de datos
│   └── test/             # Tests E2E
├── docs/                  # Documentación
├── scripts/              # Scripts de automatización
└── .github/              # CI/CD workflows
```

## Base de Datos

```bash
# Conectar a la base de datos
cd api
npx prisma studio

# Aplicar migraciones
npx prisma migrate dev

# Resetear BD (solo desarrollo)
npx prisma migrate reset --force
```

## Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:cov
```

## Comandos Útiles

```bash
# Desarrollo paralelo
npm run dev              # Inicia web + api

# Build optimizado
npm run build            # Build con Turborepo

# Linting
npm run lint             # ESLint + Prettier

# Base de datos
npm run db:studio        # Prisma Studio
npm run db:generate      # Generar cliente Prisma
```

## Troubleshooting

### Error de dependencias

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Error de Prisma

```bash
cd api
npx prisma generate
npx prisma migrate dev
```

### Error de puerto ocupado

```bash
# Cambiar puertos en .env
WEB_PORT=3001
API_PORT=3001
```

## Contacto

- **Líder del Proyecto**: [Tu nombre]
- **Canal de Slack**: #dela-platform
- **Issues**: GitHub Issues del repositorio

---

## Estado Actual del Proyecto ✅

- ✅ **Frontend modularizado** con componentes reutilizables
- ✅ **Backend base** con NestJS + Prisma
- ✅ **CI/CD pipeline** configurado
- ✅ **Turborepo monorepo** para builds optimizados
- ✅ **Git Flow workflow** establecido
- ✅ **Documentación completa** para el equipo

**¡Listo para desarrollo colaborativo!**
