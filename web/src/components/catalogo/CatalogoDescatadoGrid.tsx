import React from 'react';
import CatalogoCard from './CatalogoCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './catalogo-carrusel.css';

interface CatalogoDestacadosGridProps {
  productos: CatalogoCardProduct[];
  onAddToCart?: (product: CatalogoCardProduct) => void;
}

// Definir el tipo que espera CatalogoCard
export type CatalogoCardProduct = {
  id: number | string;
  name: string;
  image: string;
  category: string;
  price?: number;
  priceFormatted?: string;
  shortDescription?: string;
  destacado?: boolean;
  stock?: number;
  stockMinimo?: number;
};

const CatalogoDestacadosGrid: React.FC<CatalogoDestacadosGridProps> = ({
  productos,
  onAddToCart,
}) => {
  if (!productos.length) return null;

  return (
    <section className="py-10 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#2d2418] mb-2">
          Productos Destacados
        </h2>
        <div className="h-1 w-16 mx-auto bg-[#CC9F53] rounded mb-6" />
        <p className="text-center text-[#9B9178] mb-10">
          Descubre nuestra selección de productos artesanales más populares
        </p>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          speed={900}
          autoplay={{ delay: 2400, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          grabCursor={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="!pb-16"
        >
          {productos.map((producto) => (
            <SwiperSlide key={producto.id} className="!h-auto">
              <div className="h-full flex items-stretch">
                <CatalogoCard
                  product={producto}
                  showStar
                  onAddToCart={onAddToCart}
                  onQuickView={() => window.location.assign(`/productos/${producto.id}`)}
                  className="shadow-lg rounded-2xl bg-white w-full min-h-[450px] flex flex-col"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CatalogoDestacadosGrid;