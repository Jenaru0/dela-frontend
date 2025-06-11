'use client'
import React from 'react'
import { Mail, MessageSquare } from 'lucide-react'

export default function ContactoHeroSection() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-[#F5EFD7] via-white to-[#F5EFD7]/50">
      {/* Fondo realista visible */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://dela.com.pe/img/valle_pc.png')] bg-cover bg-center" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 h-full flex items-center">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center w-full py-16 md:py-24">
          {/* TEXTO */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="text-[#CC9F53]">Contáctanos</span>{' '}
              <span className="text-[#3A3A3A]">Hoy</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              ¿Tienes alguna pregunta sobre nuestros productos? ¿Necesitas ayuda con tu pedido? 
              ¡Estamos aquí para ayudarte!
            </p>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              Nuestro equipo está comprometido con brindar la mejor 
              <span className="text-[#CC9F53] font-semibold"> atención al cliente</span> y 
              <span className="text-[#CC9F53] font-semibold"> respuesta rápida</span> a todas tus consultas.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#formulario"
                className="inline-flex items-center gap-3 bg-[#CC9F53] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#B8934A] transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <MessageSquare className="w-6 h-6" />
                Enviar Mensaje
              </a>
            </div>
          </div>

          {/* ICONO DECORATIVO */}
          <div className="flex items-center justify-center lg:justify-end w-full">
            <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px] group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#CC9F53]/20 to-[#F5EFD7]/20 animate-pulse" />
              
              {/* Icono de contacto grande */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative p-16 bg-gradient-to-br from-[#CC9F53] to-[#B8934A] rounded-full shadow-2xl transition-transform duration-700 group-hover:scale-110">
                  <Mail className="w-32 h-32 text-white" />
                  
                  {/* Elementos decorativos flotantes */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#F5EFD7] rounded-full animate-bounce" />
                  <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-white rounded-full animate-pulse" />
                  <div className="absolute top-8 -left-8 w-4 h-4 bg-[#CC9F53]/60 rounded-full animate-ping" />
                </div>
              </div>
              
              {/* Sutiles destellos decorativos */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#CC9F53]/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-8 right-1/2 translate-x-1/2 w-16 h-16 bg-[#CC9F53]/10 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
