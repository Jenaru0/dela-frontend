# 🚀 Flujo de Trabajo Git - Plataforma DELA

## 📋 Estructura de Ramas

### Ramas Principales
- **`main`**: Producción estable, solo código probado y listo para deploy
- **`develop`**: Integración continua, punto de unión de todas las features

### Ramas de Características (Features)
```
feature/componentes-ui           # Base UI components y design system
feature/catalogo-productos       # RF01+RF02: Catálogo y búsqueda de productos
feature/autenticacion-usuario    # RF03: Login/registro con JWT
feature/carrito-compras         # RF04: Carrito de compras + cálculo subtotal
feature/proceso-checkout        # RF05: Checkout + integración Stripe
feature/gestion-pedidos         # RF06: Gestión de órdenes y tracking
feature/control-inventario      # RF07: Manejo de inventario y stock
feature/sistema-notificaciones  # RF08: Emails de confirmación y alerts
```

### Ramas de Mantenimiento
- **`release/v1.0.0`**: Preparación de releases
- **`hotfix/descripcion-breve`**: Correcciones críticas en producción

## 🎯 Convenciones de Commits (Español)

### Formato
```
<tipo>(ámbito): descripción corta

Descripción opcional más detallada

- Lista de cambios específicos
- Otro cambio importante
```

### Tipos de Commit
- **`feat`**: Nueva funcionalidad
- **`fix`**: Corrección de errores
- **`docs`**: Documentación
- **`style`**: Formato, espacios, punto y coma
- **`refactor`**: Refactoring de código
- **`test`**: Añadir o modificar pruebas
- **`chore`**: Tareas de mantenimiento

### Ejemplos
```bash
feat(catalogo): implementar filtros por categoría en productos
fix(ui): corregir responsive en componente ProductCard
docs(readme): actualizar instrucciones de instalación
refactor(layout): reorganizar estructura de componentes
test(productos): añadir pruebas unitarias para ProductService
```

## 🔄 Flujo de Trabajo Recomendado

### 1. Iniciar Nueva Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad
```

### 2. Desarrollo Iterativo
```bash
# Hacer cambios...
git add .
git commit -m "feat(ámbito): descripción del cambio"
git push origin feature/nueva-funcionalidad
```

### 3. Actualizar con Develop (Diario)
```bash
git fetch origin
git rebase origin/develop
```

### 4. Finalizar Feature
```bash
# Crear Pull Request hacia develop
# Después de aprobación y merge:
git checkout develop
git pull origin develop
git branch -d feature/nueva-funcionalidad
```

### 5. Release
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
# Hacer ajustes finales, changelog, versioning
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags
git checkout develop
git merge release/v1.0.0
```

## 📁 Estructura de Directorios

### Frontend (web/)
```
src/
├── app/                     # Next.js app router
├── components/
│   ├── common/             # Componentes reutilizables
│   ├── layout/             # Layout components (Header, Footer)
│   ├── sections/           # Secciones de página
│   └── ui/                 # Componentes base del design system
├── lib/                    # Utilidades y configuraciones
├── hooks/                  # Custom React hooks
├── types/                  # Definiciones de TypeScript
└── styles/                 # Estilos globales
```

### Backend (api/)
```
src/
├── modules/                # Módulos de negocio
│   ├── productos/
│   ├── usuarios/
│   ├── pedidos/
│   └── auth/
├── common/                 # Utilidades compartidas
├── config/                 # Configuraciones
└── database/               # Migraciones y seeds
```

## 🧪 Estrategia de Testing

### Antes de Commit
- [ ] Linting sin errores (`npm run lint`)
- [ ] Build exitoso (`npm run build`)
- [ ] Tests unitarios pasando (`npm test`)

### Antes de PR
- [ ] Tests e2e pasando
- [ ] Documentación actualizada
- [ ] Screenshots si hay cambios UI

## 🔒 Protección de Ramas

### main
- Requiere PR review
- Status checks obligatorios
- No push directo

### develop  
- Requiere PR review
- Tests automáticos
- Deploy automático a staging

## 📊 Métricas y Monitoreo

- Cobertura de tests > 80%
- Build time < 5 minutos
- Bundle size monitoreado
- Performance Lighthouse > 90

---
**Última actualización:** Mayo 2025
**Versión:** 1.0.0
