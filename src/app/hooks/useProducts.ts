"use client";

import { useState, useEffect } from "react";
import {
  getByContextAllProducts,
  extractProductImage,
} from "@epcc-sdk/sdks-shopper";
import { configureClient } from "../../lib/client";

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

interface UseProductsResult {
  products: Product[];
  productImages: ProductImage[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Configure the client (this sets up authentication)
      configureClient();

      const response = await getByContextAllProducts({
        query: {
          include: ["main_image"],
        },
      });

      const productsData = response.data?.data || [];
      const imagesData = response.data?.included?.main_images || [];

      setProducts(productsData as Product[]);
      setProductImages(imagesData as ProductImage[]);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    productImages,
    loading,
    error,
    refetch: fetchProducts,
  };
}

export { extractProductImage };
