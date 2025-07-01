'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Reclamo, reclamosService } from '@/services/reclamos.service';
import {
  EstadoReclamo,
  EstadoReclamoLabels,
  EstadoReclamoColors,
  PrioridadReclamo,
  PrioridadReclamoLabels,
  PrioridadReclamoColors,
  TipoReclamoLabels,
} from '@/types/enums';

interface EnhancedReclamoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reclamo: Reclamo | null;
  onAddComment?: (
    reclamoId: number,
    comentario: string,
    esInterno: boolean
  ) => Promise<void>;
  onReloadReclamo?: (reclamoId: number) => Promise<void>;
}

const EnhancedReclamoDetailModal: React.FC<EnhancedReclamoDetailModalProps> = ({
  isOpen,
  onClose,
  reclamo: initialReclamo,
  onAddComment,
}) => {
  const [reclamo, setReclamo] = useState<Reclamo | null>(initialReclamo);
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showInternalComments, setShowInternalComments] = useState(true);
  const [isLoadingReclamo, setIsLoadingReclamo] = useState(false);

  // Cargar reclamo completo con comentarios cuando se abre el modal
  useEffect(() => {
    const loadFullReclamo = async () => {
      if (isOpen && initialReclamo?.id) {
        console.log(
          '🔍 EnhancedReclamoDetailModal - Cargando reclamo completo:',
          initialReclamo.id
        );
        try {
          setIsLoadingReclamo(true);
          const response = await reclamosService.obtenerPorId(
            initialReclamo.id
          );
          console.log(
            '🔍 EnhancedReclamoDetailModal - Respuesta completa:',
            response
          );
          console.log(
            '✅ EnhancedReclamoDetailModal - Reclamo cargado:',
            response.data
          );
          console.log(
            '💬 EnhancedReclamoDetailModal - Comentarios cargados:',
            response.data?.comentarios
          );

          if (response.data) {
            setReclamo(response.data);
          } else {
            console.log(
              '⚠️  EnhancedReclamoDetailModal - response.data es undefined, usando reclamo inicial'
            );
            setReclamo(initialReclamo);
          }
        } catch (error) {
          console.error(
            '❌ EnhancedReclamoDetailModal - Error al cargar reclamo:',
            error
          );
          setReclamo(initialReclamo);
        } finally {
          setIsLoadingReclamo(false);
        }
      } else if (isOpen) {
        console.log(
          '⚠️  EnhancedReclamoDetailModal - Modal abierto pero sin reclamo inicial:',
          { isOpen, initialReclamo }
        );
        setReclamo(initialReclamo);
      }
    };

    loadFullReclamo();
  }, [isOpen, initialReclamo?.id, initialReclamo]);

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
      console.log('🔄 EnhancedReclamoDetailModal - Enviando comentario:', {
        reclamoId: reclamo.id,
        comentario: newComment.trim(),
        esInterno: isInternalComment,
      });

      await onAddComment(reclamo.id, newComment.trim(), isInternalComment);
      setNewComment('');
      setIsInternalComment(false);

      // Recargar el reclamo completo para obtener los comentarios actualizados
      console.log(
        '🔄 EnhancedReclamoDetailModal - Recargando reclamo después de comentario...'
      );
      const response = await reclamosService.obtenerPorId(reclamo.id);
      console.log(
        '✅ EnhancedReclamoDetailModal - Reclamo recargado:',
        response.data
      );
      console.log(
        '� EnhancedReclamoDetailModal - Comentarios actualizados:',
        response.data?.comentarios
      );

      if (response.data) {
        setReclamo(response.data);
      }

      console.log(
        '✅ EnhancedReclamoDetailModal - Comentario enviado exitosamente'
      );
    } catch (error) {
      console.error(
        '❌ EnhancedReclamoDetailModal - Error al agregar comentario:',
        error
      );
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
      minute: '2-digit',
    });
  };

  const filteredComments =
    reclamo?.comentarios?.filter((comment) =>
      showInternalComments ? true : !comment.esInterno
    ) || [];

  // Debug logging
  console.log('🔍 EnhancedReclamoDetailModal - Debug Info:');
  console.log('🔍 Modal abierto:', isOpen);
  console.log('🔍 Reclamo inicial:', initialReclamo);
  console.log('🔍 Reclamo actual:', reclamo);
  console.log('🔍 Comentarios del reclamo:', reclamo?.comentarios);
  console.log('🔍 Comentarios filtrados:', filteredComments);
  console.log('🔍 Show internal comments:', showInternalComments);
  console.log('🔍 Cargando reclamo:', isLoadingReclamo);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-full text-white">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3A3A3A]">
                  {reclamo
                    ? `Detalle del Reclamo #${reclamo.id}`
                    : 'Cargando reclamo...'}
                </h2>
                <p className="text-[#9A8C61] text-sm">
                  {reclamo?.asunto || ''}
                </p>
                {reclamo && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        EstadoReclamoColors[reclamo.estado]
                      }`}
                    >
                      {getStatusIcon(reclamo.estado)}
                      <span className="ml-1">
                        {EstadoReclamoLabels[reclamo.estado]}
                      </span>
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        PrioridadReclamoColors[reclamo.prioridad]
                      }`}
                    >
                      {getPriorityIcon(reclamo.prioridad)}
                      <span className="ml-1">
                        {PrioridadReclamoLabels[reclamo.prioridad]}
                      </span>
                    </span>
                  </div>
                )}
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
          {isLoadingReclamo ? (
            <div className="flex items-center justify-center h-[calc(90vh-120px)]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
                <p className="text-gray-500">
                  Cargando detalles del reclamo...
                </p>
              </div>
            </div>
          ) : reclamo ? (
            <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
              {/* Left Panel - Claim Details */}
              <div className="lg:w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">
                      Información General
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                          Asunto
                        </label>
                        <p className="text-[#3A3A3A] font-medium">
                          {reclamo.asunto}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                          Descripción
                        </label>
                        <p className="text-[#3A3A3A] leading-relaxed">
                          {reclamo.descripcion}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                            Estado
                          </label>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              EstadoReclamoColors[reclamo.estado]
                            }`}
                          >
                            {getStatusIcon(reclamo.estado)}
                            <span className="ml-1">
                              {EstadoReclamoLabels[reclamo.estado]}
                            </span>
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                            Prioridad
                          </label>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              PrioridadReclamoColors[reclamo.prioridad]
                            }`}
                          >
                            {getPriorityIcon(reclamo.prioridad)}
                            <span
                              className={
                                getPriorityIcon(reclamo.prioridad) ? 'ml-1' : ''
                              }
                            >
                              {PrioridadReclamoLabels[reclamo.prioridad]}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                          Tipo de Reclamo
                        </label>
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 text-[#CC9F53] mr-2" />
                          <span className="text-[#3A3A3A]">
                            {TipoReclamoLabels[reclamo.tipoReclamo]}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">
                          Fecha de Creación
                        </label>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-[#CC9F53] mr-2" />
                          <span className="text-[#3A3A3A]">
                            {formatDate(reclamo.creadoEn)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">
                      Cliente
                    </h3>
                    {reclamo.usuario && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-[#CC9F53] mr-3" />
                          <div>
                            <p className="font-medium text-[#3A3A3A]">
                              {reclamo.usuario.nombres}{' '}
                              {reclamo.usuario.apellidos}
                            </p>
                            <p className="text-sm text-[#9A8C61]">
                              {reclamo.usuario.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Related Order */}
                  {reclamo.pedido && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">
                        Pedido Relacionado
                      </h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-[#3A3A3A]">
                              Pedido #{reclamo.pedido.numero}
                            </p>
                            <p className="text-sm text-[#9A8C61]">
                              ID: {reclamo.pedido.id}
                            </p>
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
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">
                      Conversación ({filteredComments.length})
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowInternalComments(!showInternalComments)
                      }
                      className="text-[#CC9F53] hover:bg-[#F5E6C6]/30"
                    >
                      {showInternalComments ? (
                        <EyeOff className="w-4 h-4 mr-1" />
                      ) : (
                        <Eye className="w-4 h-4 mr-1" />
                      )}
                      {showInternalComments
                        ? 'Ocultar notas privadas'
                        : 'Mostrar notas privadas'}
                    </Button>
                  </div>

                  {/* Chat Legend */}
                  <div className="flex items-center space-x-4 text-xs text-[#9A8C61]">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-[#CC9F53] rounded-full"></div>
                      <span>Administrador</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Cliente</span>
                    </div>
                    {showInternalComments && (
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Nota privada</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                  {filteredComments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53]/20 to-[#CC9F53]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-[#CC9F53]" />
                      </div>
                      <h4 className="text-lg font-medium text-[#3A3A3A] mb-2">No hay mensajes aún</h4>
                      <p className="text-[#9A8C61] text-sm">
                        Inicia la conversación con el cliente
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredComments.map((comment, index) => {
                        const isAdmin = comment.usuario.tipoUsuario === 'ADMIN';
                        // Verificar si es el primer mensaje del día
                        const isFirstOfDay = index === 0 || 
                          new Date(comment.creadoEn).toDateString() !== 
                          new Date(filteredComments[index - 1].creadoEn).toDateString();

                        return (
                          <div key={comment.id}>
                            {/* Separador de fecha */}
                            {isFirstOfDay && (
                              <div className="flex items-center justify-center my-8">
                                <span className="text-xs font-medium text-[#9A8C61] px-4">
                                  {new Date(comment.creadoEn).toLocaleDateString('es-PE', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}

                            {/* Mensaje */}
                            <div className={`flex items-end space-x-3 ${isAdmin ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              {/* Avatar */}
                              {!isAdmin && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                  {comment.usuario.nombres?.charAt(0)?.toUpperCase() || 'C'}
                                </div>
                              )}
                              
                              {isAdmin && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                  A
                                </div>
                              )}
                              
                              {/* Burbuja del mensaje */}
                              <div className={`max-w-[75%] ${isAdmin ? 'items-end' : 'items-start'}`}>
                                {/* Burbuja */}
                                <div className={`px-4 py-3 shadow-sm ${
                                  isAdmin 
                                    ? 'bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] text-white rounded-2xl rounded-br-md' 
                                    : 'bg-white border border-gray-200 text-[#3A3A3A] rounded-2xl rounded-bl-md'
                                }`}>
                                  {/* Header del mensaje - solo para cliente */}
                                  {!isAdmin && (
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="text-xs font-semibold text-[#9A8C61]">
                                        Cliente
                                      </span>
                                    </div>
                                  )}
                                  
                                  {/* Contenido del mensaje */}
                                  <p className={`text-sm leading-relaxed ${
                                    isAdmin 
                                      ? 'text-white' 
                                      : 'text-[#3A3A3A]'
                                  }`}>
                                    {comment.comentario}
                                  </p>
                                  
                                  {/* Indicador de comentario interno */}
                                  {comment.esInterno && (
                                    <div className="mt-2">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <Eye className="w-3 h-3 mr-1" />
                                        Nota privada
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Timestamp */}
                                <div className={`mt-1 text-xs text-[#9A8C61] px-2 ${
                                  isAdmin ? 'text-right' : 'text-left'
                                }`}>
                                  {new Date(comment.creadoEn).toLocaleTimeString('es-PE', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Scroll to bottom helper */}
                      <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
                    </div>
                  )}
                </div>

                {/* Add Comment Form */}
                {onAddComment && (
                  <div className="p-6 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                      {/* Internal Comment Toggle */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#9A8C61]">
                          Responder como Administrador
                        </span>
                        <label className="flex items-center space-x-3 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isInternalComment}
                            onChange={(e) =>
                              setIsInternalComment(e.target.checked)
                            }
                            className="w-4 h-4 rounded border-2 border-gray-300 text-[#CC9F53] focus:ring-[#CC9F53]/50 focus:ring-2 transition-colors"
                          />
                          <span className="text-[#9A8C61] font-medium">Nota privada (solo admin)</span>
                        </label>
                      </div>

                      {/* Chat Input */}
                      <div className="relative">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={
                            isInternalComment
                              ? 'Escribe una nota privada...'
                              : 'Responde al cliente...'
                          }
                          rows={3}
                          disabled={isSubmittingComment}
                          className="w-full p-4 pr-12 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-[#CC9F53]/50 focus:border-[#CC9F53] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm placeholder:text-[#9A8C61]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmitComment(e);
                            }
                          }}
                        />
                        {/* Indicador de caracteres */}
                        <div className="absolute bottom-2 right-2 text-xs text-[#9A8C61]">
                          {newComment.length}/500
                        </div>
                      </div>
                      
                      {/* Controles */}
                      <div className="flex items-center justify-between">
                        {/* Hint de teclado */}
                        <span className="text-xs text-[#9A8C61] hidden sm:block">
                          Enter para enviar, Shift+Enter para nueva línea
                        </span>
                        
                        {/* Botón de envío */}
                        <Button
                          type="submit"
                          disabled={!newComment.trim() || isSubmittingComment || newComment.length > 500}
                          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl min-w-[120px] ${
                            isInternalComment
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                              : 'bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9d7935]'
                          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isSubmittingComment ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Enviar
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Vista previa para comentarios internos */}
                      {isInternalComment && newComment.trim() && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <div className="flex items-center space-x-2 mb-2">
                            <Eye className="w-4 h-4 text-yellow-600" />
                            <span className="text-xs font-semibold text-yellow-800">Vista previa - Nota privada</span>
                          </div>
                          <p className="text-sm text-yellow-800 leading-relaxed">{newComment}</p>
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[calc(90vh-120px)]">
              <div className="text-center">
                <p className="text-gray-500">No se pudo cargar el reclamo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedReclamoDetailModal;
