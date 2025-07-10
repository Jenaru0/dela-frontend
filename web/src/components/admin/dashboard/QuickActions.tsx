'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Plus, 
  ShoppingBag, 
  Package, 
  MessageSquare, 
  Mail,
  X
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const router = useRouter();
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);

  const actions = [
    {
      title: 'Crear Usuario',
      description: 'Agregar nuevo usuario al sistema',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      onClick: () => router.push('/admin/usuarios?action=create')
    },
    {
      title: 'Ver Usuarios',
      description: 'Gestionar usuarios registrados',
      icon: Users,
      color: 'from-green-500 to-green-600',
      onClick: () => router.push('/admin/usuarios')
    },
    {
      title: 'Gestionar Productos',
      description: 'Administrar catálogo de productos',
      icon: ShoppingBag,
      color: 'from-yellow-500 to-yellow-600',
      onClick: () => router.push('/admin/productos')
    },
    {
      title: 'Ver Pedidos',
      description: 'Revisar pedidos pendientes',
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      onClick: () => router.push('/admin/pedidos')
    },
    {
      title: 'Reclamos',
      description: 'Atender reclamos de clientes',
      icon: MessageSquare,
      color: 'from-red-500 to-red-600',
      onClick: () => router.push('/admin/reclamos')
    },
    {
      title: 'Newsletter',
      description: 'Gestionar suscripciones',
      icon: Mail,
      color: 'from-indigo-500 to-indigo-600',
      onClick: () => router.push('/admin/newsletter')
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#ecd8ab]/30">
      <h3 className="text-lg font-semibold text-[#3A3A3A] mb-4">Acciones Rápidas</h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              onClick={action.onClick}
              className="w-full flex items-center justify-start space-x-3 p-4 h-auto hover:bg-[#F5E6C6]/30 border border-transparent hover:border-[#CC9F53]/20 transition-all duration-200"
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-[#3A3A3A]">{action.title}</p>
                <p className="text-xs text-[#9A8C61]">{action.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-[#ecd8ab]/30">
        <div className="text-center">
          <p className="text-xs text-[#9A8C61] mb-2">
            ¿Necesitas ayuda?
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-[#CC9F53] border-[#CC9F53] hover:bg-[#CC9F53] hover:text-white"
            onClick={() => setShowDocumentationModal(true)}
          >
            Ver Documentación
          </Button>
        </div>
      </div>

      {/* Modal de Documentación */}
      {showDocumentationModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDocumentationModal(false);
            }
          }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] border border-[#ecd8ab]/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-[#ecd8ab]/40 bg-gradient-to-r from-[#F5E6C6]/20 to-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#CC9F53] to-[#B8935A] rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#3A3A3A]">Documentación del Sistema</h3>
                  <p className="text-sm text-[#9A8C61]">Guía completa de uso y administración</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDocumentationModal(false)}
                className="p-2 hover:bg-[#F5E6C6]/50 rounded-xl border border-transparent hover:border-[#CC9F53]/20 transition-all duration-200"
              >
                <X className="w-5 h-5 text-[#9A8C61] hover:text-[#CC9F53]" />
              </Button>
            </div>
            
            {/* Contenido del Modal */}
            <div className="p-6 h-[calc(90vh-8rem)] bg-gradient-to-b from-white to-[#F5E6C6]/10">
              <div className="w-full h-full rounded-xl overflow-hidden border border-[#ecd8ab]/30 shadow-inner">
                <iframe
                  src="https://drive.google.com/file/d/1C_s-RZMoWhaFnjHRqy7MPvXWSRgbnwi_/preview"
                  className="w-full h-full border-0"
                  title="Documentación del Sistema DELA Platform"
                  allow="autoplay"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
