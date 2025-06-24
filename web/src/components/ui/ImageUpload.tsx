'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

// Nuevo tipo para preview local
interface LocalImagePreview {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploadProps {
  onImagesSelected: (images: LocalImagePreview[]) => void; // Cambiado
  maxImages?: number;
  className?: string;
  resetTrigger?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesSelected,
  maxImages = 5,
  className = '',
  resetTrigger = 0
}) => {  const [images, setImages] = useState<LocalImagePreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<LocalImagePreview[]>([]);

  // Mantener la referencia actualizada
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Limpiar previews al resetear
  useEffect(() => {
    if (resetTrigger > 0) {
      imagesRef.current.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      setIsDragOver(false);
    }
  }, [resetTrigger]);

  // Notificar al padre cuando cambian las imágenes
  useEffect(() => {
    onImagesSelected(images);
  }, [images, onImagesSelected]);

  const handleFileSelect = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    if (images.length + fileArray.length > maxImages) {
      alert(`Solo puedes seleccionar máximo ${maxImages} imágenes`);
      return;
    }
    const timestamp = Date.now();
    const newImages: LocalImagePreview[] = fileArray.map((file, idx) => ({
      id: `local-${timestamp}-${idx}`,
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  }, [images, maxImages]);

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === imageId);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== imageId);
    });
  }, []);

  const openFileDialog = () => fileInputRef.current?.click();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zona de subida */}
      <div
        onDrop={e => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length) handleFileSelect(e.dataTransfer.files); }}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={e => { e.preventDefault(); setIsDragOver(false); }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${isDragOver ? 'border-[#CC9F53] bg-[#F5E6C6]/30 scale-[1.02]' : 'border-[#ecd8ab]/50 hover:border-[#CC9F53] hover:bg-[#F5E6C6]/10'}`}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className={`p-3 rounded-full ${isDragOver ? 'bg-[#CC9F53]' : 'bg-[#F5E6C6]'} transition-colors`}>
            <Upload className={`h-8 w-8 ${isDragOver ? 'text-white' : 'text-[#CC9F53]'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#3A3A3A] mb-1">
              {isDragOver ? '¡Suelta aquí!' : 'Seleccionar imágenes'}
            </h3>
            <p className="text-sm text-[#9A8C61] mb-2">
              {isDragOver ? 'Suelta las imágenes para agregarlas al preview' : 'Arrastra y suelta aquí, o haz clic para seleccionar'}
            </p>
          </div>
          
          <div className="bg-[#F5E6C6]/50 rounded-lg px-4 py-2">
            <p className="text-xs text-[#9A8C61]">
              <span className="font-medium">Formatos:</span> PNG, JPG, GIF, WebP
            </p>
            <p className="text-xs text-[#9A8C61]">
              <span className="font-medium">Máximo:</span> {maxImages} imágenes • 10MB cada una
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={e => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />      {/* Preview de imágenes */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#3A3A3A]">
            Imágenes seleccionadas ({images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={image.preview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Botón de eliminar - siempre visible */}
                <Button
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 h-7 w-7 p-0 rounded-full bg-red-500 text-white border-2 border-white hover:bg-red-600 shadow-lg"
                  title="Eliminar imagen"
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Nombre del archivo */}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded truncate max-w-[80%]">
                  {image.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
