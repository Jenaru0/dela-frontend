import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import '../styles/admin-sidebar.css';
import { CartProvider } from '@/contexts/CarContext';
import { CartDrawerProvider } from '@/contexts/CartDrawerContext';
import ShoppingCartDrawer from '@/components/carrito/ShoppingCartDrawer';
import { FavoritoProvider } from '@/contexts/FavoritoContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import AuthModalMount from '@/components/auth/AuthModalMount';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DELA - Deleites del Valle | Lácteos Artesanales desde 2000',
  description:
    'Productos lácteos artesanales de la más alta calidad desde Cerro Azul, Cañete. Leche fresca, yogures, quesos y helados elaborados con tradición familiar peruana.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  return (
    <html lang="es">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <AuthModalProvider>
            <CartProvider>
              <FavoritoProvider>
                <CartDrawerProvider>
                  <ShoppingCartDrawer />
                  <main id="main-content">{children}</main>
                  <AuthModalMount/>
                </CartDrawerProvider>
              </FavoritoProvider>
            </CartProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
