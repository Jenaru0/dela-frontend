"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5;

    const animate = () => {
      if (isHovering) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      position += speed;
      if (position >= container.scrollWidth / 2) {
        position = 0;
      }
      container.scrollLeft = position;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isHovering]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-6"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>{" "}
        {/* Duplicate products for infinite scroll effect */}
        {[...products, ...products].map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="min-w-[280px] max-w-[280px] flex-shrink-0"
          >
            <ProductCard
              product={{
                ...product,
                discount: product.oldPrice
                  ? Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) *
                        100
                    )
                  : undefined,
              }}
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent"></div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent"></div>
    </div>
  );
}
