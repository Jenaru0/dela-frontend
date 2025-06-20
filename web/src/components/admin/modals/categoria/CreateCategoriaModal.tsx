'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, FolderOpen, FileText, Link2 } from 'lucide-react';
import { categoriasService, CreateCategoriaDto } from '@/services/categorias.service';

interface CreateCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const CreateCategoriaModal: React.FC<CreateCategoriaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCategoriaDto>({
    nombre: '',
    descripcion: '',
    slug: '',
    activo: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Bloquear scroll del body cuando el modal esté abierto
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof CreateCategoriaDto, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-generate slug from name
    if (field === 'nombre' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validaciones básicas
      const newErrors: Record<string, string> = {};

      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es requerido';
      }

      if (!formData.slug?.trim()) {
        newErrors.slug = 'El slug es requerido';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await categoriasService.crear(formData);
      onSuccess();
      
      // Reset form
      setFormData({
        nombre: '',
        descripcion: '',
        slug: '',
        activo: true,
      });
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear categoría';
      console.error('Error al crear categoría:', error);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Crear Categoría</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <FolderOpen className="h-4 w-4 mr-2 text-[#CC9F53]" />
              Nombre *
            </label>
            <Input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={errors.nombre ? 'border-red-300 focus:border-red-500' : ''}
              placeholder="Nombre de la categoría"
              required
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs">{errors.nombre}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-[#CC9F53]" />
              Descripción
            </label>
            <Textarea
              value={formData.descripcion || ''}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-[#CC9F53] focus:outline-none focus:ring-2 focus:ring-[#CC9F53]/20 min-h-[80px] resize-none"
              placeholder="Descripción de la categoría (opcional)"
              rows={3}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center">
              <Link2 className="h-4 w-4 mr-2 text-[#CC9F53]" />
              Slug *
            </label>
            <Input
              type="text"
              value={formData.slug || ''}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`font-mono text-sm ${errors.slug ? 'border-red-300 focus:border-red-500' : ''}`}
              placeholder="slug-de-la-categoria"
              required
            />
            {errors.slug && (
              <p className="text-red-500 text-xs">{errors.slug}</p>
            )}
            <p className="text-xs text-neutral-500">
              Se genera automáticamente del nombre, pero puedes editarlo
            </p>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Estado</label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="activo"
                  checked={formData.activo === true}
                  onChange={() => handleInputChange('activo', true)}
                  className="h-4 w-4 text-[#CC9F53] focus:ring-[#CC9F53] border-neutral-300"
                />
                <span className="ml-2 text-sm text-neutral-700">Activa</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="activo"
                  checked={formData.activo === false}
                  onChange={() => handleInputChange('activo', false)}
                  className="h-4 w-4 text-[#CC9F53] focus:ring-[#CC9F53] border-neutral-300"
                />
                <span className="ml-2 text-sm text-neutral-700">Inactiva</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear Categoría'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoriaModal;
