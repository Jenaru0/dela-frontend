import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import '../styles/admin-sidebar.css';
import { CartProvider } from '@/contexts/CarContext';
import { CartDrawerProvider } from '@/contexts/CartDrawerContext';
import ShoppingCartDrawer from '@/components/carrito/ShoppingCartDrawer';
import { FavoritoProvider } from '@/contexts/FavoritoContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import AuthModalMount from '@/components/auth/AuthModalMount';
import TokenInterceptor from '@/components/auth/TokenInterceptor';
import ScrollToTopWrapper from '@/components/common/ScrollToTopWrapper';
import { SessionExpiredNotification } from '@/components/common/SessionExpiredNotification';
import { ScrollToTopOnRouteChange } from '@/components/common/ScrollToTopOnRouteChange';

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
      >        <AuthProvider>
          <TokenInterceptor />
          <AuthModalProvider>
            <CartProvider>
              <FavoritoProvider>
                <CartDrawerProvider>
                  <ScrollToTopWrapper>
                    <ShoppingCartDrawer />
                    <main id="main-content">{children}</main>
                    <AuthModalMount/>
                    <SessionExpiredNotification />
                    <ScrollToTopOnRouteChange />
                    <Toaster 
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#363636',
                          color: '#fff',
                        },
                        success: {
                          duration: 3000,
                          iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                          },
                        },
                        error: {
                          duration: 4000,
                          iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                          },
                        },
                      }}
                    />
                  </ScrollToTopWrapper>
                </CartDrawerProvider>
              </FavoritoProvider>
            </CartProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
