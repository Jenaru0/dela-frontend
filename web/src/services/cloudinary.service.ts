interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;  bytes: number;
}

export class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

    if (!this.cloudName || !this.uploadPreset) {
      console.warn('⚠️ Cloudinary no está configurado correctamente. Verifica las variables de entorno.');
    }
  }

  /**
   * Sube una imagen a Cloudinary
   */
  async uploadImage(file: File): Promise<CloudinaryUploadResponse> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary no está configurado. Verifica las variables de entorno.');
    }

    // Validar el archivo
    this.validateFile(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'dela-productos'); // Organizar imágenes en una carpeta

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al subir imagen a Cloudinary');
      }

      const result: CloudinaryUploadResponse = await response.json();
      
      console.log('✅ Imagen subida exitosamente a Cloudinary:', {
        url: result.secure_url,
        publicId: result.public_id,
        size: this.formatFileSize(result.bytes)
      });

      return result;
    } catch (error) {
      console.error('❌ Error al subir imagen a Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Sube múltiples imágenes en paralelo
   */
  async uploadMultipleImages(files: File[]): Promise<CloudinaryUploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    
    try {
      const results = await Promise.all(uploadPromises);
      console.log(`✅ ${results.length} imágenes subidas exitosamente`);
      return results;
    } catch (error) {
      console.error('❌ Error al subir múltiples imágenes:', error);
      throw error;
    }
  }  /**
   * Elimina una imagen de Cloudinary (requiere backend)
   */
  async deleteImage(publicId: string): Promise<void> {
    // Nota: Para eliminar imágenes se necesita el API Secret, 
    // por lo que esto debería hacerse desde el backend
    console.warn('⚠️ La eliminación de imágenes debe implementarse en el backend por seguridad', { publicId });
  }

  /**
   * Genera una URL de imagen transformada
   */
  getTransformedImageUrl(publicId: string, transformations: string): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformations}/${publicId}`;
  }

  /**
   * Obtiene diferentes tamaños de una imagen
   */
  getImageVariants(url: string) {
    const publicId = this.extractPublicIdFromUrl(url);
    
    return {
      thumbnail: this.getTransformedImageUrl(publicId, 'w_150,h_150,c_fill'),
      small: this.getTransformedImageUrl(publicId, 'w_300,h_300,c_fill'),
      medium: this.getTransformedImageUrl(publicId, 'w_600,h_600,c_fill'),
      large: this.getTransformedImageUrl(publicId, 'w_1200,h_1200,c_fill'),
      original: url
    };
  }

  /**
   * Valida que el archivo sea una imagen válida
   */
  private validateFile(file: File): void {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, GIF, WebP');
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo permitido: 10MB');
    }

    // Validar que no esté vacío
    if (file.size === 0) {
      throw new Error('El archivo está vacío');
    }
  }

  /**
   * Extrae el public_id de una URL de Cloudinary
   */
  private extractPublicIdFromUrl(url: string): string {
    const match = url.match(/\/v\d+\/(.+)\./);
    return match ? match[1] : '';
  }

  /**
   * Formatea el tamaño del archivo
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Verifica si Cloudinary está configurado
   */
  isConfigured(): boolean {
    return !!(this.cloudName && this.uploadPreset);
  }

  /**
   * Obtiene la configuración actual
   */
  getConfig() {
    return {
      cloudName: this.cloudName,
      uploadPreset: this.uploadPreset,
      isConfigured: this.isConfigured()
    };
  }
}

export const cloudinaryService = new CloudinaryService();
