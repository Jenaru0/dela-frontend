'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: {
    id?: string;
    name?: string;
    nombre?: string;
    text?: string;
    texto?: string;
    rating?: number;
    calificacion?: number;
    avatar?: string;
    title?: string;
    location?: string;
    productPurchased?: string;
    date?: string;
  };
  className?: string;
  showAvatar?: boolean;
  showLocation?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  className,
  showAvatar = true,
  showLocation = true,
}) => {
  // Handle both interface formats: nombre/texto/calificacion (Spanish) and name/text/rating (English)
  const name = testimonial.name || testimonial.nombre || 'Cliente';
  const text = testimonial.text || testimonial.texto || '';
  const rating = testimonial.rating || testimonial.calificacion || 0;
  return (
    <Card
      className={`group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${className}`}
    >
      <CardContent className="p-6">
        {/* Rating stars */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 transition-all duration-200 ${
                i < rating
                  ? 'fill-[#CC9F53] text-[#CC9F53] group-hover:scale-110'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>{' '}
        {/* Quote */}
        <blockquote className="text-gray-600 mb-4 relative">
          <span className="text-4xl text-[#CC9F53]/20 absolute -top-2 -left-1 font-serif">
            &ldquo;
          </span>
          <p className="relative z-10 italic leading-relaxed">{text}</p>
          <span className="text-4xl text-[#CC9F53]/20 absolute -bottom-6 right-0 font-serif">
            &rdquo;
          </span>
        </blockquote>
        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#F5EFD7]">
          {showAvatar && (
            <>
              {testimonial.avatar ? (
                <Image
                  src={testimonial.avatar}
                  alt={name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="h-10 w-10 rounded-full bg-gradient-to-br from-[#CC9F53] to-[#B88D42] flex items-center justify-center text-white font-semibold"
                style={testimonial.avatar ? { display: 'none' } : {}}
              >
                {name.charAt(0)}
              </div>
            </>
          )}
          <div>
            <p className="font-semibold text-[#3A3A3A] group-hover:text-[#CC9F53] transition-colors">
              {name}
            </p>
            <p className="text-xs text-gray-500">
              {testimonial.title || 'Cliente verificado'}
            </p>
            {showLocation && testimonial.location && (
              <p className="text-xs text-gray-400">{testimonial.location}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
