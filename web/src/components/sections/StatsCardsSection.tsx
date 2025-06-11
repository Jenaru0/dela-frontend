// web/src/components/sections/StatsCardsSection.tsx
'use client'

import React from 'react'

const stats = [
  { label: 'Años de experiencia',  value: '20+',    icon: '📆' },
  { label: 'Productos lácteos',     value: '20+',    icon: '🥛' },
  { label: 'Animales en finca',     value: '2000+',  icon: '🐄' },
  { label: 'Tiendas activas',       value: '2',      icon: '📍' },
]

export default function StatsCardsSection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#fffce8] via-white to-[#fffbeec0] overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 pointer-events-none opacity-25 -z-10">
        <div className="absolute inset-0 bg-[url('https://dela.com.pe/img/valle_pc.png')] bg-cover bg-center" />
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative group p-8 bg-white/95 rounded-2xl text-center shadow-lg border border-[#E6D5A8]/60 hover:border-[#CC9F53] transition-all duration-300 overflow-hidden hover:scale-[1.025] hover:shadow-2xl flex flex-col items-center"
            >
              {/* Icono decorativo más sobrio */}
              <div className="mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[#fffce8] via-[#fff] to-[#fffbec] shadow border border-[#CC9F53]/10 text-2xl md:text-3xl text-[#CC9F53]">
                {s.icon}
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#3A3A3A] mb-1 tracking-tight font-display">
                {s.value}
              </div>
              <div className="text-base md:text-lg text-[#525252] font-medium tracking-wide mb-2">
                {s.label}
              </div>
              {/* Línea decorativa sutil */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-10 h-0.5 rounded-full bg-[#CC9F53]/20 group-hover:bg-[#CC9F53]/50 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}