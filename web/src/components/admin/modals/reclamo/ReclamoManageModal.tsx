'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Reclamo, UpdateReclamoDto } from '@/services/reclamos.service';
import {
  EstadoReclamo,
  EstadoReclamoLabels,
  PrioridadReclamo,
  PrioridadReclamoLabels,
  TipoReclamo,
  TipoReclamoLabels,
} from '@/types/enums';

interface ReclamoManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  reclamo: Reclamo | null;
  onUpdate: (id: number, data: UpdateReclamoDto) => Promise<void>;
}

const ReclamoManageModal: React.FC<ReclamoManageModalProps> = ({
  isOpen,
  onClose,
  reclamo,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<UpdateReclamoDto>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nota, setNota] = useState('');

  // Bloquear scroll del body cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (reclamo) {
      setFormData({
        estado: reclamo.estado,
        prioridad: reclamo.prioridad,
        tipoReclamo: reclamo.tipoReclamo,
        asunto: reclamo.asunto,
        descripcion: reclamo.descripcion,
      });
      setNota('');
    }
  }, [reclamo]);

  if (!isOpen || !reclamo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Filtrar solo los campos que han cambiado
      const changes: UpdateReclamoDto = {};

      if (formData.estado !== reclamo.estado) changes.estado = formData.estado;
      if (formData.prioridad !== reclamo.prioridad)
        changes.prioridad = formData.prioridad;
      if (formData.tipoReclamo !== reclamo.tipoReclamo)
        changes.tipoReclamo = formData.tipoReclamo;
      if (formData.asunto !== reclamo.asunto) changes.asunto = formData.asunto;
      if (formData.descripcion !== reclamo.descripcion)
        changes.descripcion = formData.descripcion;

      if (Object.keys(changes).length > 0) {
        await onUpdate(reclamo.id, changes);
      }

      onClose();
    } catch (error) {
      console.error('Error al actualizar reclamo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (estado: EstadoReclamo) => {
    switch (estado) {
      case EstadoReclamo.ABIERTO:
        return <Clock className="w-4 h-4" />;
      case EstadoReclamo.EN_PROCESO:
        return <MessageCircle className="w-4 h-4" />;
      case EstadoReclamo.RESUELTO:
        return <CheckCircle className="w-4 h-4" />;
      case EstadoReclamo.RECHAZADO:
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (prioridad: PrioridadReclamo) => {
    switch (prioridad) {
      case PrioridadReclamo.CRITICA:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case PrioridadReclamo.ALTA:
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };
  const hasChanges = () => {
    return (
      formData.estado !== reclamo.estado ||
      formData.prioridad !== reclamo.prioridad ||
      formData.tipoReclamo !== reclamo.tipoReclamo ||
      formData.asunto !== reclamo.asunto ||
      formData.descripcion !== reclamo.descripcion
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />

        <div
          className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-full text-white">
                <Save className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3A3A3A]">
                  Gestionar Reclamo
                </h2>
                <p className="text-[#9A8C61] text-sm">
                  ID: #{reclamo.id} - {reclamo.asunto}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9A8C61] mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estado: e.target.value as EstadoReclamo,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#ecd8ab]/50 rounded-lg focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                  >
                    {Object.values(EstadoReclamo).map((estado) => (
                      <option key={estado} value={estado}>
                        {EstadoReclamoLabels[estado]}
                      </option>
                    ))}
                  </select>
                  {formData.estado && (
                    <div className="mt-2 flex items-center text-sm text-[#9A8C61]">
                      {getStatusIcon(formData.estado)}
                      <span className="ml-1">Estado actual</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#9A8C61] mb-2">
                    Prioridad
                  </label>
                  <select
                    value={formData.prioridad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prioridad: e.target.value as PrioridadReclamo,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#ecd8ab]/50 rounded-lg focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                  >
                    {Object.values(PrioridadReclamo).map((prioridad) => (
                      <option key={prioridad} value={prioridad}>
                        {PrioridadReclamoLabels[prioridad]}
                      </option>
                    ))}
                  </select>
                  {formData.prioridad && (
                    <div className="mt-2 flex items-center text-sm text-[#9A8C61]">
                      {getPriorityIcon(formData.prioridad)}
                      <span
                        className={
                          getPriorityIcon(formData.prioridad) ? 'ml-1' : ''
                        }
                      >
                        Prioridad actual
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9A8C61] mb-2">
                  Tipo de Reclamo
                </label>
                <select
                  value={formData.tipoReclamo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoReclamo: e.target.value as TipoReclamo,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#ecd8ab]/50 rounded-lg focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                >
                  {Object.values(TipoReclamo).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {TipoReclamoLabels[tipo]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9A8C61] mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  value={formData.asunto || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, asunto: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#ecd8ab]/50 rounded-lg focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                  placeholder="Asunto del reclamo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9A8C61] mb-2">
                  Descripción
                </label>
                <Textarea
                  value={formData.descripcion || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                  rows={4}
                  placeholder="Descripción del reclamo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9A8C61] mb-2">
                  Nota de Actualización (Opcional)
                </label>
                <Textarea
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                  rows={3}
                  placeholder="Agregar una nota sobre los cambios realizados..."
                />
                <p className="text-xs text-[#9A8C61] mt-1">
                  Esta nota se agregará como comentario interno si se
                  proporcionan cambios.
                </p>
              </div>

              {/* Summary of Changes */}
              {hasChanges() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Cambios a realizar:
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    {formData.estado !== reclamo.estado && (
                      <li>
                        • Estado: {EstadoReclamoLabels[reclamo.estado]} →{' '}
                        {EstadoReclamoLabels[formData.estado!]}
                      </li>
                    )}
                    {formData.prioridad !== reclamo.prioridad && (
                      <li>
                        • Prioridad: {PrioridadReclamoLabels[reclamo.prioridad]}{' '}
                        → {PrioridadReclamoLabels[formData.prioridad!]}
                      </li>
                    )}
                    {formData.tipoReclamo !== reclamo.tipoReclamo && (
                      <li>
                        • Tipo: {TipoReclamoLabels[reclamo.tipoReclamo]} →{' '}
                        {TipoReclamoLabels[formData.tipoReclamo!]}
                      </li>
                    )}
                    {formData.asunto !== reclamo.asunto && (
                      <li>• Asunto modificado</li>
                    )}
                    {formData.descripcion !== reclamo.descripcion && (
                      <li>• Descripción modificada</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="border-[#ecd8ab] text-[#9A8C61] hover:bg-[#F5E6C6]/30"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!hasChanges() || isSubmitting}
                  className="bg-[#CC9F53] hover:bg-[#b08a3c] text-white"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Guardar Cambios
                </Button>{' '}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReclamoManageModal;
