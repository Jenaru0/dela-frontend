'use client'
import React from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

export default function ContactoInfoSection() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Dirección",
      details: [
        "DELA Corp SAC",
        "Cerro Azul, Cañete - Lima, Perú"
      ],
      action: "Ver en Google Maps",
      link: "https://www.google.com/maps/search/DELA+Corp+SAC+Cerro+Azul+Cañete+Lima+Perú"
    },
    {
      icon: Phone,
      title: "Teléfono",
      details: [
        "+51 1 234-5678",
        "+51 987 654 321"
      ],
      action: "Llamar ahora",
      link: "tel:+51123456789"
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "contacto@dela.com.pe",
        "ventas@dela.com.pe"
      ],
      action: "Enviar email",
      link: "mailto:contacto@dela.com.pe"
    },
    {
      icon: Clock,
      title: "Horarios",
      details: [
        "Lun - Vie: 8:00 - 18:00",
        "Sáb: 9:00 - 15:00"
      ],
      action: "Ver horarios completos",
      link: "#"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3A3A3A] mb-6">
            <span className="text-[#CC9F53]">Múltiples</span> formas de contactarnos
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Elige la forma que más te convenga para comunicarte con nosotros. 
            Estamos disponibles por múltiples canales para brindarte la mejor atención.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-[#F5EFD7]/50 to-white p-8 rounded-2xl border border-[#CC9F53]/20 hover:border-[#CC9F53]/40 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#CC9F53] to-[#B8934A] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <info.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[#3A3A3A] mb-4">{info.title}</h3>
              
              <div className="space-y-2 mb-6">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600">
                    {detail}
                  </p>
                ))}
              </div>

              {/* Action Link */}
              <a 
                href={info.link}
                target={info.link.includes('google.com/maps') ? '_blank' : '_self'}
                rel={info.link.includes('google.com/maps') ? 'noopener noreferrer' : ''}
                className="inline-flex items-center text-[#CC9F53] font-semibold hover:text-[#B8934A] transition-colors duration-200 group-hover:underline"
              >
                {info.action}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#CC9F53]/10 to-[#F5EFD7]/30 rounded-2xl p-8 md:p-12 border border-[#CC9F53]/20">
            <MessageCircle className="w-16 h-16 text-[#CC9F53] mx-auto mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold text-[#3A3A3A] mb-4">
              ¿Necesitas ayuda inmediata?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Chatea con nosotros por WhatsApp para recibir atención personalizada 
              y respuestas rápidas a tus consultas.
            </p>
            <a 
              href="https://wa.me/51987654321?text=Hola,%20tengo%20una%20consulta%20sobre%20los%20productos%20DELA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
              Chatear por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
