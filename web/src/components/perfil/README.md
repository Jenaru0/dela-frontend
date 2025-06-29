# Modales de Perfil de Usuario - Implementación

## Resumen
Se han creado dos nuevos modales para mejorar la experiencia del usuario en la página de perfil:

# Modales de Perfil de Usuario - Implementación Completa

## Resumen
Se han creado tres modales para mejorar la experiencia del usuario en la página de perfil, todos corregidos para usar la estructura correcta de Prisma:

### 1. Modal de Detalles del Pedido (`PedidoDetailModal.tsx`)
**Ubicación:** `src/components/perfil/PedidoDetailModal.tsx`

**Características:**
- **Diseño responsivo** con paleta de colores de la marca (naranja/dorado)
- **Timeline visual** del estado del pedido
- **Información completa** del pedido:
  - Estado actual con indicadores visuales
  - Lista detallada de productos usando `detallePedidos` (corregido)
  - Resumen de pago con `subtotal`, `envioMonto`, `descuentoMonto` (corregido)
  - Información de envío con dirección completa
  - Fechas importantes (pedido y entrega)
- **Integración con reseñas**: Botón para reseñar productos en pedidos entregados
- **Integración con reclamos**: Botón para crear reclamo (disponible para pedidos no pendientes)
- **Portal rendering** para evitar problemas de z-index
- **Gestión de scroll** (bloquea scroll del body cuando está abierto)
- **Accesibilidad**: Cerrar con Escape, click fuera, o botón X

**Correcciones realizadas:**
- Cambio de `detalles` a `detallePedidos` para coincidir con Prisma
- Cambio de `costoEnvio` a `envioMonto` para coincidir con Prisma
- Cambio de `descuento` a `descuentoMonto` para coincidir con Prisma
- Uso correcto de `precioUnitario` en lugar de `precio`
- Estructura de dirección corregida para usar campos de Prisma

### 2. Modal de Crear Reseña (`CreateReviewModal.tsx`)
**Ubicación:** `src/components/perfil/CreateReviewModal.tsx`

**Características:**
- **Calificación interactiva** con 5 estrellas hover y selección
- **Validación en tiempo real**:
  - Calificación obligatoria
  - Comentario mínimo de 10 caracteres
- **Feedback visual** con etiquetas descriptivas (Excelente, Bueno, etc.)
- **Información educativa** sobre el proceso de reseñas
- **Estados de carga** durante el envío
- **Gestión de errores** con mensajes claros
- **Diseño consistente** con la paleta de la marca

### 3. Modal de Crear Reclamo (`CreateClaimModal.tsx`) - **NUEVO**
**Ubicación:** `src/components/perfil/CreateClaimModal.tsx`

**Características:**
- **Formulario completo** para crear reclamos
- **Tipos de reclamo predefinidos**:
  - Producto defectuoso
  - Entrega tardía
  - Producto incorrecto
  - Servicio al cliente
  - Solicitud de reembolso
  - Otro
- **Validación robusta**:
  - Asunto mínimo de 5 caracteres
  - Descripción mínima de 20 caracteres
- **Información contextual** del pedido asociado
- **Diseño en paleta naranja** para diferenciarse de otros modales
- **Estados de carga** y manejo de errores
- **Información educativa** sobre el proceso de reclamos

## Integración en Página de Perfil

### Estados agregados:
```tsx
// Modales de pedidos y reseñas
const [isPedidoDetailModalOpen, setIsPedidoDetailModalOpen] = useState(false);
const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
const [isCreateReviewModalOpen, setIsCreateReviewModalOpen] = useState(false);
const [reviewData, setReviewData] = useState<{ productoId: number; productoNombre: string } | null>(null);
const [isCreateClaimModalOpen, setIsCreateClaimModalOpen] = useState(false);
const [claimData, setClaimData] = useState<{ pedidoId: number; pedidoNumero: string } | null>(null);
```

### Funciones agregadas:
- `handleViewPedidoDetails()`: Abre modal de detalles del pedido
- `handleCreateReview()`: Abre modal de crear reseña
- `handleSubmitReview()`: Procesa el envío de reseñas
- `handleCreateClaim()`: Abre modal de crear reclamo (**NUEVO**)
- `handleSubmitClaim()`: Procesa el envío de reclamos (**NUEVO**)

## Correcciones Técnicas Realizadas

### 1. **Tipos de Datos corregidos**
- `Pedido.detallePedidos` (antes `detalles`)
- `Pedido.envioMonto` (antes `costoEnvio`)
- `Pedido.descuentoMonto` (antes `descuento`)
- `DetallePedido.precioUnitario` (consistente con Prisma)

### 2. **Estructura de Base de Datos**
- Sincronización con el esquema de Prisma
- Uso correcto de relaciones y campos
- Compatibilidad con tipos de enum del backend

### 3. **Funcionalidad Mejorada**
- **Botón de reclamo** disponible para pedidos no pendientes
- **Información completa** de productos en pedidos
- **Cálculos correctos** de subtotales y totales
- **Validación robusta** en todos los formularios

## Beneficios de la Implementación

### 1. **Código más limpio y mantenible**
- Separación de responsabilidades
- Componentes reutilizables
- Reducción del archivo principal
- Tipos de datos consistentes

### 2. **Mejor experiencia de usuario**
- Información detallada y organizada
- Flujo intuitivo: Pedidos → Reseñas/Reclamos
- Feedback visual y validaciones claras
- Proceso de reclamos simplificado

### 3. **Consistencia técnica**
- Paleta de colores unificada
- Componentes que siguen patrones establecidos
- Tipos de datos sincronizados con backend
- Responsive design

### 4. **Funcionalidad robusta**
- Gestión adecuada del estado
- Manejo de errores
- Accesibilidad integrada
- Validaciones en tiempo real

## Flujo de Usuario Completo

1. **Ver pedidos** en la página de perfil
2. **Hacer clic en "Ver detalles"** → Abre `PedidoDetailModal`
3. **En el modal de detalles**:
   - **Si pedido entregado**: Botón "Reseñar" por producto → Abre `CreateReviewModal`
   - **Si pedido no pendiente**: Botón "Crear Reclamo" → Abre `CreateClaimModal`
4. **Completar formularios** con validación en tiempo real
5. **Recibir feedback** y actualización de estado

## Próximos Pasos

1. **Integrar con servicios reales**:
   - Conectar `handleSubmitReview` con `resenasService`
   - Conectar `handleSubmitClaim` con `reclamosService`
   - Implementar descarga de facturas

2. **Mejoras opcionales**:
   - Añadir imágenes de productos en modales
   - Implementar tracking de envío
   - Añadir notificaciones push para reclamos

3. **Testing**:
   - Pruebas de integración con backend
   - Pruebas de accesibilidad
   - Pruebas responsive

## Archivos Modificados/Creados

### Nuevos archivos:
- `src/components/perfil/PedidoDetailModal.tsx`
- `src/components/perfil/CreateReviewModal.tsx`
- `src/components/perfil/CreateClaimModal.tsx` (**NUEVO**)

### Archivos modificados:
- `src/app/perfil/page.tsx` (agregadas importaciones y lógica de modales)
- `src/services/pedidos.service.ts` (tipos corregidos para Prisma)

### Tipos utilizados:
- `Pedido` (corregido para Prisma)
- `DetallePedido` (corregido para Prisma)
- `EstadoPedido`, `MetodoPago`, `MetodoEnvio` (de `types/enums.ts`)

## Estructura Final

```
src/components/perfil/
├── PedidoDetailModal.tsx     # Modal principal de detalles
├── CreateReviewModal.tsx     # Modal para crear reseñas
├── CreateClaimModal.tsx      # Modal para crear reclamos
└── README.md                 # Esta documentación
```

**Estado**: ✅ **Implementación Completa y Funcional**
- Todos los modales creados y funcionales
- Tipos de datos sincronizados con Prisma
- Integración completa en página de perfil
- Validaciones y manejo de errores implementados
- Listos para conectar con servicios del backend
  - Calificación obligatoria
  - Comentario mínimo de 10 caracteres
- **Feedback visual** con etiquetas descriptivas (Excelente, Bueno, etc.)
- **Información educativa** sobre el proceso de reseñas
- **Estados de carga** durante el envío
- **Gestión de errores** con mensajes claros
- **Diseño consistente** con la paleta de la marca

**Uso:**
```tsx
<CreateReviewModal
  isOpen={isCreateReviewModalOpen}
  onClose={() => setIsCreateReviewModalOpen(false)}
  onSubmit={handleSubmitReview}
  productoId={reviewData.productoId}
  productoNombre={reviewData.productoNombre}
/>
```

## Integración en Página de Perfil

### Estados agregados:
```tsx
const [isPedidoDetailModalOpen, setIsPedidoDetailModalOpen] = useState(false);
const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
const [isCreateReviewModalOpen, setIsCreateReviewModalOpen] = useState(false);
const [reviewData, setReviewData] = useState<{ productoId: number; productoNombre: string } | null>(null);
```

### Funciones agregadas:
- `handleViewPedidoDetails()`: Abre modal de detalles del pedido
- `handleCreateReview()`: Abre modal de crear reseña
- `handleSubmitReview()`: Procesa el envío de reseñas

## Beneficios de la Implementación

### 1. **Código más limpio y mantenible**
- Separación de responsabilidades
- Componentes reutilizables
- Reducción del archivo principal de ~800 líneas

### 2. **Mejor experiencia de usuario**
- Información detallada y organizada
- Flujo intuitivo de pedidos → reseñas
- Feedback visual y validaciones claras

### 3. **Consistencia de diseño**
- Paleta de colores unificada
- Componentes que siguen los patrones establecidos
- Responsive design

### 4. **Funcionalidad robusta**
- Gestión adecuada del estado
- Manejo de errores
- Accesibilidad integrada

## Próximos Pasos

1. **Integrar con servicios reales**:
   - Conectar `handleSubmitReview` con el servicio de reseñas
   - Implementar descarga de facturas

2. **Mejoras opcionales**:
   - Añadir imágenes de productos en el modal de detalles
   - Implementar tracking de envío
   - Añadir más opciones de filtrado

3. **Testing**:
   - Pruebas de integración
   - Pruebas de accesibilidad
   - Pruebas responsive

## Archivos Modificados/Creados

### Nuevos archivos:
- `src/components/perfil/PedidoDetailModal.tsx`
- `src/components/perfil/CreateReviewModal.tsx`

### Archivos modificados:
- `src/app/perfil/page.tsx` (agregadas importaciones y lógica de modales)

### Tipos utilizados:
- `Pedido` (de `services/pedidos.service.ts`)
- `EstadoPedido`, `MetodoPago`, `MetodoEnvio` (de `types/enums.ts`)
