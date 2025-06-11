// web/src/components/sections/NuestraHistoriaSection.tsx
'use client'
import React from 'react'
import Image from 'next/image'

export default function NuestraHistoriaSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-[#F5EFD7] via-white to-[#F5EFD7]/50">
      {/* Fondo realista visible */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://dela.com.pe/img/valle_pc.png')] bg-cover bg-center" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 h-full flex items-center">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center w-full py-16 md:py-24">
          {/* TEXTO */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="text-[#CC9F53]">Nuestro</span>{' '}
              <span className="text-[#3A3A3A]">Historia</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
               En DELA nuestra misión es llevar a tu mesa el auténtico sabor del valle, combinado con innovación
                artesanal. Cada lote refleja el compromiso con nuestros clientes, desde la granja hasta tu hogar. 
            </p>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
               Creemos firmemente en la <span className="text-[#CC9F53] font-semibold">responsabilidad</span> social 
               y la <span className="text-[#CC9F53] font-semibold">transparencia</span> en cada etapa: desde el 
               cuidado de nuestras vacas hasta el etiquetado claro de cada producto. Así construimos confianza con nuestra comunidad.
            </p>
          </div>

          {/* LOGO DE DELEITES DEL VALLE: GRANDE, centrado, con hover y sin productos flotantes */}
          <div className="flex items-center justify-center lg:justify-end w-full">
            <div className="relative h-[420px] w-[420px] md:h-[540px] md:w-[540px] lg:h-[650px] lg:w-[650px] group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#CC9F53]/20 to-[#F5EFD7]/20 animate-pulse" />
              <Image
                src="/images/logo-recurso-1.svg"
                alt="Deleites del Valle — Fundado 2000"
                fill
                className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
                priority
              />
              {/* Sutiles destellos decorativos */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#CC9F53]/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-8 right-1/2 translate-x-1/2 w-16 h-16 bg-[#CC9F53]/10 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Degradado inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}