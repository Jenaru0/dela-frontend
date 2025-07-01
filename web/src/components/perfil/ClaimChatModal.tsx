'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';
import {
  X,
  Send,
  MessageSquare,
  Package,
  User,
  Bot,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Reclamo } from '@/services/reclamos.service';

interface ClaimChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  reclamo: Reclamo | null;
  onSendMessage?: (mensaje: string) => Promise<void>;
  isLoading?: boolean;
}

const ClaimChatModal: React.FC<ClaimChatModalProps> = ({
  isOpen,
  onClose,
  reclamo,
  onSendMessage,
}) => {
  const [mensaje, setMensaje] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [reclamo?.comentarios]);

  useEffect(() => {
    if (isOpen) {
      setMensaje('');
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim() || isSending || !onSendMessage) return;

    try {
      setIsSending(true);
      await onSendMessage(mensaje.trim());
      setMensaje('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !reclamo) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Conversación - Ticket #{reclamo.id}
                </h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      reclamo.estado === 'ABIERTO'
                        ? 'bg-blue-500/20 text-blue-100'
                        : reclamo.estado === 'EN_PROCESO'
                        ? 'bg-yellow-500/20 text-yellow-100'
                        : reclamo.estado === 'RESUELTO'
                        ? 'bg-green-500/20 text-green-100'
                        : 'bg-red-500/20 text-red-100'
                    }`}
                  >
                    {reclamo.estado === 'ABIERTO'
                      ? '🟦 Nuevo'
                      : reclamo.estado === 'EN_PROCESO'
                      ? '🟡 En proceso'
                      : reclamo.estado === 'RESUELTO'
                      ? '✅ Resuelto'
                      : '❌ Cerrado'}
                  </span>
                  <span className="text-blue-100 text-sm">
                    {reclamo.tipoReclamo?.replace(/_/g, ' ')}
                  </span>
                  {reclamo.pedidoId && (
                    <span className="text-blue-100 text-sm">
                      📦 Pedido #{reclamo.pedido?.numero || reclamo.pedidoId}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Información del reclamo */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Asunto:
                </span>
                <span className="text-sm text-gray-900">{reclamo.asunto}</span>
              </div>
              {reclamo.pedidoId && (
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Pedido #{reclamo.pedido?.numero || reclamo.pedidoId}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Estado</p>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    reclamo.estado === 'ABIERTO'
                      ? 'bg-blue-100 text-blue-800'
                      : reclamo.estado === 'EN_PROCESO'
                      ? 'bg-yellow-100 text-yellow-800'
                      : reclamo.estado === 'RESUELTO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {reclamo.estado === 'ABIERTO'
                    ? '🟦 Abierto'
                    : reclamo.estado === 'EN_PROCESO'
                    ? '🟡 Media'
                    : reclamo.estado === 'RESUELTO'
                    ? '✅ Resuelto'
                    : '❌ Cerrado'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Prioridad</p>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    reclamo.prioridad === 'ALTA'
                      ? 'bg-red-100 text-red-800'
                      : reclamo.prioridad === 'MEDIA'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {reclamo.prioridad === 'ALTA'
                    ? '🔴 Alta'
                    : reclamo.prioridad === 'MEDIA'
                    ? '🟡 Media'
                    : '⚪ Baja'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {/* Mensaje inicial del usuario */}
          <div className="flex justify-end">
            <div className="max-w-3xl w-full">
              <div className="bg-blue-600 text-white rounded-2xl rounded-br-md p-4">
                <h3 className="font-semibold mb-2">{reclamo.asunto}</h3>
                <p className="text-blue-100">{reclamo.descripcion}</p>
              </div>
              <div className="flex items-center justify-end mt-2 space-x-2">
                <span className="text-xs text-gray-500">
                  {new Date(reclamo.creadoEn).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Tú</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje automático del sistema */}
          <div className="flex justify-start">
            <div className="max-w-3xl w-full">
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl rounded-bl-md p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Sistema DELA
                  </span>
                </div>
                <p className="text-yellow-800 text-sm">
                  📨 ¡Hola! Hemos recibido tu consulta &quot;{reclamo.asunto}&quot; y
                  nuestro equipo de atención al cliente la está revisando. Te
                  responderemos lo antes posible. Gracias por tu paciencia. 😊
                </p>
                <div className="mt-2 pt-2 border-t border-yellow-200">
                  <p className="text-xs text-yellow-700">
                    ⏰ Tiempo de respuesta promedio: 2-4 horas durante horario
                    laboral
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-xs text-gray-500">
                  {new Date(reclamo.creadoEn).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <div className="flex items-center space-x-1">
                  <Bot className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Automático</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comentarios del personal de soporte */}
          {reclamo.comentarios &&
            reclamo.comentarios.map((comentario, index) => (
              <div key={comentario.id || index} className="flex justify-start">
                <div className="max-w-3xl w-full">
                  <div
                    className={`rounded-2xl rounded-bl-md p-4 ${
                      comentario.esInterno
                        ? 'bg-orange-50 border border-orange-200'
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          comentario.esInterno ? 'bg-orange-500' : 'bg-blue-600'
                        }`}
                      >
                        <span className="text-white text-xs font-bold">
                          {comentario.usuario?.nombres
                            ?.charAt(0)
                            ?.toUpperCase() || 'CS'}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          comentario.esInterno
                            ? 'text-orange-800'
                            : 'text-gray-800'
                        }`}
                      >
                        {comentario.esInterno
                          ? 'Nota interna'
                          : 'Atención al Cliente'}
                      </span>
                      {comentario.esInterno && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                          Solo visible para ti
                        </span>
                      )}
                    </div>
                    <p
                      className={`${
                        comentario.esInterno
                          ? 'text-orange-800'
                          : 'text-gray-800'
                      }`}
                    >
                      {comentario.comentario}
                    </p>
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs text-gray-500">
                      {new Date(comentario.creadoEn).toLocaleDateString(
                        'es-PE',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </span>
                    <div className="flex items-center space-x-1">
                      {comentario.esInterno ? (
                        <AlertCircle className="w-3 h-3 text-orange-400" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      )}
                      <span className="text-xs text-gray-500">
                        {comentario.usuario?.nombres}{' '}
                        {comentario.usuario?.apellidos}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Estado de tipeo (si está en proceso) */}
          {reclamo.estado === 'EN_PROCESO' && (
            <div className="flex justify-start">
              <div className="max-w-3xl w-full">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      Nuestro equipo está escribiendo...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input para enviar mensaje (solo si el reclamo está abierto o en proceso) */}
        {(reclamo.estado === 'ABIERTO' || reclamo.estado === 'EN_PROCESO') &&
          onSendMessage && (
            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <div className="flex-1">
                  <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    disabled={isSending}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <Button
                    type="submit"
                    disabled={!mensaje.trim() || isSending}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  >
                    {isSending ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Enviar</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                💡 Nuestro equipo suele responder en un plazo de 2-4 horas
                durante horario laboral.
              </p>
            </div>
          )}

        {/* Estado cerrado */}
        {reclamo.estado === 'RESUELTO' && (
          <div className="border-t border-gray-200 p-4 bg-green-50">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                Esta conversación ha sido marcada como resuelta.
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Si necesitas ayuda adicional, puedes crear una nueva consulta.
            </p>
          </div>
        )}

        {reclamo.estado === 'RECHAZADO' && (
          <div className="border-t border-gray-200 p-4 bg-red-50">
            <div className="flex items-center space-x-2 text-red-800">
              <X className="w-5 h-5" />
              <span className="font-medium">
                Esta conversación ha sido cerrada.
              </span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Si no estás de acuerdo con la resolución, puedes crear una nueva
              consulta.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};

export default ClaimChatModal;
