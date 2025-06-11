"use client";
import { useCatalogo } from "@/hooks/useCatalogo";
import CatalogoDestacadosGrid from "@/components/catalogo/CatalogoDescatadoGrid";
import HeroSection from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CarContext";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import type { CatalogoCardProduct } from "@/components/catalogo/CatalogoDescatadoGrid";

export default function Home() {
  const { productos } = useCatalogo();
  const { addToCart } = useCart();
  const { openDrawer } = useCartDrawer();

  // Filtra los productos destacados
  const destacados = productos?.filter((prod) => prod.destacado);

  // Handler para añadir al carrito desde destacados
  const handleAddToCart = async (product: CatalogoCardProduct) => {
    try {
      await addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price || 0,
        image: product.image || "/images/products/producto_sinimage.svg",
        category: product.category || "Sin categoría",
        description: product.shortDescription || "",
        stock: 99,
      });
      openDrawer();
    } catch (error) {
      console.error("Error añadiendo al carrito:", error);
    }
  };

  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <section className="my-16">
        <CatalogoDestacadosGrid
          productos={destacados ?? []}
          onAddToCart={handleAddToCart}
        />
      </section>
      <AboutSection />
      <TestimonialsSection />
      <NewsletterSection />
    </Layout>
  );
}