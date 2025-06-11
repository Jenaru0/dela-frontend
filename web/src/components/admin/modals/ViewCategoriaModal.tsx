'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { X, Eye, Package, Calendar, Power } from 'lucide-react';
import { Categoria } from '@/services/categorias.service';

interface ViewCategoriaModalProps {
  isOpen: boolean;
  categoria: Categoria | null;
  onClose: () => void;
}

const ViewCategoriaModal: React.FC<ViewCategoriaModalProps> = ({
  isOpen,
  categoria,
  onClose,
}) => {
  if (!isOpen || !categoria) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#CC9F53] rounded-lg flex items-center justify-center mr-3">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3A3A3A]">Detalles de Categoría</h2>
              <p className="text-sm text-[#9A8C61]">Información completa</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                ID
              </label>
              <p className="text-[#3A3A3A] font-mono bg-gray-50 px-3 py-2 rounded">
                {categoria.id}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                Nombre
              </label>
              <p className="text-[#3A3A3A] font-semibold text-lg">
                {categoria.nombre}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                Slug
              </label>
              <p className="text-[#3A3A3A] font-mono bg-gray-50 px-3 py-2 rounded">
                {categoria.slug}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                Descripción
              </label>
              <p className="text-[#3A3A3A] bg-gray-50 px-3 py-2 rounded min-h-[2.5rem]">
                {categoria.descripcion || 'Sin descripción'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Productos</p>
                  <p className="text-xl font-bold text-blue-900">
                    {categoria._count?.productos || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              categoria.activo 
                ? 'bg-green-50' 
                : 'bg-gray-50'
            }`}>
              <div className="flex items-center">
                <Power className={`w-5 h-5 mr-2 ${
                  categoria.activo 
                    ? 'text-green-600' 
                    : 'text-gray-500'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    categoria.activo 
                      ? 'text-green-800' 
                      : 'text-gray-600'
                  }`}>
                    Estado
                  </p>
                  <p className={`text-xl font-bold ${
                    categoria.activo 
                      ? 'text-green-900' 
                      : 'text-gray-700'
                  }`}>
                    {categoria.activo ? 'Activa' : 'Inactiva'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Creación
              </label>
              <p className="text-[#3A3A3A] bg-gray-50 px-3 py-2 rounded">
                {formatDate(categoria.creadoEn)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4">
            <Button
              onClick={onClose}
              className="w-full bg-[#CC9F53] hover:bg-[#b08a3c] text-white"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategoriaModal;
