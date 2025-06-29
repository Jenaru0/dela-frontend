import React from 'react';
import { DireccionCliente } from '@/types/direcciones';
import { Button } from '@/components/ui/Button';
import { MapPin, Edit, Trash2, Star, Home, Building } from 'lucide-react';

interface AddressListProps {
  direcciones: DireccionCliente[];
  onEdit: (direccion: DireccionCliente) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  isLoading?: boolean;
}

const AddressList: React.FC<AddressListProps> = ({
  direcciones,
  onEdit,
  onDelete,
  onSetDefault,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-4 h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (direcciones.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes direcciones guardadas
        </h3>
        <p className="text-gray-500">
          Agrega tu primera dirección para facilitar tus compras
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {direcciones.map((direccion) => (
        <div
          key={direccion.id}
          className={`relative bg-white border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
            direccion.predeterminada 
              ? 'border-primary-300 bg-primary-50/30' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Badge de predeterminada */}
          {direccion.predeterminada && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                <Star className="h-3 w-3 fill-current" />
                Predeterminada
              </div>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Alias y ubicación */}
              <div className="flex items-center gap-2 mb-2">
                {direccion.alias?.toLowerCase().includes('casa') ? (
                  <Home className="h-4 w-4 text-gray-500" />
                ) : direccion.alias?.toLowerCase().includes('trabajo') ? (
                  <Building className="h-4 w-4 text-gray-500" />
                ) : (
                  <MapPin className="h-4 w-4 text-gray-500" />
                )}
                <h3 className="font-medium text-gray-900">
                  {direccion.alias || 'Dirección'}
                </h3>
              </div>

              {/* Dirección completa */}
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">{direccion.direccion}</p>
                {(direccion.distrito || direccion.provincia) && (
                  <p>
                    {[direccion.distrito, direccion.provincia].filter(Boolean).join(', ')}
                    {direccion.codigoPostal && ` ${direccion.codigoPostal}`}
                  </p>
                )}
                {direccion.referencia && (
                  <p className="text-gray-500 italic">
                    Ref: {direccion.referencia}
                  </p>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 ml-4">
              {!direccion.predeterminada && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetDefault(direccion.id)}
                  className="text-gray-500 hover:text-primary-600"
                  title="Establecer como predeterminada"
                >
                  <Star className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(direccion)}
                className="text-gray-500 hover:text-blue-600"
                title="Editar dirección"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
                    onDelete(direccion.id);
                  }
                }}
                className="text-gray-500 hover:text-red-600"
                title="Eliminar dirección"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
