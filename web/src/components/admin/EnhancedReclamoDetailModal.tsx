'use client';

import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  User, 
  Package, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  MessageCircle,
  Send,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Reclamo } from '@/services/reclamos.service';
import { 
  EstadoReclamo, 
  EstadoReclamoLabels, 
  EstadoReclamoColors, 
  PrioridadReclamo, 
  PrioridadReclamoLabels, 
  PrioridadReclamoColors,
  TipoReclamoLabels 
} from '@/types/enums';

interface EnhancedReclamoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reclamo: Reclamo | null;
  onAddComment?: (reclamoId: number, comentario: string, esInterno: boolean) => Promise<void>;
}

const EnhancedReclamoDetailModal: React.FC<EnhancedReclamoDetailModalProps> = ({
  isOpen,
  onClose,
  reclamo,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showInternalComments, setShowInternalComments] = useState(true);

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
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (prioridad: PrioridadReclamo) => {
    switch (prioridad) {
      case PrioridadReclamo.CRITICA:
        return <AlertTriangle className="w-4 h-4" />;
      case PrioridadReclamo.ALTA:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !onAddComment || !reclamo) return;

    try {
      setIsSubmittingComment(true);
      await onAddComment(reclamo.id, newComment.trim(), isInternalComment);
      setNewComment('');
      setIsInternalComment(false);
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredComments = reclamo?.comentarios?.filter(comment => 
    showInternalComments ? true : !comment.esInterno
  ) || [];

  if (!isOpen || !reclamo) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-full text-white">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3A3A3A]">
                  Detalle del Reclamo #{reclamo.id}
                </h2>
                <p className="text-[#9A8C61] text-sm">{reclamo.asunto}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${EstadoReclamoColors[reclamo.estado]}`}>
                    {getStatusIcon(reclamo.estado)}
                    <span className="ml-1">{EstadoReclamoLabels[reclamo.estado]}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${PrioridadReclamoColors[reclamo.prioridad]}`}>
                    {getPriorityIcon(reclamo.prioridad)}
                    <span className="ml-1">{PrioridadReclamoLabels[reclamo.prioridad]}</span>
                  </span>
                </div>
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
          <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
            {/* Left Panel - Claim Details */}
            <div className="lg:w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Información General</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#9A8C61] mb-1">Asunto</label>
                      <p className="text-[#3A3A3A] font-medium">{reclamo.asunto}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#9A8C61] mb-1">Descripción</label>
                      <p className="text-[#3A3A3A] leading-relaxed">{reclamo.descripcion}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">Estado</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${EstadoReclamoColors[reclamo.estado]}`}>
                          {getStatusIcon(reclamo.estado)}
                          <span className="ml-1">{EstadoReclamoLabels[reclamo.estado]}</span>
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">Prioridad</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${PrioridadReclamoColors[reclamo.prioridad]}`}>
                          {getPriorityIcon(reclamo.prioridad)}
                          <span className={getPriorityIcon(reclamo.prioridad) ? "ml-1" : ""}>
                            {PrioridadReclamoLabels[reclamo.prioridad]}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#9A8C61] mb-1">Tipo de Reclamo</label>
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-[#CC9F53] mr-2" />
                        <span className="text-[#3A3A3A]">{TipoReclamoLabels[reclamo.tipoReclamo]}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#9A8C61] mb-1">Fecha de Creación</label>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-[#CC9F53] mr-2" />
                        <span className="text-[#3A3A3A]">{formatDate(reclamo.creadoEn)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Cliente</h3>
                  {reclamo.usuario && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-[#CC9F53] mr-3" />
                        <div>
                          <p className="font-medium text-[#3A3A3A]">
                            {reclamo.usuario.nombres} {reclamo.usuario.apellidos}
                          </p>
                          <p className="text-sm text-[#9A8C61]">{reclamo.usuario.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Related Order */}
                {reclamo.pedido && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Pedido Relacionado</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-[#3A3A3A]">Pedido #{reclamo.pedido.numero}</p>
                          <p className="text-sm text-[#9A8C61]">ID: {reclamo.pedido.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Comments */}
            <div className="lg:w-1/2 flex flex-col">
              {/* Comments Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#3A3A3A]">
                    Comentarios ({filteredComments.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInternalComments(!showInternalComments)}
                    className="text-[#CC9F53] hover:bg-[#F5E6C6]/30"
                  >
                    {showInternalComments ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {showInternalComments ? 'Ocultar internos' : 'Mostrar internos'}
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredComments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay comentarios aún</p>
                  </div>
                ) : (
                  filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-lg ${
                        comment.esInterno 
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            comment.usuario.tipoUsuario === 'ADMIN' ? 'bg-[#CC9F53]' : 'bg-blue-500'
                          }`} />
                          <span className="font-medium text-[#3A3A3A]">
                            {comment.usuario.nombres} {comment.usuario.apellidos}
                          </span>
                          {comment.esInterno && (
                            <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                              Interno
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#9A8C61]">
                          {formatDate(comment.creadoEn)}
                        </span>
                      </div>
                      <p className="text-[#3A3A3A] leading-relaxed">{comment.comentario}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              {onAddComment && (
                <div className="p-6 border-t border-gray-200">
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#9A8C61] mb-2">
                        Agregar Comentario
                      </label>
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tu comentario aquí..."
                        rows={3}
                        className="border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={isInternalComment}
                          onChange={(e) => setIsInternalComment(e.target.checked)}
                          className="rounded border-gray-300 text-[#CC9F53] focus:ring-[#CC9F53]"
                        />
                        <span className="text-[#9A8C61]">Comentario interno</span>
                      </label>
                      
                      <Button
                        type="submit"
                        disabled={!newComment.trim() || isSubmittingComment}
                        className="bg-[#CC9F53] hover:bg-[#b08a3c] text-white"
                      >
                        {isSubmittingComment ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Enviar
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedReclamoDetailModal;
