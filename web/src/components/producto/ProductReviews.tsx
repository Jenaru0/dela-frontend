'use client';

import React from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Resena } from '@/services/resenas.service';

interface ProductReviewsProps {
  resenas: Resena[];
  loading?: boolean;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  resenas,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-48 mx-auto animate-pulse"></div>
        </div>
        
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-6 h-6 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!resenas || resenas.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-500 text-base">
          No hay reseñas disponibles para este producto
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (nombres: string, apellidos: string) => {
    const firstInitial = nombres.charAt(0).toUpperCase();
    const lastInitial = apellidos.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className="space-y-6">
      {/* Header de sección simplificado */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">
          Lo que dicen nuestros clientes
        </h3>
      </div>

      {/* Lista de reseñas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resenas.map((resena) => (
          <div
            key={resena.id}
            className="bg-white rounded-2xl p-6 border-2 border-gray-300 hover:border-[#CC9F53]/50 hover:shadow-lg transition-all duration-300"
          >
            {/* Header de la reseña */}
            <div className="flex items-center space-x-3 mb-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#CC9F53] to-[#B88D42] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {getInitials(
                    resena.usuario.nombres,
                    resena.usuario.apellidos
                  )}
                </span>
              </div>
              
              {/* Info del usuario */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {resena.usuario.nombres}{' '}
                  {resena.usuario.apellidos.charAt(0)}.
                </h4>
                <time className="text-xs text-gray-500">
                  {formatDate(resena.creadoEn)}
                </time>
              </div>
            </div>

            {/* Calificación con estrellas */}
            <div className="mb-4">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < resena.calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Comentario */}
            {resena.comentario && (
              <blockquote className="text-gray-700 leading-relaxed text-sm">
                &ldquo;{resena.comentario}&rdquo;
              </blockquote>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
