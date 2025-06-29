'use client'
import React, { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactoFormSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      })
    }, 2000)
  }

  return (
    <section id="formulario" className="py-16 md:py-24 bg-gradient-to-br from-[#F5EFD7]/30 via-white to-[#F5EFD7]/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3A3A3A] mb-6">
              <span className="text-[#CC9F53]">Envíanos</span> un mensaje
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#CC9F53]/20 p-8 md:p-12">
            {submitStatus === 'success' && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800">¡Mensaje enviado exitosamente!</h4>
                  <p className="text-green-600">Te contactaremos pronto. Gracias por escribirnos.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre y Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-[#3A3A3A] mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC9F53] focus:border-[#CC9F53] transition-colors duration-200"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#3A3A3A] mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC9F53] focus:border-[#CC9F53] transition-colors duration-200"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Teléfono y Asunto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="telefono" className="block text-sm font-semibold text-[#3A3A3A] mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC9F53] focus:border-[#CC9F53] transition-colors duration-200"
                    placeholder="+51 987 654 321"
                  />
                </div>
                <div>
                  <label htmlFor="asunto" className="block text-sm font-semibold text-[#3A3A3A] mb-2">
                    Asunto *
                  </label>
                  <select
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC9F53] focus:border-[#CC9F53] transition-colors duration-200"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="consulta-productos">Consulta sobre productos</option>
                    <option value="pedido">Información sobre pedidos</option>
                    <option value="distribucion">Distribución y envíos</option>
                    <option value="colaboracion">Oportunidades de colaboración</option>
                    <option value="sugerencia">Sugerencias y comentarios</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-[#3A3A3A] mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CC9F53] focus:border-[#CC9F53] transition-colors duration-200 resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 bg-[#CC9F53] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#B8934A] transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <AlertCircle className="w-5 h-5 text-[#CC9F53] flex-shrink-0 mt-0.5" />
                <p>
                  Al enviar este formulario, aceptas que DELA procese tus datos para responder a tu consulta. 
                  Puedes consultar nuestra política de privacidad para más información.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
