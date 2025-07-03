# Configuración de Dokploy para DELA Frontend

## Variables de Entorno Requeridas

Para que el frontend funcione correctamente en producción, configure las siguientes variables de entorno en Dokploy:

### Variables Obligatorias

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=https://delabackend.episundc.pe
NEXT_PUBLIC_MAPTILER_API_KEY=BcxILUtDMU5yrvpfcXrB
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhkwkavdd
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dela_platform
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-da11d0a1-7427-4563-b238-cf271b08b3e2
HOSTNAME=0.0.0.0
PORT=3000
```

### Variables Opcionales (con valores por defecto)

```env
NEXT_PUBLIC_APP_NAME=DELA
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Configuración en Dokploy

### Paso 1: Acceder a Variables de Entorno

1. Ir a tu proyecto en Dokploy
2. Navegar a la sección "Environment Variables"
3. Agregar cada variable individualmente

### Paso 2: Configurar Build Args (Opcional)

Si usas build args, también agregar:

```
NEXT_PUBLIC_API_URL=https://delabackend.episundc.pe
NEXT_PUBLIC_MAPTILER_API_KEY=BcxILUtDMU5yrvpfcXrB
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhkwkavdd
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dela_platform
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-da11d0a1-7427-4563-b238-cf271b08b3e2
```

## ⚠️ Importante: Variables NEXT*PUBLIC*

Las variables que empiezan con `NEXT_PUBLIC_` deben estar disponibles durante el **build time**, no solo en runtime. Esto significa que:

1. **Deben configurarse en Dokploy antes del build**
2. **Son embebidas en el código JavaScript final**
3. **Sin ellas, las funcionalidades fallarán en producción**

### Variables Críticas:

- `NEXT_PUBLIC_API_URL`: Sin esta variable, el frontend no puede comunicarse con el backend
- `NEXT_PUBLIC_MAPTILER_API_KEY`: Sin esta variable, los mapas no funcionarán (error 403)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Sin esta variable, la subida de imágenes fallará
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Sin esta variable, Cloudinary rechazará las subidas
- `NEXT_PUBLIC_MP_PUBLIC_KEY`: Sin esta variable, los pagos con MercadoPago no funcionarán

## Solución de Problemas

### Problema: Mapas no cargan (Error 403)
**Síntoma**: `GET https://api.maptiler.com/maps/streets-v2/style.json?key= 403 (Forbidden)`
**Causa**: `NEXT_PUBLIC_MAPTILER_API_KEY` no configurada o vacía
**Solución**: Verificar que la variable esté configurada en Dokploy y hacer rebuild

### Problema: Cloudinary no está configurado
**Síntoma**: "Cloudinary no está configurado. Verifica las variables de entorno."
**Causa**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` o `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` no configuradas
**Solución**: Verificar que ambas variables estén configuradas en Dokploy y hacer rebuild

### Problema: Frontend no conecta con Backend
**Síntoma**: Errores de red al cargar datos
**Causa**: `NEXT_PUBLIC_API_URL` no configurada
**Solución**: Verificar que apunte a `https://delabackend.episundc.pe`

### Problema: Pagos no funcionan
**Síntoma**: Errores en el proceso de pago con MercadoPago
**Causa**: `NEXT_PUBLIC_MP_PUBLIC_KEY` no configurada
**Solución**: Verificar que la variable esté configurada en Dokploy

## Rebuild Después de Cambios

Después de modificar las variables de entorno:

1. Hacer un nuevo deploy en Dokploy
2. O forzar un rebuild del container
3. Verificar que las variables están correctamente configuradas

## Verificación

Para verificar que las variables están correctamente configuradas:

1. Abrir las herramientas de desarrollador del navegador
2. En la consola, ejecutar: `console.log(process.env.NEXT_PUBLIC_MAPTILER_API_KEY)`
3. Debe mostrar la API key, no `undefined`
