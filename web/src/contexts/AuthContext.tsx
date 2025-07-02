'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { AuthState, UsuarioResponse, InicioSesionDto, RegistroDto } from '@/types/auth';
import { authService } from '@/services/auth.service';

// Acciones del reducer
type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { usuario: UsuarioResponse; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { usuario: UsuarioResponse } }
  | { type: 'REGISTER_FAILURE' }
  | { type: 'SET_USER'; payload: { usuario: UsuarioResponse; token: string } }
  | { type: 'UPDATE_USER'; payload: { usuario: UsuarioResponse } };

// Estado inicial
const initialState: AuthState = {
  usuario: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Iniciar como true para evitar mostrar UI de no autenticado mientras se verifica
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        usuario: action.payload.usuario,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        usuario: action.payload.usuario,
        isLoading: false,
      };
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
      };
      case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false, // Asegurar que no esté cargando después del logout
      };
      case 'SET_USER':
      return {
        ...state,
        usuario: action.payload.usuario,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        usuario: action.payload.usuario,
      };
    
    default:
      return state;
  }
}

// Contexto
interface AuthContextType extends AuthState {
  iniciarSesion: (datos: InicioSesionDto) => Promise<void>;
  registrar: (datos: RegistroDto) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  actualizarUsuario: (usuario: UsuarioResponse) => void;
  renovarToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Manejar la hidratación
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Verificar si hay usuario logueado al cargar la aplicación
  useEffect(() => {
    if (!isHydrated) return;

    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const usuario = authService.getCurrentUser();
        
        if (token && usuario) {
          // Intentar verificar si el token es válido, pero ser tolerante a errores de red
          try {
            const isValidToken = await authService.verifyToken();
            if (isValidToken) {
              // Token válido, establecer sesión
              dispatch({
                type: 'SET_USER',
                payload: { usuario, token }
              });
            } else {
              // Token definitivamente inválido (401 del backend)
              console.log('Token inválido en inicialización, intentando renovar...');
              try {
                await authService.renovarToken();
                const updatedToken = authService.getToken();
                dispatch({
                  type: 'SET_USER',
                  payload: { usuario, token: updatedToken || token }
                });
              } catch (renewError) {
                // Si no se puede renovar, limpiar sesión completamente
                console.log('No se pudo renovar token en inicialización:', renewError);
                authService.clearAuth();
                dispatch({ type: 'LOGIN_FAILURE' });
              }
            }
          } catch (verifyError) {
            // Error de red u otro error del servidor
            console.log('Error al verificar token (posible error de red):', verifyError);
            
            const errorMessage = verifyError instanceof Error ? verifyError.message : String(verifyError);
            
            // Si es un error específico que indica token inválido, limpiar sesión
            if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
              console.log('Token definitivamente inválido, limpiando sesión');
              authService.clearAuth();
              dispatch({ type: 'LOGIN_FAILURE' });
            } else {
              // Para otros errores (red, servidor caído), mantener sesión temporal
              console.log('Error de red/servidor detectado. Manteniendo sesión temporal y estableciendo modo offline');
              dispatch({
                type: 'SET_USER',
                payload: { usuario, token }
              });
              
              // Programar un reintento después de un tiempo
              setTimeout(async () => {
                try {
                  console.log('Reintentando verificación de token después de error de red...');
                  const isValidToken = await authService.verifyToken();
                  if (!isValidToken) {
                    console.log('Token inválido en reintento, cerrando sesión');
                    authService.clearAuth();
                    dispatch({ type: 'LOGOUT' });
                  } else {
                    console.log('Token válido en reintento, sesión mantiene');
                  }
                } catch {
                  console.log('Error en reintento de verificación, manteniendo sesión temporal');
                }
              }, 5000); // Reintentar después de 5 segundos
            }
          }
        } else {
          // No hay sesión guardada, terminar carga
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        // En caso de error, limpiar datos y terminar carga
        authService.clearAuth();
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    // Escuchar cambios en localStorage para sincronizar entre pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'usuario') {
        if (!e.newValue) {
          // Token o usuario fue eliminado en otra pestaña
          dispatch({ type: 'LOGOUT' });
        } else if (e.key === 'token' && e.newValue) {
          // Token fue actualizado en otra pestaña
          const usuario = authService.getCurrentUser();
          if (usuario) {
            dispatch({
              type: 'SET_USER',
              payload: { usuario, token: e.newValue }
            });
          }
        }
      }
    };

    // Escuchar eventos de sesión expirada
    const handleSessionExpired = () => {
      console.log('Sesión expirada detectada, cerrando sesión...');
      authService.clearAuth();
      dispatch({ type: 'LOGOUT' });
    };

    initializeAuth();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [isHydrated]);

  const iniciarSesion = async (datos: InicioSesionDto) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const respuesta = await authService.iniciarSesion(datos);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          usuario: respuesta.usuario,
          token: respuesta.token_acceso
        }
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const registrar = async (datos: RegistroDto) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      
      const respuesta = await authService.registrar(datos);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          usuario: respuesta.usuario
        }
      });
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE' });
      throw error;
    }
  };
  const cerrarSesion = async () => {
    try {
      await authService.cerrarSesion();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      // Incluso si hay error, cerramos sesión localmente
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };
  const actualizarUsuario = (usuario: UsuarioResponse) => {
    // Actualizar en localStorage también
    if (typeof window !== 'undefined') {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
    dispatch({ type: 'UPDATE_USER', payload: { usuario } });
  };

  const renovarToken = async () => {
    try {
      const respuesta = await authService.renovarToken();
      
      dispatch({
        type: 'SET_USER',
        payload: {
          usuario: state.usuario!,
          token: respuesta.token_acceso
        }
      });
    } catch (error) {
      // Si no se puede renovar, cerrar sesión
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    iniciarSesion,
    registrar,
    cerrarSesion,
    actualizarUsuario,
    renovarToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
