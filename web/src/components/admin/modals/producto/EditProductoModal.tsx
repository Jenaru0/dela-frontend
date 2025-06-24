import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ProductoAdmin,
  UpdateProductoDto,
  productosService,
  ProductoImagen,
} from '@/services/productos-admin.service';
import { categoriasService, Categoria } from '@/services/categorias.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/ui/ImageUpload';
import { cloudinaryService } from '@/services/cloudinary.service';
import { toast } from 'react-hot-toast';

import {
  X,
  Package,
  Hash,
  Tag,
  FileText,
  Weight,
  Star,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

interface EditProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: ProductoAdmin;
  onProductoUpdated: () => void;
}

const EditProductoModal: React.FC<EditProductoModalProps> = ({
  isOpen,
  onClose,
  producto,
  onProductoUpdated,
}) => {
  const [formData, setFormData] = useState<UpdateProductoDto>({
    nombre: '',
    descripcion: '',
    sku: '',
    slug: '',
    precioUnitario: 0,
    precioAnterior: 0,
    stock: 0,
    stockMinimo: 0,
    unidadMedida: 'kg',
    peso: 0,
    estado: 'ACTIVO',
    destacado: false,
    categoriaId: 0,
  });

  // Estados para manejar imágenes
  const [imagenes, setImagenes] = useState<ProductoImagen[]>([]);
  const [nuevasImagenes, setNuevasImagenes] = useState<{file: File, preview: string}[]>([]);
  const [altTexts, setAltTexts] = useState<Record<string, string>>({}); // Nuevo: altText por id de preview
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [resetImageUpload, setResetImageUpload] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string>(''); // Nuevo estado para mensajes de éxito
  // Estados para edición de imágenes  // Estados para edición de altText
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [tempAltText, setTempAltText] = useState<string>('');
    
  // Estados para modal de confirmación de eliminación
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<ProductoImagen | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Nuevo estado para reemplazo de imagen
  const [replaceModal, setReplaceModal] = useState<{id: number, file: File, preview: string} | null>(null);

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
  }, [isOpen]); // Cargar datos del producto y categorías
  useEffect(() => {
    if (isOpen && producto) {
      console.log('🔄 Cargando datos del producto para edición:', producto);

      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        sku: producto.sku,
        slug: producto.slug,
        precioUnitario: producto.precioUnitario,
        precioAnterior: producto.precioAnterior || 0,
        stock: producto.stock,
        stockMinimo: producto.stockMinimo || 0,
        unidadMedida: producto.unidadMedida || 'kg',
        peso: producto.peso || 0,
        estado: producto.estado,
        destacado: producto.destacado,
        categoriaId: producto.categoriaId,
      }); // Cargar imágenes existentes with validación
      const imagenesValidas = (producto.imagenes || []).filter(
        (img) => img && img.id && img.url && isValidUrl(img.url)
      );
      setImagenes(imagenesValidas);
      console.log('📸 Imágenes existentes válidas:', imagenesValidas);      // Limpiar nuevas imágenes
      setNuevasImagenes([]);
      setResetImageUpload((prev) => prev + 1);
      setSuccessMessage(''); // Limpiar mensaje de éxito

      loadCategorias();
    }
  }, [isOpen, producto]);
  const loadCategorias = async () => {
    try {
      const response = await categoriasService.obtenerTodas();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };  // Función para refrescar imágenes desde el backend
  const refreshImagenes = async () => {
    try {
      console.log('🔄 Refrescando imágenes desde el backend...');
      
      // Pequeño delay para asegurar que el backend esté sincronizado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await productosService.obtenerPorId(producto.id);
      console.log('📡 Respuesta completa del backend:', JSON.stringify(response, null, 2));
      
      if (!response) {
        console.error('❌ Respuesta nula del backend');
        throw new Error('No se recibió respuesta del servidor');
      }

      // Manejo robusto de ambos formatos de respuesta:
      // 1. Formato con wrapper: { mensaje, data: producto }
      // 2. Formato directo: producto
      let productoActualizado: ProductoAdmin;
      
      if (response.data) {
        // Formato con wrapper { mensaje, data }
        console.log('📦 Formato con wrapper detectado');        productoActualizado = response.data;
      } else if ((response as unknown as ProductoAdmin).id) {
        // Formato directo (el producto directamente)
        console.log('📦 Formato directo detectado');
        productoActualizado = response as unknown as ProductoAdmin;
      } else {
        console.error('❌ Formato de respuesta desconocido:', response);
        throw new Error('El formato de respuesta del servidor no es válido');
      }
      
      console.log('📦 Producto actualizado:', JSON.stringify(productoActualizado, null, 2));
      
      if (!productoActualizado.imagenes) {
        console.warn('⚠️ El producto no tiene campo imagenes, inicializando array vacío');
        setImagenes([]);
        return [];
      }
      
      const imagenesActualizadas = productoActualizado.imagenes
        .filter((img) => {
          if (!img) {
            console.warn('⚠️ Imagen nula encontrada');
            return false;
          }
          if (!img.id) {
            console.warn('⚠️ Imagen sin ID encontrada:', img);
            return false;
          }
          if (!img.url) {
            console.warn('⚠️ Imagen sin URL encontrada:', img);
            return false;
          }
          if (!isValidUrl(img.url)) {
            console.warn('⚠️ URL de imagen inválida:', img.url);
            return false;
          }
          return true;
        })
        .map(img => ({
          ...img,
          url: addCacheBuster(img.url)
        }));
      
      console.log('📸 Imágenes procesadas y filtradas:', imagenesActualizadas);
      setImagenes(imagenesActualizadas);
      
      // También notificar al componente padre para que actualice su lista
      if (onProductoUpdated) {
        onProductoUpdated();
      }
      
      console.log('✅ Imágenes refrescadas exitosamente');
      return imagenesActualizadas;    } catch (error) {
      console.error('❌ Error al refrescar imágenes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al cargar las imágenes: ${errorMessage}`);
      throw error;
    }
  };
  // Funciones para manejar imágenes
  const handleSetPrincipal = async (imagenId: number) => {
    try {
      setIsUploadingImages(true);
      console.log('🌟 Estableciendo imagen principal:', imagenId);

      // Actualizar en el backend
      await productosService.actualizarImagen(imagenId, { principal: true });

      // Refrescar imágenes desde el backend
      await refreshImagenes();

      // Mostrar mensaje de éxito
      setSuccessMessage('✅ Imagen principal actualizada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);

      console.log('✅ Imagen principal actualizada');
    } catch (error) {
      console.error('❌ Error al establecer imagen principal:', error);
      alert('Error al establecer imagen principal');
    } finally {
      setIsUploadingImages(false);
    }
  };
  const handleDeleteImagen = async (imagenId: number) => {
    // Encontrar la imagen que se va a eliminar
    const imagen = imagenes.find(img => img.id === imagenId);
    if (!imagen) return;
    
    // Mostrar modal de confirmación
    setImageToDelete(imagen);
    setDeletingImageId(imagenId);
  };
  const confirmDeleteImagen = async () => {
    if (!deletingImageId || !imageToDelete) return;

    try {
      setIsUploadingImages(true);
      console.log('🗑️ Eliminando imagen:', deletingImageId);

      await productosService.eliminarImagen(producto.id, deletingImageId);      
      
      // Refrescar imágenes desde el backend
      await refreshImagenes();

      // Mostrar mensaje de éxito
      setSuccessMessage('✅ Imagen eliminada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);

      console.log('✅ Imagen eliminada');
    } catch (error) {
      console.error('❌ Error al eliminar imagen:', error);
      alert('Error al eliminar la imagen');
    } finally {
      setIsUploadingImages(false);
      setDeletingImageId(null);
      setImageToDelete(null);
    }
  };

  const cancelDeleteImagen = () => {
    setDeletingImageId(null);
    setImageToDelete(null);
  };
  const handleAgregarNuevasImagenes = async () => {
    if (nuevasImagenes.length === 0) return;

    try {
      setIsUploadingImages(true);
      console.log('📸 Agregando nuevas imágenes:', nuevasImagenes.length);
        let imagenesSubidas = 0;
      const errores: string[] = [];
        for (let i = 0; i < nuevasImagenes.length; i++) {
        try {
          const { file, preview } = nuevasImagenes[i];
          const altText = altTexts[preview] || '';
          const esPrimera = imagenes.length === 0 && i === 0;
          
          console.log(`📷 Procesando imagen ${i + 1}/${nuevasImagenes.length}: ${file.name}`);
          
          // Subir imagen a Cloudinary
          const uploadResult = await cloudinaryService.uploadImage(file);
          
          const imagenDto = {
            url: uploadResult.secure_url,
            altText,
            principal: esPrimera,
            // No enviar orden - que el backend lo calcule automáticamente
          };
          
          console.log(`💾 Guardando imagen en backend:`, {
            url: file.name,
            principal: imagenDto.principal,
            altText: imagenDto.altText
          });
          
          // Intentar guardar en el backend
          await productosService.agregarImagen(producto.id, imagenDto);
          imagenesSubidas++;
          console.log(`✅ Imagen ${i + 1} agregada exitosamente`);
        } catch (imageError) {
          console.error(`❌ Error al procesar imagen ${i + 1}:`, imageError);
          const errorMessage = imageError instanceof Error ? imageError.message : 'Error desconocido';
          errores.push(`Imagen ${i + 1}: ${errorMessage}`);
        }
      }
        // Limpiar nuevas imágenes solo si se procesaron todas
      setNuevasImagenes([]);
      setAltTexts({});
      setResetImageUpload((prev) => prev + 1);

      // 🔥 Refrescar imágenes desde el backend para mostrar la galería actualizada al instante
      try {
        await refreshImagenes();
      } catch (refreshError) {
        console.error('❌ Error al refrescar imágenes:', refreshError);
      }

      // Mostrar mensaje de resultado
      if (imagenesSubidas === nuevasImagenes.length) {
        setSuccessMessage(`✅ ${imagenesSubidas} imagen${imagenesSubidas !== 1 ? 'es' : ''} agregada${imagenesSubidas !== 1 ? 's' : ''} correctamente`);
      } else if (imagenesSubidas > 0) {
        setSuccessMessage(`⚠️ ${imagenesSubidas} de ${nuevasImagenes.length} imágenes agregadas. Algunas fallaron.`);
      } else {
        setSuccessMessage(`❌ No se pudo agregar ninguna imagen. Revisa la conexión.`);
      }
      
      // Mostrar errores específicos si los hay
      if (errores.length > 0) {
        console.error('🔍 Errores detallados:', errores);
        setTimeout(() => {
          alert(`Errores encontrados:\n\n${errores.join('\n')}`);
        }, 1000);
      }
      
      setTimeout(() => setSuccessMessage(''), 5000);
      console.log(`✅ Proceso completado: ${imagenesSubidas}/${nuevasImagenes.length} imágenes agregadas`);
        } catch (error) {
      console.error('❌ Error general al agregar imágenes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setSuccessMessage(`❌ Error al procesar las imágenes: ${errorMessage}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } finally {
      setIsUploadingImages(false);
    }
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

      if ((formData.precioUnitario || 0) <= 0) {
        newErrors.precioUnitario = 'El precio debe ser mayor a 0';
      }

      if ((formData.categoriaId || 0) <= 0) {
        newErrors.categoriaId = 'Debe seleccionar una categoría';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      console.log('🔄 Actualizando producto...', formData);

      // 1. Actualizar datos básicos del producto
      await productosService.actualizar(producto.id, formData);
      console.log('✅ Datos del producto actualizados');

      // 2. Agregar nuevas imágenes si las hay
      if (nuevasImagenes.length > 0) {
        await handleAgregarNuevasImagenes();
      }

      onProductoUpdated();
      onClose();
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      setErrors({ general: 'Error al actualizar el producto' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    field: keyof UpdateProductoDto,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };
  // Función auxiliar para validar URLs
  const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Función auxiliar para agregar cache busting a las URLs
  const addCacheBuster = (url: string): string => {
    if (!url) return url;
    const timestamp = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${timestamp}`;
  };
  const handleEditAltText = (imagenId: number, currentAltText: string) => {
    setEditingImageId(imagenId);
    setTempAltText(currentAltText || '');
  };
  const handleSaveAltText = async (imagenId: number) => {
    try {
      setIsUploadingImages(true);
      console.log('📝 Actualizando altText de imagen:', { imagenId, altText: tempAltText });

      await productosService.actualizarImagen(imagenId, { altText: tempAltText });

      // Refrescar imágenes desde el backend
      await refreshImagenes();

      setEditingImageId(null);
      setTempAltText('');
      setSuccessMessage('✅ Texto alternativo actualizado correctamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);

      console.log('✅ AltText actualizado exitosamente');
    } catch (error) {
      console.error('❌ Error al actualizar altText:', error);
      alert('Error al actualizar el texto alternativo');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleCancelEditAltText = () => {
    setEditingImageId(null);
    setTempAltText('');
  };
  // Funciones para reemplazar imágenes
  const handleReplaceImage = (imagenId: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setReplaceModal({id: imagenId, file, preview: ev.target?.result as string});
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };  const confirmReplaceImage = async () => {
    if (!replaceModal) return;
    try {
      setIsUploadingImages(true);
      const uploadResult = await cloudinaryService.uploadImage(replaceModal.file);
      const newImageUrl = uploadResult.secure_url;
      const currentImage = imagenes.find(img => img.id === replaceModal.id);
      if (!currentImage) throw new Error('Imagen no encontrada');
      await productosService.actualizarImagen(replaceModal.id, {
        url: newImageUrl,
        altText: currentImage.altText || `Imagen del producto ${producto.nombre}`
      });
      
      // Refrescar imágenes desde el backend
      await refreshImagenes();
      
      setSuccessMessage('✅ Imagen reemplazada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);      setReplaceModal(null);
    } catch {
      alert('Error al reemplazar la imagen. Por favor, intenta de nuevo.');
    } finally {
      setIsUploadingImages(false);
    }
  };
  const cancelReplaceImage = () => setReplaceModal(null);

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
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3A3A3A]">
                Editar Producto
              </h2>
              <p className="text-sm text-[#9A8C61]">{producto.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5E6C6]/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#9A8C61]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}
          {successMessage && ( // Mensaje de éxito
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{successMessage}</p>
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
                </div>
                {errors.sku && (
                  <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
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
            {' '}
            <h3 className="text-lg font-semibold text-[#3A3A3A] border-b border-[#ecd8ab]/30 pb-2">
              Precios y Stock
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Stock Actual
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
              </div>
            </div>{' '}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Stock Mínimo
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A8C61] h-5 w-5" />
                  <Input
                    type="number"
                    min="0"
                    value={formData.stockMinimo}
                    onChange={(e) =>
                      handleChange('stockMinimo', parseInt(e.target.value) || 0)
                    }
                    className="pl-10 border-[#ecd8ab]/50 focus:border-[#CC9F53] focus:ring-[#CC9F53]/20"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gestión de Imágenes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3A3A3A] border-b border-[#ecd8ab]/30 pb-2">
              Gestión de Imágenes
            </h3>
            {/* Imágenes Existentes */}
            {imagenes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-md font-medium text-[#3A3A3A]">
                  Imágenes Actuales
                </h4>{' '}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagenes
                    .filter(
                      (imagen) => imagen && imagen.id && isValidUrl(imagen.url)
                    )
                    .map((imagen) => (                      <div key={imagen.id} className="relative group">                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">                          <Image
                            src={
                              imagen.url
                                ? `${imagen.url}${imagen.url.includes('?') ? '&' : '?'}t=${Date.now()}`
                                : '/images/products/producto_sinimage.svg'
                            }
                            alt={imagen.altText || `Imagen del producto`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                '/images/products/producto_sinimage.svg';
                            }}
                          />
                        </div>{/* Indicador de imagen principal */}
                        {imagen.principal && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                              <CheckCircle className="w-3 h-3" />
                              Principal
                            </span>
                          </div>
                        )}

                        {/* Botón de reemplazo rápido - visible siempre */}
                        <div className="absolute top-3 right-3 z-10">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleReplaceImage(imagen.id);
                            }}
                            disabled={isUploadingImages}
                            className="bg-white/95 hover:bg-white text-gray-700 hover:text-gray-900 text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 transition-all duration-200 hover:shadow-xl"
                            title="Reemplazar imagen"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>                        {/* Controles de imagen */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out rounded-lg flex items-center justify-center gap-2">
                          {!imagen.principal && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSetPrincipal(imagen.id);
                              }}
                              disabled={isUploadingImages}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out"
                              title="Establecer como principal"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditAltText(imagen.id, imagen.altText || '');
                            }}
                            disabled={isUploadingImages}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out"
                            title="Editar texto alternativo"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteImagen(imagen.id);
                            }}
                            disabled={isUploadingImages}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out"
                            title="Eliminar imagen"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>{/* Modal de edición de altText */}
                        {editingImageId === imagen.id && (
                          <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                            <div 
                              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all max-h-[90vh] overflow-hidden"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Header del modal */}
                              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Edit className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                      Editar Texto Alternativo
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      Mejora la accesibilidad y SEO de tu imagen
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEditAltText();
                                  }}
                                  className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200"
                                >
                                  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                </button>
                              </div>
                                {/* Contenido del modal */}
                              <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                                {/* Layout en dos columnas para pantallas grandes */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {/* Preview de la imagen */}
                                  <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-900">
                                      Vista previa de la imagen
                                    </label>                                    <div className="relative group">
                                      <Image
                                        src={`${imagen.url}${imagen.url.includes('?') ? '&' : '?'}t=${Date.now()}`}
                                        alt="Preview"
                                        width={400}
                                        height={256}
                                        className="w-full h-64 object-cover rounded-xl bg-gray-100 border-2 border-gray-200 transition-all duration-200 group-hover:border-blue-300"
                                      />
                                      <div className="absolute top-3 right-3">
                                        <span className="bg-white/95 backdrop-blur-sm text-gray-700 text-xs px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                          Vista previa
                                        </span>
                                      </div>
                                      {imagen.principal && (
                                        <div className="absolute top-3 left-3">
                                          <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                                            <CheckCircle className="w-3 h-3" />
                                            Principal
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Campo de edición */}
                                  <div className="space-y-4">
                                    <div className="space-y-3">
                                      <label className="block text-sm font-semibold text-gray-900">
                                        Descripción de la imagen
                                        <span className="text-red-500 ml-1">*</span>
                                      </label>
                                      <textarea
                                        value={tempAltText}
                                        onChange={(e) => setTempAltText(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none transition-all duration-200 text-sm leading-relaxed placeholder-gray-400"
                                        rows={6}
                                        maxLength={255}
                                        placeholder="Ejemplo: Yogurt natural de fresa en envase de 150ml con trozos de fruta, perfecto para el desayuno saludable..."
                                        autoFocus
                                      />
                                      <div className="flex justify-between items-center text-xs">
                                        <span className={`${tempAltText.length > 200 ? 'text-amber-600' : 'text-gray-500'}`}>
                                          {tempAltText.length}/255 caracteres
                                        </span>
                                        {tempAltText.length >= 50 && tempAltText.length <= 150 && (
                                          <span className="text-green-600 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Longitud ideal
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Consejos de accesibilidad */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                      <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <div className="space-y-2">
                                          <p className="font-medium text-blue-900 text-sm">
                                            💡 Consejos para un buen texto alternativo:
                                          </p>
                                          <ul className="text-xs text-blue-800 space-y-1 leading-relaxed">
                                            <li>• Describe el contenido visual específico del producto</li>
                                            <li>• Incluye características relevantes (sabor, tamaño, uso)</li>
                                            <li>• Mantén entre 50-150 caracteres para mejor accesibilidad</li>
                                            <li>• Evita frases como &ldquo;imagen de&rdquo; o &ldquo;foto de&rdquo;</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Footer con botones */}
                              <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEditAltText();
                                  }}
                                  variant="outline"
                                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveAltText(imagen.id);
                                  }}
                                  disabled={isUploadingImages || !tempAltText.trim()}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isUploadingImages ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Guardando...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Guardar cambios
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {/* Área de subida SIEMPRE visible */}
            <div className="space-y-3">
              <ImageUpload
                onImagesSelected={setNuevasImagenes}
                maxImages={5}
                resetTrigger={resetImageUpload}
                className="w-full"
              />
              {/* Grid de previews y botón solo si hay imágenes seleccionadas */}
              {nuevasImagenes.length > 0 && (
                <>
                  <h4 className="text-md font-medium text-[#3A3A3A]">Agregar Nuevas Imágenes</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {nuevasImagenes.map((img, idx) => (
                      <div key={img.preview} className="relative group flex flex-col items-stretch">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
                          <Image src={img.preview} alt="Preview" width={200} height={200} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNuevasImagenes(prev => prev.filter(i => i.preview !== img.preview))}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10"
                            title="Eliminar imagen"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          className="mt-2 w-full border border-gray-300 rounded px-2 py-1 text-xs"
                          placeholder={`Texto alternativo (accesibilidad) #${idx+1}`}
                          value={altTexts[img.preview] || ''}
                          onChange={e => setAltTexts(prev => ({...prev, [img.preview]: e.target.value}))}
                          maxLength={255}
                          style={{marginTop: 8}}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        {nuevasImagenes.length} nueva{nuevasImagenes.length !== 1 ? 's' : ''} imagen{nuevasImagenes.length !== 1 ? 'es' : ''} seleccionada{nuevasImagenes.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleAgregarNuevasImagenes}
                      disabled={isUploadingImages}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isUploadingImages ? 'Subiendo...' : 'Agregar Ahora'}
                    </Button>
                  </div>
                </>
              )}
              {imagenes.length === 0 && nuevasImagenes.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    💡 La primera imagen que agregues será automáticamente la imagen principal del producto.
                  </p>
                </div>
              )}
            </div>
            {isUploadingImages && (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#CC9F53] mr-3"></div>
                <span className="text-[#9A8C61]">Procesando imágenes...</span>
              </div>
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

          {/* Información adicional */}
          <div className="bg-[#F5E6C6]/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-[#3A3A3A] mb-2">
              Información del Producto
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#9A8C61]">ID:</span>
                <span className="ml-2 text-[#3A3A3A] font-mono">
                  {producto.id}
                </span>
              </div>
              <div>
                <span className="text-[#9A8C61]">Creado:</span>
                <span className="ml-2 text-[#3A3A3A]">
                  {new Date(producto.creadoEn).toLocaleDateString('es-PE')}
                </span>
              </div>
              <div>
                <span className="text-[#9A8C61]">Slug:</span>
                <span className="ml-2 text-[#3A3A3A] font-mono">
                  {producto.slug}
                </span>
              </div>
              <div>
                <span className="text-[#9A8C61]">Actualizado:</span>
                <span className="ml-2 text-[#3A3A3A]">
                  {new Date(producto.actualizadoEn).toLocaleDateString('es-PE')}
                </span>
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
              {isLoading ? 'Actualizando...' : 'Actualizar Producto'}
            </Button>
          </div>
        </form>
      </div>
        {/* Modal de confirmación de eliminación */}
      {deletingImageId && imageToDelete && (
        <div className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Eliminar Imagen
                </h3>
                <p className="text-sm text-gray-600">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
            {/* Imagen centrada y bien proporcionada */}
            <div className="flex flex-col items-center p-6 pt-8 space-y-4">              <div className="w-56 h-56 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <Image
                  src={`${imageToDelete.url}${imageToDelete.url.includes('?') ? '&' : '?'}t=${Date.now()}`}
                  alt={imageToDelete.altText || 'Imagen a eliminar'}
                  width={224}
                  height={224}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/products/producto_sinimage.svg';
                  }}
                />
              </div>
              {imageToDelete.altText && (                <div className="text-xs text-gray-500 italic text-center max-w-xs truncate">
                  &ldquo;{imageToDelete.altText}&rdquo;
                </div>
              )}
              {imageToDelete.principal && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">¡Cuidado! Esta es la imagen principal</span>
                </div>
              )}
              <p className="text-center text-base font-semibold text-gray-900 mt-2">
                ¿Estás seguro de que quieres eliminar esta imagen?
              </p>
            </div>
            {/* Footer con botones */}
            <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              <Button
                onClick={cancelDeleteImagen}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                disabled={isUploadingImages}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={confirmDeleteImagen}
                disabled={isUploadingImages}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white transition-all duration-200 disabled:opacity-50"
              >
                {isUploadingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar imagen
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
        {/* Modal de confirmación de reemplazo de imagen */}
      {replaceModal && (
        <div className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
            <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Reemplazar Imagen</h3>
                <p className="text-sm text-gray-600">Confirma el reemplazo de la imagen</p>
              </div>
            </div>
            <div className="flex flex-col items-center p-6 pt-8 space-y-4">
              <div className="w-56 h-56 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <Image src={replaceModal.preview} alt="Preview nueva imagen" width={224} height={224} className="object-contain w-full h-full" />
              </div>
              <p className="text-center text-base font-semibold text-gray-900 mt-2">
                ¿Deseas reemplazar la imagen seleccionada?
              </p>
            </div>
            <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              <Button onClick={cancelReplaceImage} variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200" disabled={isUploadingImages}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={confirmReplaceImage} disabled={isUploadingImages} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 disabled:opacity-50">
                {isUploadingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Reemplazando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Confirmar reemplazo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductoModal;
