"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "../context/CheckoutProvider";
import CheckoutForm from "../components/CheckoutForm";
import OrderConfirmation from "../components/OrderConfirmation";

export default function CheckoutPage() {
  const router = useRouter();
  const { isOrderComplete } = useCheckout();

  const handleCancel = () => {
    router.push("/");
  };

  const handleContinueShopping = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {isOrderComplete ? (
        <OrderConfirmation onContinueShopping={handleContinueShopping} />
      ) : (
        <CheckoutForm onCancel={handleCancel} />
      )}
    </div>
  );
}
