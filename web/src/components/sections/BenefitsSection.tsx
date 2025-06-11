// web/src/components/sections/BenefitsSection.tsx
'use client'
import React from 'react'
import { Truck, Headphones, RefreshCcw } from 'lucide-react'

const benefits = [
  { icon: <Truck size={24} />, title: 'Envío exprés a tu puerta', desc: 'Entrega directo a tu puerta' },
  { icon: <Headphones size={24} />, title: 'Soporte 24/7',             desc: 'Siempre a tu disposición' },
  { icon: <RefreshCcw size={24} />, title: 'Garantia de devolución',          desc: 'Siempre escuchando a los clientes' },
]

export default function BenefitsSection() {
  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 pointer-events-none opacity-10 -z-10">
        <div className="absolute inset-0 bg-[url('https://dela.com.pe/img/valle_pc.png')] bg-cover bg-center" />
      </div>
      <div className="container mx-auto flex flex-col md:flex-row gap-6 px-4">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="flex-1 p-7 bg-white rounded-2xl shadow-md border border-[#E6D5A8]/40 text-center flex flex-col items-center transition-all duration-300 group hover:scale-[1.025] hover:shadow-lg hover:border-[#CC9F53] relative overflow-hidden"
          >
            {/* Icono sobrio con fondo dorado suave */}
            <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-[#F5EFD7] border border-[#CC9F53]/20 text-[#CC9F53] text-2xl group-hover:bg-[#fffce8] transition-all duration-300">
              {b.icon}
            </div>
            <h4 className="font-display text-lg font-semibold text-[#3A3A3A] mb-1 tracking-tight group-hover:text-[#CC9F53] transition-colors duration-300">
              {b.title}
            </h4>
            <p className="text-sm text-[#525252] font-medium mb-1">
              {b.desc}
            </p>
            {/* Línea decorativa sutil */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-8 h-0.5 rounded-full bg-[#CC9F53]/15 group-hover:bg-[#CC9F53]/40 transition-all duration-300" />
          </div>
        ))}
      </div>
    </section>
  )
}