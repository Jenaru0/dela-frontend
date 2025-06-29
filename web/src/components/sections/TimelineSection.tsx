// web/src/components/sections/TimelineSection.tsx
'use client'
import React from 'react'

const hits = [
  { year: '1996',  text: 'Comienza la crianza de nuestra primera vaca, llamada DELA.' },
  { year: '2000',  text: 'Lanzamos nuestra primera línea de quesos artesanales.' },
  { year: '2005',  text: 'Adquirimos la primera máquina de ordeño y ampliamos a 200 animales.' },
  { year: '2010',  text: 'Ganamos la medalla “Gran Campeona de la Raza” por la calidad de nuestro ganado.' },
  { year: '2020+', text: 'Crecimos hasta 2 000+ animales y abrimos planta de lácteos bajo el nombre DELA.' },
]

export default function TimelineSection() {
  return (
    <section className="relative py-28 bg-gradient-to-br from-[#f8f5ee] via-white to-[#fffbeec0] overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 pointer-events-none opacity-15 -z-10">
        <div className="absolute inset-0 bg-[url('https://dela.com.pe/img/valle_pc.png')] bg-cover bg-center" />
      </div>
      <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-[#3A3A3A] text-center mb-20 tracking-tight">
        Nuestra <span className="text-[#CC9F53]">Historia</span>
      </h2>      <div className="relative container mx-auto px-4 md:px-8">
        {/* Grid de hitos con cards flotantes y diseño profesional */}
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-x-10 gap-y-24 z-10">
          {/* Línea horizontal conectando los puntos - posicionada exactamente en el centro de los círculos */}
          <div className="hidden md:block absolute top-[10px] left-0 right-0 h-0.5 bg-gradient-to-r from-[#CC9F53]/20 via-[#CC9F53]/80 to-[#CC9F53]/20 rounded-full z-0" style={{transform: 'translateY(-50%)'}} />
          
          {hits.map((h) => (
            <div key={h.year} className="flex flex-col items-center text-center group relative">
              {/* Punto decorativo sin año */}
              <div className="w-5 h-5 bg-[#CC9F53] rounded-full shadow-md flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110" />
              {/* Card flotante profesional */}
              <div className="mt-8 w-full bg-white/95 rounded-xl p-7 shadow-md border border-[#E6D5A8]/30 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 relative z-10 flex flex-col items-center">
                <h3 className="font-display text-xl font-semibold text-[#3A3A3A] mb-2 tracking-tight uppercase letter-spacing-[0.05em]">{h.year}</h3>
                <p className="text-base text-[#525252] leading-relaxed font-normal max-w-[220px]">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}