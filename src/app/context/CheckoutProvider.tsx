"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { checkoutApi, getCartId } from "@epcc-sdk/sdks-shopper";

interface CheckoutContextType {
  loading: boolean;
  error: string | null;
  orderData: any | null;
  isOrderComplete: boolean;
  checkout: (checkoutData: any) => Promise<void>;
  clearOrder: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};

interface CheckoutProviderProps {
  children: React.ReactNode;
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const checkout = useCallback(async (checkoutData: any) => {
    try {
      setLoading(true);
      setError(null);

      const cartId = getCartId();
      if (!cartId) {
        throw new Error("No cart found. Please add items to your cart first.");
      }

      // Convert cart to order using the checkoutApi
      const response = await checkoutApi({
        path: {
          cartID: cartId,
        },
        body: {
          data: checkoutData,
        },
      });

      const order = response.data?.data;
      if (!order?.id) {
        throw new Error("Failed to create order");
      }

      setOrderData(order);
      setIsOrderComplete(true);

      // Clear cart ID after successful checkout
      localStorage.removeItem("ep_cart_id");
    } catch (err) {
      console.error("Checkout failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOrder = useCallback(() => {
    setOrderData(null);
    setIsOrderComplete(false);
    setError(null);
  }, []);

  const value: CheckoutContextType = {
    loading,
    error,
    orderData,
    isOrderComplete,
    checkout,
    clearOrder,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};
