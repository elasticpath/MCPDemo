"use client";

import ProductCard from "./ProductCard";
import { useCart } from "../context/CartProvider";

interface Product {
  id?: string;
  attributes?: {
    name?: string;
    description?: string;
    sku?: string;
  };
  relationships?: {
    main_image?: {
      data?: {
        id?: string;
      };
    };
  };
  meta?: {
    display_price?: {
      without_tax?: {
        amount?: number;
        currency?: string;
        formatted?: string;
      };
    };
  };
}

interface ProductImage {
  id?: string;
  link?: {
    href?: string;
  };
}

interface ProductGridProps {
  products: Product[];
  productImages: ProductImage[];
  loading?: boolean;
  error?: string | null;
}

export default function ProductGrid({
  products,
  productImages,
  loading = false,
  error = null,
}: ProductGridProps) {
  const { addToCart, isAddingToCart } = useCart();

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
    } catch (err) {
      console.error("Failed to add product to cart:", err);
      // Error handling is managed by the CartProvider
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading products
        </h3>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">Check back later for new products.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(
        (product) =>
          product.id && (
            <ProductCard
              key={product.id}
              product={product}
              productImages={productImages}
              onAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart === product.id}
            />
          )
      )}
    </div>
  );
}
