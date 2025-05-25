"use client";

import React, { useState, useEffect } from "react";
import TestimonialCard from "@/components/common/TestimonialCard";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar?: string;
  title?: string;
  location?: string;
  productPurchased?: string;
  date?: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
  showNavigation?: boolean;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "María González",
    text: "Los productos de DELA son simplemente excepcionales. El sabor auténtico me transporta a mi infancia. La miel de eucalipto es mi favorita, tiene un sabor único que no he encontrado en ningún otro lugar.",
    rating: 5,
    avatar: "/images/avatars/maria.jpg",
    title: "Cliente Premium",
    location: "Madrid, España",
    productPurchased: "Miel de Eucalipto Premium",
    date: "2024-03-15",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    text: "La calidad es incomparable. Cada producto refleja el cuidado y la pasión con la que están elaborados. He probado las mermeladas y conservas, y todas superan mis expectativas.",
    rating: 5,
    avatar: "/images/avatars/carlos.jpg",
    title: "Chef Profesional",
    location: "Barcelona, España",
    productPurchased: "Mermelada de Fresa Casera",
    date: "2024-03-10",
  },
  {
    id: "3",
    name: "Laura Martínez",
    text: "He probado muchos productos artesanales, pero los de DELA están en otro nivel. La atención al cliente es excelente y los productos llegan siempre frescos y bien empaquetados.",
    rating: 4,
    avatar: "/images/avatars/laura.jpg",
    title: "Bloguera Gastronómica",
    location: "Valencia, España",
    productPurchased: "Queso de Cabra Curado",
    date: "2024-03-05",
  },
  {
    id: "4",
    name: "José Antonio López",
    text: "Como dueño de un restaurante, valoro mucho la consistencia en la calidad. DELA nunca me ha decepcionado. Sus productos han elevado significativamente el nivel de mis platos.",
    rating: 5,
    avatar: "/images/avatars/jose.jpg",
    title: "Propietario de Restaurante",
    location: "Sevilla, España",
    productPurchased: "Conservas Variadas",
    date: "2024-02-28",
  },
  {
    id: "5",
    name: "Ana Fernández",
    text: "Descubrí DELA a través de una recomendación y ahora soy clienta habitual. Los embutidos artesanales son increíbles, se nota que están hechos con técnicas tradicionales.",
    rating: 5,
    avatar: "/images/avatars/ana.jpg",
    title: "Nutricionista",
    location: "Bilbao, España",
    productPurchased: "Embutidos Artesanales",
    date: "2024-02-20",
  },
  {
    id: "6",
    name: "Roberto Silva",
    text: "La experiencia de compra es fantástica desde el primer momento. Los productos llegan rápido y en perfecto estado. La relación calidad-precio es excelente.",
    rating: 4,
    avatar: "/images/avatars/roberto.jpg",
    title: "Empresario",
    location: "Zaragoza, España",
    productPurchased: "Pack Degustación",
    date: "2024-02-15",
  },
];

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = defaultTestimonials,
  title = "Lo que dicen nuestros clientes",
  subtitle = "Miles de clientes satisfechos avalan la calidad de nuestros productos artesanales",
  autoplay = true,
  showNavigation = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate items per view based on screen size
  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 3;
  };

  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  // Auto-scroll functionality
  useEffect(() => {
    if (autoplay && !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoplay, isHovered, maxIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#F5EFD7]/20 to-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#CC9F53]/10 px-4 py-2 rounded-full text-[#CC9F53] font-medium text-sm mb-4">
            <MessageCircle className="h-4 w-4" />
            Testimonios
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3A3A3A] mb-4">
            {title}
          </h2>

          <div className="w-20 h-1 bg-[#CC9F53] mx-auto mb-6"></div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView)
                }%)`,
                width: `${(testimonials.length / itemsPerView) * 100}%`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="px-3"
                  style={{ width: `${100 / testimonials.length}%` }}
                >
                  {" "}
                  <TestimonialCard
                    testimonial={{
                      name: testimonial.name,
                      text: testimonial.text,
                      rating: testimonial.rating,
                      avatar: testimonial.avatar,
                      title: testimonial.title,
                      location: testimonial.location,
                    }}
                    showAvatar={true}
                    showLocation={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {showNavigation && testimonials.length > itemsPerView && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white shadow-lg"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white shadow-lg"
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {testimonials.length > itemsPerView && (
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-[#CC9F53] scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              4.8/5
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Valoración Media
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              {testimonials.length * 100}+
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Reseñas Positivas
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              10k+
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Clientes Satisfechos
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CC9F53] mb-2">
              95%
            </div>
            <div className="text-sm md:text-base text-gray-600">
              Recompran Nuestros Productos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
