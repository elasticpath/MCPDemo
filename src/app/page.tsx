"use client";

import AuthStatus from "./components/AuthStatus";
import ProductGrid from "./components/ProductGrid";
import { useProducts } from "./hooks/useProducts";

export default function Home() {
  const { products, productImages, loading, error } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Elastic Path Product Store
            </h1>

            {/* Authentication Status */}
            <AuthStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Our Products
          </h2>
          <p className="text-gray-600">
            Discover our amazing collection of products powered by Elastic Path
            Commerce Cloud.
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
    </div>
  );
}
