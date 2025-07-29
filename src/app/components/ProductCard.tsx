"use client";

import Image from "next/image";
import { extractProductImage } from "../hooks/useProducts";

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

interface ProductCardProps {
  product: Product;
  productImages: ProductImage[];
  onAddToCart: (productId: string) => void;
  isAddingToCart?: boolean;
}

// Type guard to ensure product has required id
function hasValidId(product: Product): product is Product & { id: string } {
  return !!product.id;
}

export default function ProductCard({
  product,
  productImages,
  onAddToCart,
  isAddingToCart = false,
}: ProductCardProps) {
  const name = product.attributes?.name || "Unnamed Product";
  const description =
    product.attributes?.description || "No description available";
  const sku = product.attributes?.sku || "No SKU";

  // Extract the main image for this product
  const mainImage = extractProductImage(product, productImages);
  const imageUrl = mainImage?.link?.href || "/placeholder.jpg";

  // Extract price information
  const priceData = product.meta?.display_price?.without_tax;
  const price = priceData?.formatted || "Price not available";

  const handleAddToCart = () => {
    if (!isAddingToCart && hasValidId(product)) {
      onAddToCart(product.id);
    }
  };

  // Don't render if product doesn't have a valid ID
  if (!hasValidId(product)) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.jpg";
          }}
        />
      </div>

      {/* Product Content */}
      <div className="p-4">
        <div className="min-h-[120px]">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {name}
          </h3>

          <p className="text-sm text-gray-500 mb-2">SKU: {sku}</p>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-lg font-bold text-gray-900">{price}</div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isAddingToCart
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
