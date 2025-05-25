"use client";

import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import FeaturedProductsSection from "@/components/sections/FeaturedProductsSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Layout from "@/components/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <AboutSection />
      <TestimonialsSection />
      <NewsletterSection />
    </Layout>
  );
}
