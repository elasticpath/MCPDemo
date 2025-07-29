"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  initializeCart,
  getCart,
  getCartId,
  manageCarts,
  updateACartItem,
  deleteACartItem,
} from "@epcc-sdk/sdks-shopper";

interface CartItem {
  id?: string;
  type?: string;
  quantity?: number;
  product_id?: string;
  name?: string;
  sku?: string;
  meta?: {
    display_price?: {
      with_tax?: {
        amount: number;
        currency: string;
        formatted: string;
      };
      without_tax?: {
        amount: number;
        currency: string;
        formatted: string;
      };
      unit?: {
        amount: number;
        currency: string;
        formatted: string;
      };
      value?: {
        amount: number;
        currency: string;
        formatted: string;
      };
    };
  };
}

interface CartData {
  id?: string;
  type?: string;
  meta?: {
    display_price?: {
      with_tax?: {
        amount: number;
        currency: string;
        formatted: string;
      };
      without_tax?: {
        amount: number;
        currency: string;
        formatted: string;
      };
      without_discount?: {
        amount: number;
        currency: string;
        formatted: string;
      };
      discount?: {
        amount: number;
        currency: string;
        formatted: string;
      };
      tax?: {
        amount: number;
        currency: string;
        formatted: string;
      };
    };
  };
  relationships?: {
    items?: {
      data: Array<{ id: string; type: string }>;
    };
  };
}

interface CartContextType {
  cart: CartData | null;
  items: CartItem[];
  itemCount: number;
  totalAmount: string;
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  isAddingToCart: string | null;
  lastAddedProduct: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [lastAddedProduct, setLastAddedProduct] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setError(null);

      // Initialize cart if it doesn't exist
      const cartId = await initializeCart();

      // Fetch cart data with items
      const response = await getCart({
        path: { cartID: cartId },
        query: { include: ["items"] },
      });

      const cartData = response.data?.data;
      const cartItems = response.data?.included?.items || [];

      setCart(cartData as CartData);
      setItems(cartItems as CartItem[]);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
    }
  }, []);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    await fetchCart();
    setLoading(false);
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      try {
        setIsAddingToCart(productId);
        setError(null);

        const cartId = getCartId();
        if (!cartId) {
          throw new Error("No cart found");
        }

        await manageCarts({
          path: { cartID: cartId },
          body: {
            data: {
              type: "cart_item",
              id: productId,
              quantity: quantity,
            },
          },
        });

        // Refresh cart after adding item
        await fetchCart();

        // Set last added product for success notification
        setLastAddedProduct(productId);
      } catch (err) {
        console.error("Error adding to cart:", err);
        setError(
          err instanceof Error ? err.message : "Failed to add item to cart"
        );
        throw err;
      } finally {
        setIsAddingToCart(null);
      }
    },
    [fetchCart]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        setError(null);

        const cartId = getCartId();
        if (!cartId) {
          throw new Error("No cart found");
        }

        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          await removeFromCart(itemId);
          return;
        }

        await updateACartItem({
          path: { cartID: cartId, cartitemID: itemId },
          body: {
            data: {
              id: itemId,
              quantity: quantity,
            },
          },
        });

        // Refresh cart after updating
        await fetchCart();
      } catch (err) {
        console.error("Error updating cart item:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update item quantity"
        );
        throw err;
      }
    },
    [fetchCart]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      try {
        setError(null);

        const cartId = getCartId();
        if (!cartId) {
          throw new Error("No cart found");
        }

        await deleteACartItem({
          path: { cartID: cartId, cartitemID: itemId },
        });

        // Refresh cart after removing item
        await fetchCart();
      } catch (err) {
        console.error("Error removing from cart:", err);
        setError(
          err instanceof Error ? err.message : "Failed to remove item from cart"
        );
        throw err;
      }
    },
    [fetchCart]
  );

  // Initialize cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const itemCount = items.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );
  const totalAmount = cart?.meta?.display_price?.with_tax?.formatted || "$0.00";

  const value: CartContextType = {
    cart,
    items,
    itemCount,
    totalAmount,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
    isAddingToCart,
    lastAddedProduct,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
