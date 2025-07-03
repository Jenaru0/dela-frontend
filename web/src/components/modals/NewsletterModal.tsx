import React, { useEffect } from 'react';
import { Mail, X, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'subscribe' | 'unsubscribe';
  isLoading?: boolean;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  isLoading = false,
}) => {
  
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Configuración visual según el tipo
  const getModalConfig = () => {
    switch (type) {
      case 'subscribe':
        return {
          icon: Mail,
          iconColor: 'text-[#CC9F53]',
          bgColor: 'bg-gradient-to-r from-[#FAF3E7] to-[#F5E6C6]',
          borderColor: 'border-[#ECD8AB]',
          buttonColor: 'bg-[#CC9F53] hover:bg-[#B88D42]',
          title: 'Suscribirse al Newsletter',
          iconBg: 'bg-[#F5E6C6]',
          confirmText: 'Sí, suscribirme',
          message: '¿Estás seguro de que quieres suscribirte a nuestro newsletter? Recibirás ofertas exclusivas, novedades de productos artesanales y contenido especial directamente en tu correo.'
        };
      case 'unsubscribe':
        return {
          icon: X,
          iconColor: 'text-amber-600',
          bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
          borderColor: 'border-amber-200',
          buttonColor: 'bg-amber-500 hover:bg-amber-600',
          title: 'Desuscribirse del Newsletter',
          iconBg: 'bg-amber-100',
          confirmText: 'Sí, desuscribirme',
          message: '¿Estás seguro de que quieres desuscribirte? Ya no recibirás nuestras ofertas exclusivas, novedades de productos artesanales ni contenido especial.'
        };
    }
  };

  const config = getModalConfig();
  const IconComponent = config.icon;

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full max-w-md 
          transform transition-all duration-300 ease-out
          animate-in fade-in slide-in-from-bottom-4
          ${config.borderColor} border-2
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-modal-title"
      >
        {/* Header con ícono y título */}
        <div className={`${config.bgColor} p-6 rounded-t-2xl border-b ${config.borderColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${config.iconBg}`}>
                <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <h2 
                id="newsletter-modal-title" 
                className="text-xl font-semibold text-gray-800"
              >
                {config.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/70"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido del mensaje */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed mb-6">
            {config.message}
          </p>

          {/* Beneficios adicionales para suscripción */}
          {type === 'subscribe' && (
            <div className="mb-6 space-y-3">
              <h3 className="text-sm font-semibold text-[#CC9F53] mb-3">✨ ¿Qué recibirás?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-[#CC9F53]" />
                  <span>Ofertas exclusivas y descuentos especiales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#CC9F53]" />
                  <span>Novedades de productos artesanales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#CC9F53]" />
                  <span>Contenido exclusivo y tips de estilo de vida</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                📧 Máximo 2-3 correos por semana. Puedes desuscribirte en cualquier momento.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 text-white ${config.buttonColor}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                config.confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
