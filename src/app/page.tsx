"use client";

import { useState, useEffect } from "react";
import AuthStatus from "./components/AuthStatus";
import ProductGrid from "./components/ProductGrid";
import CartButton from "./components/CartButton";
import CartSidebar from "./components/CartSidebar";
import CartSuccessNotification from "./components/CartSuccessNotification";
import HeroSection from "./components/HeroSection";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./context/CartProvider";

export default function Home() {
  const { products, productImages, loading, error } = useProducts();
  const { lastAddedProduct } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Show success notification when item is added to cart
  useEffect(() => {
    if (lastAddedProduct) {
      setShowSuccessNotification(true);
    }
  }, [lastAddedProduct]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-red-600 font-extrabold">ISO</span>{" "}
                Standards Store
              </h1>

              {/* Authentication Status */}
              <AuthStatus />
            </div>

            {/* Cart Button */}
            <CartButton onClick={() => setIsCartOpen(true)} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600">
            Explore our curated selection inspired by the international
            standards community.
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          productImages={productImages}
          loading={loading}
          error={error}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2024 Elastic Path Product Store. Powered by Elastic Path
              Commerce Cloud.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="https://elasticpath.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Elastic Path
              </a>
              <a
                href="https://documentation.elasticpath.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Success Notification */}
      <CartSuccessNotification
        show={showSuccessNotification}
        message="Item added to cart!"
        onHide={() => setShowSuccessNotification(false)}
      />
    </div>
  );
}
