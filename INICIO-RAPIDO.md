# ⚡ Inicio Rápido - Dela Platform

## 🚀 Setup en 3 Pasos

### 1. Clonar y Configurar
```bash
git clone https://github.com/tu-usuario/dela-platform.git
cd dela-platform
npm run setup
```

### 2. Configurar Variables de Entorno
```bash
# Copiar archivos de ejemplo
cp api/.env.example api/.env
cp web/.env.example web/.env.local

# Editar con tus configuraciones
code api/.env
code web/.env.local
```

### 3. Iniciar Desarrollo
```bash
# Opción 1: Con Docker (Recomendado)
npm run docker:dev

# Opción 2: Local
npm run dev
```

## 🌐 URLs de Desarrollo
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/health
- **Prisma Studio**: http://localhost:5555

## 📋 Comandos Útiles

### Desarrollo
```bash
npm run dev          # Iniciar desarrollo
npm run build        # Build completo
npm run test         # Ejecutar tests
npm run lint         # Verificar código
```

### Base de Datos
```bash
npm run prisma:migrate  # Ejecutar migraciones
npm run prisma:studio   # Abrir Prisma Studio
npm run prisma:generate # Generar cliente
```

### Docker
```bash
npm run docker:dev   # Desarrollo con Docker
npm run docker:prod  # Producción con Docker
npm run docker:down  # Detener contenedores
```

## 🐛 Problemas Comunes

### Error de Base de Datos
1. Verificar `DATABASE_URL` en `api/.env`
2. Ejecutar `npm run prisma:migrate`

### Error de CORS
1. Verificar `FRONTEND_URL` en `api/.env`
2. Verificar `NEXT_PUBLIC_API_URL` en `web/.env.local`

### Error de Dependencias
```bash
npm run clean
npm install
npm run setup
```

## 📚 Documentación Completa
- [Variables de Entorno](docs/variables-entorno.md)
- [Git Workflow](docs/git-workflow.md)
- [Despliegue Dokploy](docs/dokploy-despliegue.md)
