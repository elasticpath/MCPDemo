"use client";

import { useCart } from "../context/CartProvider";
import { useState } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    items,
    cart,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    totalAmount,
  } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (!itemId) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!itemId) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading cart...</span>
              </div>
            )}

            {error && (
              <div className="p-4 text-red-600 text-sm">Error: {error}</div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <svg
                  className="h-16 w-16 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 text-center">
                  Add some products to get started!
                </p>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name || "Product"}
                      </h4>
                      {item.sku && (
                        <p className="text-xs text-gray-500 mt-1">
                          SKU: {item.sku}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        {item.meta?.display_price?.unit?.formatted ||
                          "Price not available"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id!,
                              (item.quantity || 1) - 1
                            )
                          }
                          disabled={
                            updatingItems.has(item.id!) ||
                            (item.quantity || 0) <= 1
                          }
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>

                        <span className="text-sm font-medium min-w-[2ch] text-center">
                          {updatingItems.has(item.id!)
                            ? "..."
                            : item.quantity || 0}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id!,
                              (item.quantity || 0) + 1
                            )
                          }
                          disabled={updatingItems.has(item.id!)}
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id!)}
                        disabled={updatingItems.has(item.id!)}
                        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>

                      {/* Item Total */}
                      <p className="text-sm font-medium text-gray-900">
                        {item.meta?.display_price?.value?.formatted || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Total and Checkout */}
          {!loading && !error && items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Cart Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">
                  Total:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {totalAmount}
                </span>
              </div>

              {/* Checkout Button */}
              <a
                href="/checkout"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center"
              >
                Checkout
              </a>

              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
