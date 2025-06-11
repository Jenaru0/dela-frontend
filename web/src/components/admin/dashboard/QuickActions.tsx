'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Plus, 
  ShoppingBag, 
  Package, 
  MessageSquare, 
  Mail
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const router = useRouter();

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
          >
            Ver Documentación
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
