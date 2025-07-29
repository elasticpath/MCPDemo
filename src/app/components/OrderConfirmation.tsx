"use client";

import { useCheckout } from "../context/CheckoutProvider";

interface OrderConfirmationProps {
  onContinueShopping: () => void;
}

export default function OrderConfirmation({
  onContinueShopping,
}: OrderConfirmationProps) {
  const { orderData, clearOrder } = useCheckout();

  if (!orderData) {
    return null;
  }

  const handleContinueShopping = () => {
    clearOrder();
    onContinueShopping();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 text-lg">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Order Details
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium text-gray-900">{orderData.id}</span>
          </div>

          {orderData.reference && (
            <div className="flex justify-between">
              <span className="text-gray-600">Order Reference:</span>
              <span className="font-medium text-gray-900">
                {orderData.reference}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-gray-900 capitalize">
              {orderData.status || "Pending"}
            </span>
          </div>

          {orderData.meta?.display_price?.with_tax?.formatted && (
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">
                Total:
              </span>
              <span className="text-lg font-bold text-gray-900">
                {orderData.meta.display_price.with_tax.formatted}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Customer Information */}
      {(orderData.customer?.email || orderData.customer?.name) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Information
          </h2>

          <div className="space-y-2">
            {orderData.customer.name && (
              <div>
                <span className="text-gray-600">Name: </span>
                <span className="font-medium text-gray-900">
                  {orderData.customer.name}
                </span>
              </div>
            )}

            {orderData.customer.email && (
              <div>
                <span className="text-gray-600">Email: </span>
                <span className="font-medium text-gray-900">
                  {orderData.customer.email}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shipping Address */}
      {orderData.shipping_address && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Shipping Address
          </h2>

          <div className="text-gray-900">
            {orderData.shipping_address.first_name &&
              orderData.shipping_address.last_name && (
                <div className="font-medium">
                  {orderData.shipping_address.first_name}{" "}
                  {orderData.shipping_address.last_name}
                </div>
              )}

            {orderData.shipping_address.company_name && (
              <div>{orderData.shipping_address.company_name}</div>
            )}

            {orderData.shipping_address.line_1 && (
              <div>{orderData.shipping_address.line_1}</div>
            )}

            {orderData.shipping_address.line_2 && (
              <div>{orderData.shipping_address.line_2}</div>
            )}

            <div>
              {orderData.shipping_address.city &&
                `${orderData.shipping_address.city}, `}
              {orderData.shipping_address.region &&
                `${orderData.shipping_address.region} `}
              {orderData.shipping_address.postcode}
            </div>

            {orderData.shipping_address.country && (
              <div>{orderData.shipping_address.country}</div>
            )}

            {orderData.shipping_address.phone_number && (
              <div className="mt-2 text-gray-600">
                Phone: {orderData.shipping_address.phone_number}
              </div>
            )}

            {orderData.shipping_address.instructions && (
              <div className="mt-2 text-gray-600">
                Instructions: {orderData.shipping_address.instructions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          What's Next?
        </h2>
        <ul className="text-blue-800 space-y-1">
          <li>• You'll receive an order confirmation email shortly</li>
          <li>• We'll notify you when your order ships</li>
          <li>• Track your order status in your email</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleContinueShopping}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Continue Shopping
        </button>

        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Print Order
        </button>
      </div>
    </div>
  );
}
