'use client';

import React, { useEffect } from "react";
import { AlertTriangle, X, User, Shield, UserCheck, UserX } from "lucide-react";
import { Usuario } from "@/types/usuarios";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  onConfirm: (userId: number, currentStatus: boolean) => void;
  isLoading?: boolean;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  usuario,
  onConfirm,
  isLoading = false
}) => {
  // Bloquear scroll cuando el modal esté abierto
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

  // Cerrar modal al hacer click fuera
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };
  if (!isOpen || !usuario) return null;

  const handleConfirm = () => {
    onConfirm(usuario.id, usuario.activo || false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto border border-gray-200">
        {/* Header profesional */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                {usuario.activo ? (
                  <UserX className="w-5 h-5 text-amber-600" />
                ) : (
                  <UserCheck className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {usuario.activo ? 'Desactivar Usuario' : 'Activar Usuario'}
                </h2>
                <p className="text-sm text-gray-500">
                  {usuario.activo ? 'Revocar acceso al sistema' : 'Esta acción es reversible'}
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Contenido compacto */}
        <div className="p-6">
          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center relative">
                  <span className="text-gray-700 font-bold text-lg">
                    {(usuario.nombres || 'U').charAt(0)}{(usuario.apellidos || 'S').charAt(0)}
                  </span>                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                    usuario.tipoUsuario === 'ADMIN' ? 'bg-amber-500' : 'bg-amber-400'
                  }`}>
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate mb-1">
                  {usuario.nombres || 'Sin nombre'} {usuario.apellidos || 'Sin apellido'}
                </h4>                <div className="flex items-center space-x-3 text-sm text-gray-500 mb-2">
                  <span className="truncate">{usuario.email}</span>
                </div>
                <div className="flex items-center justify-between">                  <div className="text-lg font-bold text-amber-600">
                    {usuario.activo ? 'Desactivar' : 'Activar'}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                    usuario.tipoUsuario === 'ADMIN' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {usuario.tipoUsuario}
                  </span>
                </div>
              </div>
            </div>
          </div>          {/* Advertencia simple */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900 mb-1">
                  ¿Confirmas {usuario.activo ? 'desactivar' : 'activar'} este usuario?
                </h3>
                <p className="text-sm text-amber-800">
                  {usuario.activo 
                    ? 'El usuario no podrá acceder al sistema hasta ser reactivado.'
                    : 'El usuario podrá acceder a todas las funciones del sistema.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Información sobre la acción */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 text-sm mb-2 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Qué sucederá:
            </h5>            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                {usuario.activo 
                  ? 'Se bloqueará el acceso inmediatamente'
                  : 'Se habilitará el acceso inmediatamente'
                }
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                {usuario.activo 
                  ? 'Las sesiones activas se cerrarán'
                  : 'Podrá iniciar sesión normalmente'
                }
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                {usuario.activo 
                  ? 'Podrás reactivarlo cuando quieras'
                  : 'Tendrá acceso a todas las funciones'
                }
              </li>
            </ul>
          </div>
        </div>

        {/* Botones profesionales */}
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {usuario.activo ? (
                    <UserX className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  <span>{usuario.activo ? 'Desactivar' : 'Activar'}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
