'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { X, MessageSquare, Package, Calendar, Tag, AlertCircle, Send, Eye } from 'lucide-react';
import { Reclamo, reclamosService } from '@/services/reclamos.service';
import { useAuth } from '@/contexts/AuthContext';

interface ClaimDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reclamo: Reclamo | null;
  onReclamoUpdate?: () => void;
}

const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({
  isOpen,
  onClose,
  reclamo: initialReclamo,
  onReclamoUpdate
}) => {
  const { usuario } = useAuth();
  const [reclamo, setReclamo] = useState<Reclamo | null>(initialReclamo);
  const [newComment, setNewComment] = useState('');
  const [esInterno, setEsInterno] = useState(false);
  const [showInternalComments, setShowInternalComments] = useState(false);
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [isLoadingReclamo, setIsLoadingReclamo] = useState(false);
  const [commentsContainerRef, setCommentsContainerRef] = useState<HTMLDivElement | null>(null);

  // Función para hacer scroll al final de los comentarios
  const scrollToBottom = useCallback(() => {
    if (commentsContainerRef) {
      commentsContainerRef.scrollTop = commentsContainerRef.scrollHeight;
    }
  }, [commentsContainerRef]);

  // Cargar reclamo completo con comentarios cuando se abre el modal
  useEffect(() => {
    const loadFullReclamo = async () => {
      if (isOpen && initialReclamo) {
        console.log('🔍 Cargando reclamo:', initialReclamo.id);
        
        // Primero usar el reclamo inicial inmediatamente
        setReclamo(initialReclamo);
        setIsLoadingReclamo(false);
        
        // Luego intentar cargar la versión completa en background
        if (initialReclamo.id) {
          try {
            const response = await reclamosService.obtenerPorId(initialReclamo.id);
            console.log('✅ Reclamo completo cargado:', response.data);
            
            if (response.data) {
              setReclamo(response.data);
              // Scroll al final después de cargar comentarios
              setTimeout(scrollToBottom, 100);
            }
          } catch (error) {
            console.error('❌ Error al cargar reclamo completo (usando datos iniciales):', error);
            // Ya tenemos los datos iniciales, no es crítico este error
          }
        }
      } else {
        setReclamo(null);
        setIsLoadingReclamo(false);
      }
    };

    loadFullReclamo();
  }, [isOpen, initialReclamo?.id, initialReclamo, scrollToBottom]);

  // Bloquear scroll del body cuando el modal esté abierto
  useEffect(() => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddComment = async () => {
    if (!reclamo || !newComment.trim()) return;

    try {
      setIsLoadingComment(true);
      await reclamosService.agregarComentario(reclamo.id, newComment.trim(), esInterno);
      
      // Recargar el reclamo para obtener los comentarios actualizados
      const response = await reclamosService.obtenerPorId(reclamo.id);
      setReclamo(response.data);
      
      // Scroll al final para mostrar el nuevo comentario
      setTimeout(scrollToBottom, 100);
      
      // Limpiar el formulario
      setNewComment('');
      setEsInterno(false);
      
      // Notificar al componente padre
      if (onReclamoUpdate) {
        onReclamoUpdate();
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      alert('Error al agregar el comentario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoadingComment(false);
    }
  };

  // Filtrar comentarios según visibilidad de internos
  const filteredComments = reclamo?.comentarios?.filter(comment => {
    // Si es admin, mostrar según el toggle
    if (usuario?.tipoUsuario === 'ADMIN') {
      return showInternalComments ? true : !comment.esInterno;
    }
    // Si es cliente, nunca mostrar comentarios internos
    return !comment.esInterno;
  }) || [];

  if (!isOpen) return null;

  console.log('🎯 Renderizando modal:', { isOpen, hasReclamo: !!reclamo, hasInitialReclamo: !!initialReclamo, isLoadingReclamo });

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        
        <div 
          className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-full text-white">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3A3A3A]">
                  {reclamo ? `Detalle del Reclamo #${reclamo.id}` : 'Cargando reclamo...'}
                </h2>
                <p className="text-[#9A8C61] text-sm">{reclamo?.asunto || ''}</p>
                {reclamo && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      reclamo.estado === 'ABIERTO' ? 'bg-red-50 text-red-700 border-red-200' :
                      reclamo.estado === 'EN_PROCESO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      reclamo.estado === 'RESUELTO' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {reclamo.estado === 'ABIERTO' ? 'Abierto' :
                       reclamo.estado === 'EN_PROCESO' ? 'En Proceso' :
                       reclamo.estado === 'RESUELTO' ? 'Resuelto' :
                       'Cerrado'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      reclamo.prioridad === 'ALTA' ? 'bg-red-50 text-red-700 border-red-200' :
                      reclamo.prioridad === 'MEDIA' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {reclamo.prioridad === 'ALTA' ? 'Alta' :
                       reclamo.prioridad === 'MEDIA' ? 'Media' :
                       'Baja'}
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

          {/* Content - Layout de dos paneles */}
          {isLoadingReclamo || !reclamo ? (
            <div className="flex items-center justify-center h-[calc(90vh-120px)]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CC9F53] mx-auto mb-4"></div>
                <p className="text-gray-500">Cargando detalles del reclamo...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
              {/* Panel izquierdo - Información del reclamo */}
              <div className="lg:w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
                <div className="space-y-6">
                  {/* Información General */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Información General</h3>
                    <div className="space-y-4">
                      
                      {/* Asunto */}
                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">Asunto</label>
                        <p className="text-[#3A3A3A] font-medium">{reclamo.asunto}</p>
                      </div>

                      {/* Descripción */}
                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">Descripción</label>
                        <p className="text-[#3A3A3A] leading-relaxed">{reclamo.descripcion}</p>
                      </div>

                      {/* Estado y Prioridad en grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#9A8C61] mb-1">Estado</label>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                            reclamo.estado === 'ABIERTO' ? 'bg-red-50 text-red-700 border-red-200' :
                            reclamo.estado === 'EN_PROCESO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            reclamo.estado === 'RESUELTO' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {reclamo.estado === 'ABIERTO' ? 'Abierto' :
                             reclamo.estado === 'EN_PROCESO' ? 'En Proceso' :
                             reclamo.estado === 'RESUELTO' ? 'Resuelto' :
                             'Cerrado'}
                          </span>
                        </div>
                              
                      </div>

                      {/* Tipo de Reclamo */}
                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">Tipo de Reclamo</label>
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 text-[#CC9F53] mr-2" />
                          <span className="text-[#3A3A3A]">{reclamo.tipoReclamo?.replace(/_/g, ' ')}</span>
                        </div>
                      </div>

                      {/* Fecha de Creación */}
                      <div>
                        <label className="block text-sm font-medium text-[#9A8C61] mb-1">Fecha de Creación</label>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-[#CC9F53] mr-2" />
                          <span className="text-[#3A3A3A]">{formatDate(reclamo.creadoEn)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  

                  {/* Pedido Relacionado */}
                  {reclamo.pedidoId && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Pedido Relacionado</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-[#3A3A3A]">
                              {reclamo.pedido?.numero ? `Pedido #${reclamo.pedido.numero}` : `Pedido #${reclamo.pedidoId}`}
                            </p>
                            <p className="text-sm text-[#9A8C61]">ID: {reclamo.pedidoId}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel derecho - Comentarios */}
              <div className="lg:w-1/2 flex flex-col">
                {/* Header de comentarios */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#3A3A3A]">
                      Conversación ({filteredComments.length})
                    </h3>
                    {/* Solo mostrar el botón de comentarios internos si es admin */}
                    {usuario?.tipoUsuario === 'ADMIN' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInternalComments(!showInternalComments)}
                        className="text-[#CC9F53] hover:bg-[#F5E6C6]/30 text-xs"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {showInternalComments ? 'Ocultar internos' : 'Mostrar internos'}
                      </Button>
                    )}
                  </div>
                  
                  {/* Chat Legend solo para admin */}
                  {usuario?.tipoUsuario === 'ADMIN' && (
                    <div className="flex items-center space-x-4 text-xs text-[#9A8C61] mt-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-[#CC9F53] rounded-full"></div>
                        <span>Tu mensaje</span>
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
                  )}
                  
                  {/* Chat Legend para cliente */}
                  {usuario?.tipoUsuario !== 'ADMIN' && (
                    <div className="flex items-center space-x-4 text-xs text-[#9A8C61] mt-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-[#CC9F53] rounded-full"></div>
                        <span>Tus mensajes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Equipo de soporte</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lista de comentarios */}
                <div 
                  ref={setCommentsContainerRef}
                  className="flex-1 overflow-y-auto p-6 bg-gray-50/30"
                >
                  {filteredComments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53]/20 to-[#CC9F53]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-[#CC9F53]" />
                      </div>
                      <h4 className="text-lg font-medium text-[#3A3A3A] mb-2">No hay mensajes aún</h4>
                      <p className="text-[#9A8C61] text-sm">
                        {usuario?.tipoUsuario === 'ADMIN' 
                          ? 'Inicia la conversación con el cliente' 
                          : 'Envía tu primer mensaje a nuestro equipo de soporte'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredComments.map((comment, index) => {
                        // Determinar si es el usuario actual
                        const isCurrentUser = usuario && comment.usuario.id === usuario.id;
                        // Determinar si es admin (cualquier admin se muestra como "Administrador")
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
                            <div className={`flex items-end space-x-3 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              {/* Avatar */}
                              {!isCurrentUser && (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                                  isAdmin 
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                }`}>
                                  {isAdmin ? 'A' : (comment.usuario.nombres?.charAt(0)?.toUpperCase() || 'C')}
                                </div>
                              )}
                              
                              {isCurrentUser && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                  {usuario?.tipoUsuario === 'ADMIN' ? 'A' : (usuario?.nombres?.charAt(0)?.toUpperCase() || 'U')}
                                </div>
                              )}
                              
                              {/* Burbuja del mensaje */}
                              <div className={`max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                {/* Burbuja */}
                                <div className={`px-4 py-3 shadow-sm ${
                                  isCurrentUser 
                                    ? 'bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] text-white rounded-2xl rounded-br-md' 
                                    : 'bg-white border border-gray-200 text-[#3A3A3A] rounded-2xl rounded-bl-md'
                                }`}>
                                  {/* Header del mensaje - solo para admins si no es usuario actual */}
                                  {!isCurrentUser && (
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className={`text-xs font-semibold ${
                                        isAdmin ? 'text-blue-600' : 'text-[#9A8C61]'
                                      }`}>
                                        {isAdmin ? 'Equipo de Soporte' : 'Cliente'}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {/* Contenido del mensaje */}
                                  <p className={`text-sm leading-relaxed ${
                                    isCurrentUser 
                                      ? 'text-white' 
                                      : 'text-[#3A3A3A]'
                                  }`}>
                                    {comment.comentario}
                                  </p>
                                  
                                  {/* Indicador de comentario interno */}
                                  {comment.esInterno && usuario?.tipoUsuario === 'ADMIN' && (
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
                                  isCurrentUser ? 'text-right' : 'text-left'
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
                    </div>
                  )}
                </div>

                {/* Formulario para agregar comentario */}
                <div className="p-6 border-t border-gray-200 bg-white">
                  <div className="space-y-4">
                    {/* Área de texto */}
                    <div className="relative">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={usuario?.tipoUsuario === 'ADMIN' ? "Responder al cliente..." : "Escribe tu mensaje..."}
                        rows={3}
                        disabled={isLoadingComment}
                        className="w-full p-4 pr-12 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-[#CC9F53]/50 focus:border-[#CC9F53] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm placeholder:text-[#9A8C61]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
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
                      {/* Solo mostrar opción de comentario interno si es admin */}
                      {usuario?.tipoUsuario === 'ADMIN' && (
                        <label className="flex items-center space-x-3 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={esInterno}
                            onChange={(e) => setEsInterno(e.target.checked)}
                            disabled={isLoadingComment}
                            className="w-4 h-4 rounded border-2 border-gray-300 text-[#CC9F53] focus:ring-[#CC9F53]/50 focus:ring-2 transition-colors disabled:opacity-50"
                          />
                          <span className="text-[#9A8C61] font-medium">Nota privada (solo admin)</span>
                        </label>
                      )}
                      
                      <div className={usuario?.tipoUsuario !== 'ADMIN' ? 'flex items-center space-x-3 ml-auto' : 'flex items-center space-x-3'}>
                        {/* Hint de teclado */}
                        <span className="text-xs text-[#9A8C61] hidden sm:block">
                          Enter para enviar, Shift+Enter para nueva línea
                        </span>
                        
                        {/* Botón de envío */}
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || isLoadingComment || newComment.length > 500}
                          className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9d7935] text-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl min-w-[120px]"
                        >
                          {isLoadingComment ? (
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
                    </div>
                    
                    {/* Vista previa para comentarios internos */}
                    {usuario?.tipoUsuario === 'ADMIN' && esInterno && newComment.trim() && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <Eye className="w-4 h-4 text-yellow-600" />
                          <span className="text-xs font-semibold text-yellow-800">Vista previa - Nota privada</span>
                        </div>
                        <p className="text-sm text-yellow-800 leading-relaxed">{newComment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default ClaimDetailModal;

 
