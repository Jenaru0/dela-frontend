#!/bin/bash

# 🚀 Script para crear nueva feature - DELA Platform
# Uso: ./scripts/create-feature.sh nombre-de-la-feature

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🚀 Creador de Features - DELA Platform${NC}"
    echo ""
    echo "Uso: $0 <nombre-feature> [tipo]"
    echo ""
    echo "Parámetros:"
    echo "  nombre-feature    Nombre descriptivo (ej: autenticacion-usuario)"
    echo "  tipo             Tipo de feature: frontend, backend, fullstack (default: fullstack)"
    echo ""
    echo "Ejemplos:"
    echo "  $0 carrito-compras"
    echo "  $0 sistema-pagos backend"
    echo "  $0 dashboard-admin frontend"
    echo ""
}

# Verificar parámetros
if [ $# -eq 0 ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

FEATURE_NAME=$1
FEATURE_TYPE=${2:-fullstack}
BRANCH_NAME="feature/$FEATURE_NAME"

# Validar nombre de feature
if [[ ! $FEATURE_NAME =~ ^[a-z0-9-]+$ ]]; then
    echo -e "${RED}❌ Error: El nombre debe contener solo letras minúsculas, números y guiones${NC}"
    exit 1
fi

# Validar tipo de feature
if [[ ! $FEATURE_TYPE =~ ^(frontend|backend|fullstack)$ ]]; then
    echo -e "${RED}❌ Error: Tipo debe ser 'frontend', 'backend' o 'fullstack'${NC}"
    exit 1
fi

echo -e "${BLUE}🎯 Creando feature: $FEATURE_NAME (tipo: $FEATURE_TYPE)${NC}"
echo "============================================="

# Verificar que estamos en develop
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo -e "${YELLOW}⚠️  Cambiando a rama develop...${NC}"
    git checkout develop
fi

# Actualizar develop
echo -e "${BLUE}📡 Actualizando develop...${NC}"
git pull origin develop

# Crear nueva rama
echo -e "${BLUE}🌿 Creando rama $BRANCH_NAME...${NC}"
git checkout -b "$BRANCH_NAME"

# Crear estructura backend si es necesario
if [[ $FEATURE_TYPE == "backend" || $FEATURE_TYPE == "fullstack" ]]; then
    echo -e "${BLUE}⚙️  Creando estructura backend...${NC}"
    
    BACKEND_DIR="api/src/modules/$FEATURE_NAME"
    mkdir -p "$BACKEND_DIR/dto"
    mkdir -p "$BACKEND_DIR/entities" 
    mkdir -p "$BACKEND_DIR/tests"
    
    # Crear archivos base
    cat > "$BACKEND_DIR/${FEATURE_NAME}.module.ts" << EOF
import { Module } from '@nestjs/common';
import { ${FEATURE_NAME^}Controller } from './${FEATURE_NAME}.controller';
import { ${FEATURE_NAME^}Service } from './${FEATURE_NAME}.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [${FEATURE_NAME^}Controller],
  providers: [${FEATURE_NAME^}Service],
  exports: [${FEATURE_NAME^}Service],
})
export class ${FEATURE_NAME^}Module {}
EOF

    cat > "$BACKEND_DIR/${FEATURE_NAME}.controller.ts" << EOF
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ${FEATURE_NAME^}Service } from './${FEATURE_NAME}.service';
import { Create${FEATURE_NAME^}Dto } from './dto/create-${FEATURE_NAME}.dto';
import { Update${FEATURE_NAME^}Dto } from './dto/update-${FEATURE_NAME}.dto';

@ApiTags('${FEATURE_NAME}')
@Controller('${FEATURE_NAME}')
export class ${FEATURE_NAME^}Controller {
  constructor(private readonly ${FEATURE_NAME}Service: ${FEATURE_NAME^}Service) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Creado exitosamente.' })
  create(@Body() create${FEATURE_NAME^}Dto: Create${FEATURE_NAME^}Dto) {
    return this.${FEATURE_NAME}Service.create(create${FEATURE_NAME^}Dto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista obtenida exitosamente.' })
  findAll() {
    return this.${FEATURE_NAME}Service.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Elemento encontrado.' })
  findOne(@Param('id') id: string) {
    return this.${FEATURE_NAME}Service.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Actualizado exitosamente.' })
  update(@Param('id') id: string, @Body() update${FEATURE_NAME^}Dto: Update${FEATURE_NAME^}Dto) {
    return this.${FEATURE_NAME}Service.update(id, update${FEATURE_NAME^}Dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Eliminado exitosamente.' })
  remove(@Param('id') id: string) {
    return this.${FEATURE_NAME}Service.remove(id);
  }
}
EOF

    cat > "$BACKEND_DIR/${FEATURE_NAME}.service.ts" << EOF
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Create${FEATURE_NAME^}Dto } from './dto/create-${FEATURE_NAME}.dto';
import { Update${FEATURE_NAME^}Dto } from './dto/update-${FEATURE_NAME}.dto';

@Injectable()
export class ${FEATURE_NAME^}Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(create${FEATURE_NAME^}Dto: Create${FEATURE_NAME^}Dto) {
    // TODO: Implementar lógica de creación
    throw new Error('Método no implementado');
  }

  async findAll() {
    // TODO: Implementar lógica de listado
    throw new Error('Método no implementado');
  }

  async findOne(id: string) {
    // TODO: Implementar lógica de búsqueda
    throw new Error('Método no implementado');
  }

  async update(id: string, update${FEATURE_NAME^}Dto: Update${FEATURE_NAME^}Dto) {
    // TODO: Implementar lógica de actualización
    throw new Error('Método no implementado');
  }

  async remove(id: string) {
    // TODO: Implementar lógica de eliminación
    throw new Error('Método no implementado');
  }
}
EOF

    cat > "$BACKEND_DIR/dto/create-${FEATURE_NAME}.dto.ts" << EOF
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class Create${FEATURE_NAME^}Dto {
  @ApiProperty({
    description: 'Nombre del elemento',
    example: 'Ejemplo'
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  // TODO: Añadir más campos según necesidades
}
EOF

    cat > "$BACKEND_DIR/dto/update-${FEATURE_NAME}.dto.ts" << EOF
import { PartialType } from '@nestjs/swagger';
import { Create${FEATURE_NAME^}Dto } from './create-${FEATURE_NAME}.dto';

export class Update${FEATURE_NAME^}Dto extends PartialType(Create${FEATURE_NAME^}Dto) {}
EOF

    echo -e "${GREEN}✅ Estructura backend creada${NC}"
fi

# Crear estructura frontend si es necesario
if [[ $FEATURE_TYPE == "frontend" || $FEATURE_TYPE == "fullstack" ]]; then
    echo -e "${BLUE}🎨 Creando estructura frontend...${NC}"
    
    FRONTEND_DIR="web/src/components/$FEATURE_NAME"
    mkdir -p "$FRONTEND_DIR"
    mkdir -p "web/src/hooks"
    mkdir -p "web/src/types"
    
    # Crear componente principal
    cat > "$FRONTEND_DIR/${FEATURE_NAME^}Component.tsx" << EOF
'use client';

import React from 'react';

interface ${FEATURE_NAME^}ComponentProps {
  className?: string;
}

export default function ${FEATURE_NAME^}Component({ 
  className = "" 
}: ${FEATURE_NAME^}ComponentProps) {
  return (
    <div className={\`p-6 \${className}\`}>
      <h2 className="text-2xl font-bold text-[#3A3A3A] mb-4">
        ${FEATURE_NAME^} Component
      </h2>
      <p className="text-gray-600">
        Componente para la funcionalidad de ${FEATURE_NAME}.
      </p>
      {/* TODO: Implementar funcionalidad */}
    </div>
  );
}
EOF

    cat > "$FRONTEND_DIR/index.ts" << EOF
export { default } from './${FEATURE_NAME^}Component';
EOF

    # Crear hook personalizado
    cat > "web/src/hooks/use${FEATURE_NAME^}.ts" << EOF
'use client';

import { useState, useEffect } from 'react';

export function use${FEATURE_NAME^}() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implementar lógica del hook

  return {
    data,
    loading,
    error,
    // TODO: Añadir métodos necesarios
  };
}
EOF

    # Crear tipos TypeScript
    cat > "web/src/types/${FEATURE_NAME}.ts" << EOF
// Tipos para ${FEATURE_NAME}

export interface ${FEATURE_NAME^}Item {
  id: string;
  nombre: string;
  createdAt: string;
  updatedAt: string;
  // TODO: Añadir más campos según necesidades
}

export interface ${FEATURE_NAME^}CreateRequest {
  nombre: string;
  // TODO: Añadir campos para creación
}

export interface ${FEATURE_NAME^}UpdateRequest {
  nombre?: string;
  // TODO: Añadir campos para actualización
}

export interface ${FEATURE_NAME^}Response {
  data: ${FEATURE_NAME^}Item[];
  total: number;
  page: number;
  limit: number;
}
EOF

    echo -e "${GREEN}✅ Estructura frontend creada${NC}"
fi

# Crear archivo de tracking de la feature
cat > "docs/features/${FEATURE_NAME}.md" << EOF
# Feature: ${FEATURE_NAME^}

**Estado:** 🚧 En Desarrollo  
**Tipo:** ${FEATURE_TYPE}  
**Rama:** \`${BRANCH_NAME}\`  
**Creado:** $(date '+%Y-%m-%d')

## 📋 Descripción

Descripción detallada de la funcionalidad que se va a implementar.

## 🎯 Objetivos

- [ ] Objetivo 1
- [ ] Objetivo 2
- [ ] Objetivo 3

## 📁 Archivos Creados

### Backend (api/)
$(if [[ $FEATURE_TYPE == "backend" || $FEATURE_TYPE == "fullstack" ]]; then
echo "- \`src/modules/${FEATURE_NAME}/${FEATURE_NAME}.module.ts\`
- \`src/modules/${FEATURE_NAME}/${FEATURE_NAME}.controller.ts\`  
- \`src/modules/${FEATURE_NAME}/${FEATURE_NAME}.service.ts\`
- \`src/modules/${FEATURE_NAME}/dto/create-${FEATURE_NAME}.dto.ts\`
- \`src/modules/${FEATURE_NAME}/dto/update-${FEATURE_NAME}.dto.ts\`"
else
echo "- No aplica (feature frontend)"
fi)

### Frontend (web/)
$(if [[ $FEATURE_TYPE == "frontend" || $FEATURE_TYPE == "fullstack" ]]; then
echo "- \`src/components/${FEATURE_NAME}/${FEATURE_NAME^}Component.tsx\`
- \`src/hooks/use${FEATURE_NAME^}.ts\`
- \`src/types/${FEATURE_NAME}.ts\`"
else
echo "- No aplica (feature backend)"
fi)

## 🚀 Próximos Pasos

1. [ ] Implementar lógica de negocio
2. [ ] Crear tests unitarios
3. [ ] Implementar UI/UX
4. [ ] Crear tests e2e
5. [ ] Documentar API
6. [ ] Code review
7. [ ] Merge a develop

## 📝 Notas de Desarrollo

- Seguir convenciones del proyecto
- Aplicar design system (#CC9F53, #F5EFD7)
- Mantener cobertura de tests >80%
- Documentar cambios importantes

## 🔗 Enlaces Relacionados

- Issue relacionado: #TODO
- Diseño/Mockups: TODO
- Documentación técnica: TODO
EOF

mkdir -p "docs/features"

# Commit inicial
echo -e "${BLUE}📝 Creando commit inicial...${NC}"
git add .
git commit -m "feat($FEATURE_NAME): estructura inicial para $FEATURE_TYPE

- Crear módulo backend con CRUD básico
- Añadir componente frontend base  
- Configurar tipos TypeScript
- Documentar feature en docs/features/

Archivos creados:
- Backend: módulo, controller, service, DTOs
- Frontend: componente, hook, tipos
- Docs: tracking de la feature

Próximos pasos:
- Implementar lógica de negocio
- Crear tests unitarios
- Implementar UI/UX"

echo ""
echo -e "${GREEN}🎉 ¡Feature $FEATURE_NAME creada exitosamente!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos pasos:${NC}"
echo "1. Implementar la lógica según requerimientos"
echo "2. Crear tests unitarios"
echo "3. Seguir el checklist en docs/feature-template.md"
echo "4. Hacer commits siguiendo convenciones"
echo ""
echo -e "${BLUE}🔧 Comandos útiles:${NC}"
echo "  npm run dev          # Iniciar desarrollo"
echo "  npm run test         # Ejecutar tests"
echo "  npm run build        # Verificar build"
echo "  git push origin $BRANCH_NAME  # Subir cambios"
echo ""
echo -e "${GREEN}¡Feliz desarrollo! 🚀${NC}"
