// Componente de prueba para verificar que el ClaimDetailModal funciona
import React, { useState } from 'react';
import ClaimDetailModal from '@/components/perfil/ClaimDetailModal';
import { Button } from '@/components/ui/Button';
import { TipoReclamo, EstadoReclamo, PrioridadReclamo, TipoUsuario } from '@/types/enums';

const TestClaimModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Datos de prueba
  const mockReclamo = {
    id: 1,
    asunto: "Problema con mi pedido de aceite de oliva",
    descripcion: "El producto llegó en mal estado y necesito una solución urgente",
    estado: EstadoReclamo.ABIERTO,
    prioridad: PrioridadReclamo.ALTA,
    tipoReclamo: TipoReclamo.PRODUCTO_DEFECTUOSO,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    fechaCierre: undefined,
    usuarioId: 1,
    pedidoId: 123,
    usuario: {
      id: 1,
      nombres: "Juan",
      apellidos: "Pérez",
      email: "juan@ejemplo.com",
      tipoUsuario: TipoUsuario.CLIENTE
    },
    pedido: {
      id: 123,
      numero: "PED-2024-001"
    },
    comentarios: [
      {
        id: 1,
        comentario: "Hola, mi pedido llegó dañado. ¿Pueden ayudarme?",
        esInterno: false,
        creadoEn: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        usuario: {
          id: 1,
          nombres: "Juan",
          apellidos: "Pérez",
          tipoUsuario: TipoUsuario.CLIENTE
        }
      },
      {
        id: 2,
        comentario: "Gracias por contactarnos. Procesaremos tu solicitud inmediatamente.",
        esInterno: false,
        creadoEn: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        usuario: {
          id: 2,
          nombres: "Admin",
          apellidos: "Soporte",
          tipoUsuario: TipoUsuario.ADMIN
        }
      }
    ]
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Prueba ClaimDetailModal</h1>
      
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-[#CC9F53] hover:bg-[#b08a3c] text-white"
      >
        Abrir Modal de Reclamo
      </Button>

      <ClaimDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        reclamo={mockReclamo}
        onReclamoUpdate={() => console.log('Reclamo actualizado')}
      />
    </div>
  );
};

export default TestClaimModal;
