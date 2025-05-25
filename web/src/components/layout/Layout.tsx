"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  cartItemsCount?: number;
  wishlistCount?: number;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  cartItemsCount = 0,
  wishlistCount = 0,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header cartItemsCount={cartItemsCount} wishlistCount={wishlistCount} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
