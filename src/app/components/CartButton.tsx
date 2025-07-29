"use client";

import { useCart } from "../context/CartProvider";

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { itemCount, loading } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Cart Icon */}
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
        />
      </svg>

      {/* Cart Count Badge */}
      {!loading && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}

      {/* Loading indicator */}
      {loading && (
        <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </span>
      )}
    </button>
  );
}
