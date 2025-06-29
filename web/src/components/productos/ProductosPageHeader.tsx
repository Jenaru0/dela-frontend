import React from 'react';
import { Grid3X3 } from 'lucide-react';

const ProductosPageHeader: React.FC = () => {
  return (
    <div className="bg-[#F5EFD7]/30 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-[#CC9F53]/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[#CC9F53] font-medium text-xs sm:text-sm mb-3 sm:mb-4">
            <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
            Catálogo Completo
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#3A3A3A] mb-3 sm:mb-4 leading-tight">
            Todos Nuestros Productos
          </h1>
          <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-[#CC9F53] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
            Descubre toda nuestra colección de productos artesanales del valle.
            Calidad premium, sabores auténticos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductosPageHeader;
