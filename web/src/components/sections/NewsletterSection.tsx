"use client";

import React from "react";
import NewsletterSignup from "@/components/NewsletterSignup";

const NewsletterSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-[#F5EFD7]/30 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#CC9F53]/10 via-[#F5EFD7]/20 to-[#CC9F53]/5 p-8 md:p-12">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#CC9F53] rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F5EFD7] rounded-full blur-2xl transform -translate-x-24 translate-y-24"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="space-y-4 mb-8">
              <div className="inline-flex items-center rounded-full bg-[#CC9F53]/20 px-4 py-2 text-sm font-medium text-[#CC9F53]">
                📧 Newsletter
              </div>
              <h2 className="text-3xl font-bold text-[#3A3A3A] md:text-4xl leading-tight">
                Únete a nuestra
                <span className="text-[#CC9F53]"> comunidad</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
                Suscríbete para recibir noticias, ofertas exclusivas y ser el
                primero en conocer nuestros nuevos productos artesanales.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="flex items-center justify-center gap-2 text-[#CC9F53]">
                <span className="text-lg">🎁</span>
                <span>Ofertas exclusivas</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#CC9F53]">
                <span className="text-lg">📦</span>
                <span>Nuevos productos</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#CC9F53]">
                <span className="text-lg">📰</span>
                <span>Noticias del valle</span>
              </div>
            </div>

            <NewsletterSignup />

            <p className="mt-4 text-xs text-gray-500">
              No enviamos spam. Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
