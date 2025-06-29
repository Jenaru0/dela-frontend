'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { 
  X, 
  FolderOpen, 
  Package, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Hash,
  Link2,
  Tag,
  FileText,
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { Categoria } from '@/services/categorias.service';
import categoriaProductosService, { ProductoCategoria, EstadisticasCategoria } from '@/services/categoria-productos.service';

interface EnhancedCategoriaDetailModalProps {
  categoria: Categoria;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'info' | 'productos' | 'estadisticas';

interface CategoriaActivity {
  productos: ProductoCategoria[];
  estadisticas: EstadisticasCategoria;
}

const EnhancedCategoriaDetailModal: React.FC<EnhancedCategoriaDetailModalProps> = ({ 
  categoria, 
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [categoriaActivity, setCategoriaActivity] = useState<CategoriaActivity | null>(null);
  const [error, setError] = useState<string | null>(null);  const loadCategoriaActivity = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Obtener productos reales de la categoría
      const productos = await categoriaProductosService.obtenerProductosPorCategoria(categoria.id);
      
      // Calcular estadísticas reales
      const estadisticas = await categoriaProductosService.calcularEstadisticas(productos);
      
      const activity: CategoriaActivity = {
        productos,
        estadisticas
      };
      
      setCategoriaActivity(activity);
    } catch (error) {
      console.error('Error al cargar actividad de la categoría:', error);
      setError('Error al cargar la actividad de la categoría');
      setCategoriaActivity({
        productos: [],
        estadisticas: {
          totalProductos: 0,
          productosActivos: 0,
          productosInactivos: 0,
          productosDestacados: 0,
          stockTotal: 0,
          valorInventario: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, [categoria.id]);

  useEffect(() => {
    if (isOpen && categoria) {
      loadCategoriaActivity();
    }
  }, [isOpen, categoria, loadCategoriaActivity]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  const getImagenPrincipal = (imagenes: ProductoCategoria['imagenes']) => {
    const imagenPrincipal = imagenes.find(img => img.principal);
    return imagenPrincipal?.url || imagenes[0]?.url || null;
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'info', label: 'Información', icon: FolderOpen },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#F5E6C6]/30 to-[#FAF3E7]/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#CC9F53] rounded-xl flex items-center justify-center mr-4">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#3A3A3A]">{categoria.nombre}</h2>
                <p className="text-[#9A8C61]">Detalles completos de la categoría</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/50">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-[#CC9F53] text-[#CC9F53]'
                        : 'border-transparent text-[#9A8C61] hover:text-[#3A3A3A] hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC9F53]"></div>
                <span className="ml-3 text-[#9A8C61]">Cargando información...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
                <span className="text-red-600">{error}</span>
              </div>
            ) : (
              <>
                {/* Información Tab */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Información Básica */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#3A3A3A] flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-[#CC9F53]" />
                          Información Básica
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Hash className="w-4 h-4 text-[#9A8C61] mr-2 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-[#9A8C61]">ID</p>
                              <p className="text-[#3A3A3A]">{categoria.id}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Tag className="w-4 h-4 text-[#9A8C61] mr-2 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-[#9A8C61]">Nombre</p>
                              <p className="text-[#3A3A3A]">{categoria.nombre}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Link2 className="w-4 h-4 text-[#9A8C61] mr-2 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-[#9A8C61]">Slug</p>
                              <p className="text-[#3A3A3A] font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                                {categoria.slug}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <FileText className="w-4 h-4 text-[#9A8C61] mr-2 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-[#9A8C61]">Descripción</p>
                              <p className="text-[#3A3A3A]">
                                {categoria.descripcion || 'Sin descripción'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Estado y Fechas */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#3A3A3A] flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-[#CC9F53]" />
                          Estado y Fechas
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            {categoria.activo ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-[#9A8C61]">Estado</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                categoria.activo
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {categoria.activo ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Calendar className="w-4 h-4 text-[#9A8C61] mr-2 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-[#9A8C61]">Creado</p>
                              <p className="text-[#3A3A3A]">{formatDate(categoria.creadoEn)}</p>
                            </div>
                          </div>                          <div className="flex items-start">
                            <Package className="w-4 h-4 text-[#9A8C61] mr-2 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-[#9A8C61]">Total de Productos</p>
                              <p className="text-2xl font-bold text-[#CC9F53]">
                                {categoriaActivity?.estadisticas.totalProductos || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}                {/* Productos Tab */}
                {activeTab === 'productos' && categoriaActivity && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#3A3A3A] flex items-center">
                      <Package className="w-5 h-5 mr-2 text-[#CC9F53]" />
                      Productos en esta Categoría ({categoriaActivity.estadisticas.totalProductos})
                    </h3>
                    
                    {categoriaActivity.productos.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-[#CC9F53] mx-auto mb-4 opacity-50" />
                        <p className="text-[#9A8C61] mb-2">No hay productos en esta categoría</p>
                        <p className="text-sm text-[#9A8C61]">
                          Los productos aparecerán aquí cuando se agreguen a esta categoría
                        </p>
                      </div>
                    ) : (                      <div className="space-y-3">
                        {categoriaActivity.productos.map((producto) => {
                          const imagenPrincipal = getImagenPrincipal(producto.imagenes);
                          
                          return (
                            <div key={producto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-[#F5E6C6] rounded-lg flex items-center justify-center overflow-hidden">
                                    {imagenPrincipal ? (
                                      <Image
                                        src={imagenPrincipal}
                                        alt={producto.nombre}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full rounded-lg"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.style.display = 'none';
                                          target.nextElementSibling?.classList.remove('hidden');
                                        }}
                                      />
                                    ) : null}
                                    <Package className={`w-5 h-5 text-[#CC9F53] ${imagenPrincipal ? 'hidden' : ''}`} />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-[#3A3A3A]">{producto.nombre}</h4>
                                    <p className="text-sm text-[#9A8C61]">SKU: {producto.sku}</p>
                                    {producto.descripcionCorta && (
                                      <p className="text-xs text-[#9A8C61] mt-1 max-w-md truncate">
                                        {producto.descripcionCorta}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-[#3A3A3A]">{formatPrice(producto.precioUnitario)}</p>
                                  {producto.precioAnterior && producto.precioAnterior > producto.precioUnitario && (
                                    <p className="text-xs text-gray-500 line-through">
                                      {formatPrice(producto.precioAnterior)}
                                    </p>
                                  )}
                                  <p className="text-sm text-[#9A8C61]">Stock: {producto.stock}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center space-x-4">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    producto.estado === 'ACTIVO'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {producto.estado}
                                  </span>
                                  {producto.destacado && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      Destacado
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#9A8C61]">
                                  Actualizado: {formatDate(producto.actualizadoEn)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Estadísticas Tab */}
                {activeTab === 'estadisticas' && categoriaActivity && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-[#3A3A3A] flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-[#CC9F53]" />
                      Estadísticas de la Categoría
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Package className="w-8 h-8 text-blue-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-600">Total Productos</p>
                            <p className="text-2xl font-bold text-blue-900">
                              {categoriaActivity.estadisticas.totalProductos}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-600">Productos Activos</p>
                            <p className="text-2xl font-bold text-green-900">
                              {categoriaActivity.estadisticas.productosActivos}
                            </p>
                          </div>
                        </div>
                      </div>                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <TrendingUp className="w-8 h-8 text-yellow-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-yellow-600">Productos Destacados</p>
                            <p className="text-2xl font-bold text-yellow-900">
                              {categoriaActivity.estadisticas.productosDestacados}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="w-8 h-8 text-red-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-600">Productos Inactivos</p>
                            <p className="text-2xl font-bold text-red-900">
                              {categoriaActivity.estadisticas.productosInactivos}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <ShoppingCart className="w-8 h-8 text-purple-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-purple-600">Stock Total</p>
                            <p className="text-2xl font-bold text-purple-900">
                              {categoriaActivity.estadisticas.stockTotal}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <DollarSign className="w-8 h-8 text-green-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-600">Valor Inventario</p>
                            <p className="text-2xl font-bold text-green-900">
                              {formatPrice(categoriaActivity.estadisticas.valorInventario)}
                            </p>
                          </div>
                        </div>
                      </div>                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-gray-50">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCategoriaDetailModal;
