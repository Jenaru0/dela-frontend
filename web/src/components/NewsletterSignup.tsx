"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-md">
      {isSubmitted ? (
        <div className="rounded-lg bg-green-50 p-4 text-green-800">
          <p className="text-center font-medium">
            ¡Gracias por suscribirte! Pronto recibirás nuestras novedades.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-md border border-[#CC9F53]/30 bg-white px-3 py-2 text-sm focus:border-[#CC9F53] focus:outline-none focus:ring-1 focus:ring-[#CC9F53]"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-[#CC9F53] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B88D42] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      )}
    </div>
  );
}
