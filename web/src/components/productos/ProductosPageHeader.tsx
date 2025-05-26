import React from 'react';
import { Grid3X3 } from 'lucide-react';

const ProductosPageHeader: React.FC = () => {
  return (
    <div className="bg-[#F5EFD7]/30 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-[#CC9F53]/10 px-4 py-2 rounded-full text-[#CC9F53] font-medium text-sm mb-4">
            <Grid3X3 className="h-4 w-4" />
            Catálogo Completo
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3A3A3A] mb-4">
            Todos Nuestros Productos
          </h1>
          <div className="w-20 h-1 bg-[#CC9F53] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre toda nuestra colección de productos artesanales del valle.
            Calidad premium, sabores auténticos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductosPageHeader;
