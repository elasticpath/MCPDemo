"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { checkoutApi, getCartId, paymentSetup } from "@epcc-sdk/sdks-shopper";

// Customer interface
interface Customer {
  name?: string;
  email?: string;
}

// Display price interface
interface DisplayPrice {
  with_tax?: {
    formatted?: string;
  };
}

// Meta interface
interface OrderMeta {
  display_price?: DisplayPrice;
}

// Order data interface based on usage in OrderConfirmation
interface OrderData {
  id?: string;
  reference?: string;
  status?: string;
  payment_status?: string;
  meta?: OrderMeta;
  customer?: Customer;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    county?: string;
    region?: string;
    postcode?: string;
    country?: string;
    phone_number?: string;
    instructions?: string;
  };
}

interface CheckoutContextType {
  loading: boolean;
  error: string | null;
  orderData: OrderData | null;
  isOrderComplete: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkout = useCallback(async (checkoutData: any) => {
    try {
      setLoading(true);
      setError(null);

      const cartId = getCartId();
      if (!cartId) {
        throw new Error("No cart found. Please add items to your cart first.");
      }

      // Convert cart to order using the checkoutApi
      const checkoutResponse = await checkoutApi({
        path: {
          cartID: cartId,
        },
        body: {
          data: checkoutData,
        },
      });

      const order = checkoutResponse.data?.data;
      if (!order?.id) {
        throw new Error("Failed to create order");
      }

      // Process payment using manual gateway to mark order as paid
      const paymentResponse = await paymentSetup({
        path: {
          orderID: order.id,
        },
        body: {
          data: {
            gateway: "manual",
            method: "purchase",
          },
        },
      });

      // Payment successful, use the order with updated payment status
      // The payment response confirms payment, but we'll use the original order data
      // with updated status information if available
      const paymentData = paymentResponse.data?.data;
      if (!paymentData) {
        throw new Error("Failed to process payment");
      }

      // Use the order data and add payment information
      const orderWithPayment: OrderData = {
        ...order,
        // Add payment status information if available in the response
        payment_status: "paid",
        status: "complete",
      };

      setOrderData(orderWithPayment);
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
