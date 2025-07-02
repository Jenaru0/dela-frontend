export interface DireccionCliente {
  id: number;
  usuarioId: number;
  alias?: string;
  
  // Dirección completa
  direccion: string;
  numeroExterior?: string;
  numeroInterior?: string;
  referencia?: string;
  
  // UBIGEO - Sistema oficial peruano
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeoId?: string;
  codigoPostal?: string;
  
  // Coordenadas geográficas
  latitud?: number;
  longitud?: number;
  
  // Validación y cobertura
  validadaGps?: boolean;
  enZonaCobertura?: boolean;
  
  // Configuración
  predeterminada: boolean;
  activa: boolean;
  
  // Metadatos para MapTiler
  mapTilerPlaceId?: string;
  
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface DireccionClienteConUsuario extends DireccionCliente {
  usuario: {
    id: number;
    nombres?: string;
    apellidos?: string;
    email: string;
  };
}

export interface CreateDireccionDto {
  alias?: string;
  direccion: string;
  numeroExterior?: string;
  numeroInterior?: string;
  referencia?: string;
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeoId?: string;
  codigoPostal?: string;
  latitud?: number;
  longitud?: number;
  validadaGps?: boolean;
  mapTilerPlaceId?: string;
  predeterminada?: boolean;
}

export interface UpdateDireccionDto {
  alias?: string;
  direccion?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  referencia?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  ubigeoId?: string;
  codigoPostal?: string;
  latitud?: number;
  longitud?: number;
  validadaGps?: boolean;
  mapTilerPlaceId?: string;
  predeterminada?: boolean;
}

// Nuevos tipos para el sistema de geocodificación
export interface DireccionValidada {
  direccionCompleta: string;
  departamento: string;
  provincia: string;
  distrito: string;
  codigoPostal?: string; // Agregamos código postal opcional
  latitud: number;
  longitud: number;
  esValida: boolean;
  mapTilerPlaceId: string;
  confianza: number; // 0-1
}

export interface ResultadoBusqueda {
  direcciones: DireccionValidada[];
  query: string;
  total: number;
}

export interface VerificacionCobertura {
  tieneCobertura: boolean;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
  mensaje: string;
}

export interface ApiResponse<T> {
  mensaje: string;
  data: T;
}
