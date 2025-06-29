interface NewsletterResponse {
  mensaje: string;
  data: unknown;
}

interface SuscribirNewsletterDto {
  email: string;
}

class NewsletterService {
  private readonly baseUrl: string;
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  async suscribir(email: string): Promise<NewsletterResponse> {
    const response = await fetch(`${this.baseUrl}/newsletter/suscribir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email } as SuscribirNewsletterDto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || 'Error al suscribirse al newsletter');
    }

    return response.json();
  }

  async desuscribir(email: string): Promise<NewsletterResponse> {
    const response = await fetch(`${this.baseUrl}/newsletter/desuscribir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || 'Error al desuscribirse del newsletter');
    }

    return response.json();
  }
}

export const newsletterService = new NewsletterService();
