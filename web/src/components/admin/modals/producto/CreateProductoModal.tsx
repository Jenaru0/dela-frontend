import React, { useState, useEffect } from 'react';
import {
  CreateProductoDto,
  productosService,
  ProductoAdmin,
} from '@/services/productos-admin.service';
import { categoriasService, Categoria } from '@/services/categorias.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/ui/ImageUpload';
import { X, Package, Hash, Tag, FileText, Weight, Star } from 'lucide-react';

interface CreateProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductoCreated: () => void;
  onEditProducto?: (producto: ProductoAdmin) => void; // Nueva prop para abrir edición
}

const CreateProductoModal: React.FC<CreateProductoModalProps> = ({
  isOpen,
  onClose,
  onProductoCreated,
  onEditProducto,
}) => {
  const [formData, setFormData] = useState<CreateProductoDto>({
    nombre: '',
    descripcion: '',
    sku: '',
    slug: '',
    precioUnitario: 0,
    precioAnterior: 0,
    stock: 0,
    stockMinimo: 5, // Mantener valor por defecto
    unidadMedida: 'kg',
    peso: 0,
    estado: 'ACTIVO',
    destacado: false,
    categoriaId: 0,
  });
  const [imagePreviews, setImagePreviews] = useState<{ file: File; preview: string }[]>([]);
  const [resetTrigger, setResetTrigger] = useState(0);  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successModal, setSuccessModal] = useState<{show: boolean, producto: ProductoAdmin | null}>({show: false, producto: null});

  // Bloquear scroll del body cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  // Cargar categorías
  useEffect(() => {
    if (isOpen) {
      loadCategorias();
    }
  }, [isOpen]);
  const loadCategorias = async () => {
    try {
      const response = await categoriasService.obtenerTodas();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };
  const generateSKU = () => {
    const prefix = 'PRD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const generateSlug = (nombre: string) => {
    if (!nombre.trim()) return '';
    return nombre
      .toLowerCase()
      .trim()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validaciones básicas
      const newErrors: Record<string, string> = {};

      if (!formData.nombre?.trim()) {
        newErrors.nombre = 'El nombre es requerido';
      }
      if (!formData.sku?.trim()) {
        newErrors.sku = 'El SKU es requerido';
      }

      if (!formData.slug?.trim()) {
        newErrors.slug = 'El slug es requerido';
      }

      if (formData.precioUnitario <= 0) {
        newErrors.precioUnitario = 'El precio debe ser mayor a 0';
      }

      if (formData.categoriaId <= 0) {
        newErrors.categoriaId = 'Debe seleccionar una categoría';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }      // SIMPLIFICADO: Solo crear el producto sin imágenes
      console.log('🔄 Creando producto...', { formData });
      console.log('📦 Creando producto sin imágenes - Las imágenes se pueden agregar después en edición');

      const result = await productosService.crear(formData);
      console.log('✅ Producto creado exitosamente:', result);

      // Reset form
      setFormData({
        nombre: '',
        descripcion: '',
        sku: '',
        slug: '',
        precioUnitario: 0,
        precioAnterior: 0,
        stock: 0,
        stockMinimo: 5,
        unidadMedida: 'kg',
        peso: 0,
        estado: 'ACTIVO',
        destacado: false,
        categoriaId: 0,
      });

      setImagePreviews([]);
      setResetTrigger((prev) => prev + 1);

      // Mostrar modal de éxito
      setSuccessModal({show: true, producto: result.data});
      onProductoCreated();
    } catch (error) {
      console.error('Error al crear producto:', error);
      setErrors({ general: 'Error al crear el producto' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    field: keyof CreateProductoDto,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#ecd8ab]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#CC9F53] to-[#b08a3c] rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#3A3A3A]">Crear Producto</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5E6C6]/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#9A8C61]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3A3A3A] border-b border-[#ecd8ab]/30 pb-2">
              Información Básica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Nombre del Producto *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
                  <Input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    className={`pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 ${
                      errors.nombre ? 'border-red-300' : ''
                    }`}
                    placeholder="Ej: Aceite de Oliva Extra Virgen"
                  />
                </div>
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  SKU *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
                  <Input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    className={`pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 ${
                      errors.sku ? 'border-red-300' : ''
                    }`}
                    placeholder="Ej: PRD-123456-ABC"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChange('sku', generateSKU())}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#CC9F53] hover:text-[#b08a3c]"
                  >
                    Generar
                  </Button>
                </div>{' '}
                {errors.sku && (
                  <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Slug (URL amigable) *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
                  <Input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className={`pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 ${
                      errors.slug ? 'border-red-300' : ''
                    }`}
                    placeholder="Ej: producto-ejemplo-2024"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleChange('slug', generateSlug(formData.nombre))
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#CC9F53] hover:text-[#b08a3c]"
                  >
                    Generar
                  </Button>
                </div>
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Categoría *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
                  <select
                    value={formData.categoriaId}
                    onChange={(e) =>
                      handleChange('categoriaId', parseInt(e.target.value))
                    }
                    className={`w-full pl-10 pr-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 ${
                      errors.categoriaId ? 'border-red-300' : ''
                    }`}
                  >
                    <option value={0}>Seleccionar categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.categoriaId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.categoriaId}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                Descripción
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-[#9A8C61] h-5 w-5" />
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                  placeholder="Descripción detallada del producto..."
                />
              </div>
            </div>
          </div>

          {/* Precios y stock */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3A3A3A] border-b border-[#ecd8ab]/30 pb-2">
              Precios y Stock
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {' '}
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Precio Unitario (S/) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precioUnitario}
                  onChange={(e) =>
                    handleChange(
                      'precioUnitario',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={`border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20 ${
                    errors.precioUnitario ? 'border-red-300' : ''
                  }`}
                  placeholder="0.00"
                />
                {errors.precioUnitario && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.precioUnitario}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Precio Anterior (S/)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precioAnterior}
                  onChange={(e) =>
                    handleChange(
                      'precioAnterior',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Stock Inicial
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      handleChange('stock', parseInt(e.target.value) || 0)
                    }
                    className="pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                    placeholder="0"
                  />
                </div>
              </div>{' '}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Stock Mínimo
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.stockMinimo}
                  onChange={(e) =>
                    handleChange('stockMinimo', parseInt(e.target.value) || 0)
                  }
                  className="border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                  placeholder="5"
                />
              </div>{' '}
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Peso/Volumen
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
                    <Input
                      type="number"
                      step="0.001"
                      min="0"
                      value={formData.peso}
                      onChange={(e) =>
                        handleChange('peso', parseFloat(e.target.value) || 0)
                      }
                      className="pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                      placeholder="0.000"
                    />
                  </div>
                  <select
                    value={formData.unidadMedida}
                    onChange={(e) =>
                      handleChange('unidadMedida', e.target.value)
                    }
                    className="border border-[#ecd8ab]/50 rounded-lg px-3 py-2 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                  >
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="g">Gramos (g)</option>
                    <option value="l">Litros (l)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="unidades">Unidades</option>
                    <option value="piezas">Piezas</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Imágenes del Producto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3A3A3A] border-b border-[#ecd8ab]/30 pb-2">
              Imágenes del Producto
            </h3>

            {/* Nota informativa */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-amber-600 mt-0.5">
                  ℹ️
                </div>
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    Nota: Las imágenes se pueden agregar después de crear el producto
                  </p>                  <p className="text-xs text-amber-700 mt-1">
                    Una vez creado el producto, usa la opción &ldquo;Editar&rdquo; para agregar y gestionar las imágenes. 
                    La primera imagen que agregues será automáticamente la imagen principal.
                  </p>
                </div>
              </div>
            </div>

            <ImageUpload
              onImagesSelected={setImagePreviews}
              maxImages={5}
              resetTrigger={resetTrigger}
              className="w-full opacity-50 pointer-events-none"
            />

            {imagePreviews.length > 0 && (
              <p className="text-sm text-amber-600">
                ⚠️ {imagePreviews.length} imagen{imagePreviews.length !== 1 ? 'es' : ''} seleccionada{imagePreviews.length !== 1 ? 's' : ''} 
                - Se agregarán después de crear el producto
              </p>
            )}
          </div>

          {/* Configuración */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3A3A3A] border-b border-[#ecd8ab]/30 pb-2">
              Configuración
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Estado del Producto
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    handleChange(
                      'estado',
                      e.target.value as 'ACTIVO' | 'INACTIVO' | 'AGOTADO'
                    )
                  }
                  className="w-full px-3 py-2 border border-[#ecd8ab]/50 rounded-md focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="AGOTADO">Agotado</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="destacado"
                  checked={formData.destacado}
                  onChange={(e) => handleChange('destacado', e.target.checked)}
                  className="mr-2 text-[#CC9F53] focus:ring-[#CC9F53]/20"
                />{' '}
                <label
                  htmlFor="destacado"
                  className="text-sm text-[#3A3A3A] flex items-center"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Producto destacado
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#ecd8ab]/30">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#CC9F53] text-[#CC9F53] hover:bg-[#CC9F53] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#CC9F53] to-[#b08a3c] hover:from-[#b08a3c] hover:to-[#9a7635] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300"
            >
              {isLoading ? 'Creando...' : 'Crear Producto'}
            </Button>          </div>
        </form>
      </div>

      {/* Modal de éxito */}
      {successModal.show && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  ¡Producto Creado!
                </h3>
                <p className="text-sm text-gray-600">
                  El producto se ha creado exitosamente
                </p>
              </div>
            </div>
            
            {/* Contenido del modal */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {successModal.producto?.nombre}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  SKU: {successModal.producto?.sku}
                </p>
                {imagePreviews.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      💡 Tienes {imagePreviews.length} imagen{imagePreviews.length !== 1 ? 'es' : ''} seleccionada{imagePreviews.length !== 1 ? 's' : ''}. 
                      ¿Quieres agregarlas ahora?
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer con botones */}
            <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              <Button
                onClick={() => {
                  setSuccessModal({show: false, producto: null});
                  onClose();
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                Cerrar
              </Button>
              {onEditProducto && (                <Button
                  onClick={() => {
                    if (successModal.producto && onEditProducto) {
                      onEditProducto(successModal.producto);
                    }
                    setSuccessModal({show: false, producto: null});
                    onClose();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                >
                  {imagePreviews.length > 0 ? '📸 Agregar Imágenes' : '✏️ Editar Producto'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProductoModal;
