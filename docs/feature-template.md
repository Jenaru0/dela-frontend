# 🚀 Plantilla para Nueva Feature

**Nombre de la Feature:** `feature/[nombre-descriptivo]`

## 📋 Checklist de Desarrollo

### Antes de Empezar

- [ ] Revisar requerimientos funcionales (docs/scope-mvp.md)
- [ ] Crear rama desde `develop`: `git checkout develop && git pull && git checkout -b feature/nueva-feature`
- [ ] Verificar que el ambiente funcione: `npm run dev`

### Durante el Desarrollo

#### Frontend (web/)

- [ ] Crear componentes necesarios en `src/components/`
- [ ] Implementar páginas en `src/app/`
- [ ] Añadir tipos TypeScript en interfaces
- [ ] Aplicar design system (colores #CC9F53, #F5EFD7)
- [ ] Verificar responsive design (mobile-first)
- [ ] Tests unitarios para componentes críticos

#### Backend (api/)

- [ ] Crear módulo en `src/modules/[nombre]/`
- [ ] Implementar DTOs para validación
- [ ] Crear controladores con decoradores NestJS
- [ ] Implementar servicios con lógica de negocio
- [ ] Actualizar schema de Prisma si es necesario
- [ ] Crear migraciones de BD: `npx prisma migrate dev`
- [ ] Tests unitarios e integración

#### Base de Datos

- [ ] Actualizar `api/prisma/schema.prisma`
- [ ] Generar migración: `npx prisma migrate dev --name feature-name`
- [ ] Actualizar seed si es necesario
- [ ] Verificar relaciones e índices

### Testing

- [ ] Tests unitarios pasando: `npm run test`
- [ ] Tests e2e para flujos críticos
- [ ] Build sin errores: `npm run build`
- [ ] Linting limpio: `npm run lint`
- [ ] Performance verificada (Lighthouse >90)

### Documentación

- [ ] Actualizar README.md si es necesario
- [ ] Documentar APIs en OpenAPI (docs/openapi.yaml)
- [ ] Screenshots de UI si hay cambios visuales
- [ ] Actualizar flujo de usuario

### Antes del PR

- [ ] Rebase con develop: `git fetch origin && git rebase origin/develop`
- [ ] Commit messages siguiendo convenciones
- [ ] Push a rama feature: `git push origin feature/nombre`
- [ ] Crear PR usando template
- [ ] Asignar reviewers apropiados

## 🎯 Estructura de Archivos Recomendada

### Para Features Frontend

```
web/src/
├── components/
│   ├── [feature-name]/
│   │   ├── [ComponentName].tsx
│   │   ├── [ComponentName].test.tsx
│   │   └── index.ts
│   └── common/
├── app/
│   └── [feature-route]/
│       ├── page.tsx
│       ├── loading.tsx
│       └── error.tsx
├── hooks/
│   └── use[FeatureName].ts
└── types/
    └── [feature-name].ts
```

### Para Features Backend

```
api/src/
├── modules/
│   └── [feature-name]/
│       ├── dto/
│       │   ├── create-[entity].dto.ts
│       │   └── update-[entity].dto.ts
│       ├── entities/
│       │   └── [entity].entity.ts
│       ├── [feature-name].controller.ts
│       ├── [feature-name].service.ts
│       ├── [feature-name].module.ts
│       └── tests/
│           ├── [feature-name].controller.spec.ts
│           └── [feature-name].service.spec.ts
```

## 🔧 Comandos Útiles Durante Desarrollo

```bash
# Desarrollo
npm run dev                 # Iniciar desarrollo completo
npm run dev:web            # Solo frontend
npm run dev:api            # Solo backend

# Testing
npm run test               # Tests unitarios
npm run test:watch         # Tests en modo watch
npm run test:e2e          # Tests end-to-end

# Base de datos
npx prisma studio         # UI para ver/editar datos
npx prisma migrate dev    # Crear nueva migración
npx prisma generate       # Regenerar cliente

# Calidad de código
npm run lint              # Verificar código
npm run lint:fix          # Corregir automáticamente
npm run format            # Formatear con Prettier
npm run type-check        # Verificar tipos TypeScript

# Build y deploy
npm run build             # Build completo
npm run clean             # Limpiar cache
```

## 🎨 Guías de Estilo

### Componentes React

```tsx
// Usar export default y interfaces descriptivas
interface ProductCardProps {
  product: Product;
  onSelect?: (id: string) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onSelect,
  className,
}: ProductCardProps) {
  // Lógica del componente
}
```

### Servicios NestJS

```typescript
@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    // Implementación
  }
}
```

### Commits

```bash
feat(catalogo): implementar filtros de búsqueda avanzada
fix(auth): corregir validación de tokens JWT
docs(readme): actualizar instrucciones de instalación
```

## 🚨 Criterios de Aceptación

Una feature está lista cuando:

- [ ] Funcionalidad completa según requerimientos
- [ ] Tests cubren casos principales (>80% cobertura)
- [ ] UI responsive y accesible
- [ ] Performance optimizada
- [ ] Documentación actualizada
- [ ] Code review aprobado
- [ ] CI/CD pipeline verde

## 🤝 Revisión de Código

### Que buscar en Reviews

- **Funcionalidad**: ¿Cumple los requerimientos?
- **Seguridad**: ¿Hay vulnerabilidades?
- **Performance**: ¿Es eficiente?
- **Mantenibilidad**: ¿Es fácil de entender?
- **Testing**: ¿Está bien cubierto?

### Como dar feedback constructivo

- Ser específico y explicar el "por qué"
- Sugerir alternativas cuando sea posible
- Reconocer el buen trabajo
- Enfocarse en el código, no en la persona

---

**¡Recuerda!** Siempre seguir las mejores prácticas del equipo y no dudar en preguntar cuando tengas dudas.
