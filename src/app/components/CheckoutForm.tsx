"use client";

import { useState } from "react";
import { useCheckout } from "../context/CheckoutProvider";

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  billingLine1: string;
  billingLine2: string;
  billingCity: string;
  billingCounty: string;
  billingRegion: string;
  billingPostcode: string;
  billingCountry: string;
  shippingLine1: string;
  shippingLine2: string;
  shippingCity: string;
  shippingCounty: string;
  shippingRegion: string;
  shippingPostcode: string;
  shippingCountry: string;
  shippingPhone: string;
  shippingInstructions: string;
  sameAsShipping: boolean;
}

interface CheckoutFormProps {
  onCancel: () => void;
}

export default function CheckoutForm({ onCancel }: CheckoutFormProps) {
  const { checkout, loading, error } = useCheckout();

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    billingLine1: "",
    billingLine2: "",
    billingCity: "",
    billingCounty: "",
    billingRegion: "",
    billingPostcode: "",
    billingCountry: "US",
    shippingLine1: "",
    shippingLine2: "",
    shippingCity: "",
    shippingCounty: "",
    shippingRegion: "",
    shippingPostcode: "",
    shippingCountry: "US",
    shippingPhone: "",
    shippingInstructions: "",
    sameAsShipping: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create checkout data object using SDK structure
      const checkoutData = {
        customer: {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
        },
        billing_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          line_1: formData.billingLine1,
          line_2: formData.billingLine2 || undefined,
          city: formData.billingCity,
          county: formData.billingCounty || undefined,
          region: formData.billingRegion || undefined,
          postcode: formData.billingPostcode,
          country: formData.billingCountry,
        },
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.shippingPhone || undefined,
          line_1: formData.sameAsShipping
            ? formData.billingLine1
            : formData.shippingLine1,
          line_2: formData.sameAsShipping
            ? formData.billingLine2 || undefined
            : formData.shippingLine2 || undefined,
          city: formData.sameAsShipping
            ? formData.billingCity
            : formData.shippingCity,
          county: formData.sameAsShipping
            ? formData.billingCounty || undefined
            : formData.shippingCounty || undefined,
          region: formData.sameAsShipping
            ? formData.billingRegion || undefined
            : formData.shippingRegion || undefined,
          postcode: formData.sameAsShipping
            ? formData.billingPostcode
            : formData.shippingPostcode,
          country: formData.sameAsShipping
            ? formData.billingCountry
            : formData.shippingCountry,
          instructions: formData.shippingInstructions || undefined,
        },
      };

      await checkout(checkoutData);
    } catch (err) {
      // Error is handled by the checkout context
      console.error("Checkout submission failed:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
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

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Billing Address
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="billingLine1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address Line 1 *
              </label>
              <input
                type="text"
                id="billingLine1"
                name="billingLine1"
                value={formData.billingLine1}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="billingLine2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address Line 2
              </label>
              <input
                type="text"
                id="billingLine2"
                name="billingLine2"
                value={formData.billingLine2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="billingCity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="billingCity"
                  name="billingCity"
                  value={formData.billingCity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="billingRegion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State/Region
                </label>
                <input
                  type="text"
                  id="billingRegion"
                  name="billingRegion"
                  value={formData.billingRegion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="billingPostcode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="billingPostcode"
                  name="billingPostcode"
                  value={formData.billingPostcode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="billingCountry"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="billingCountry"
                  name="billingCountry"
                  value={formData.billingCountry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Shipping Address
            </h2>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="sameAsShipping"
                checked={formData.sameAsShipping}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Same as billing address
              </span>
            </label>
          </div>

          {!formData.sameAsShipping && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="shippingLine1"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  id="shippingLine1"
                  name="shippingLine1"
                  value={formData.shippingLine1}
                  onChange={handleInputChange}
                  required={!formData.sameAsShipping}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="shippingLine2"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="shippingLine2"
                  name="shippingLine2"
                  value={formData.shippingLine2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="shippingCity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="shippingCity"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    required={!formData.sameAsShipping}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="shippingRegion"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State/Region
                  </label>
                  <input
                    type="text"
                    id="shippingRegion"
                    name="shippingRegion"
                    value={formData.shippingRegion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="shippingPostcode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="shippingPostcode"
                    name="shippingPostcode"
                    value={formData.shippingPostcode}
                    onChange={handleInputChange}
                    required={!formData.sameAsShipping}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="shippingCountry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country *
                  </label>
                  <input
                    type="text"
                    id="shippingCountry"
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleInputChange}
                    required={!formData.sameAsShipping}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="shippingPhone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="shippingPhone"
                name="shippingPhone"
                value={formData.shippingPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="shippingInstructions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Delivery Instructions
              </label>
              <textarea
                id="shippingInstructions"
                name="shippingInstructions"
                value={formData.shippingInstructions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Special delivery instructions..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Complete Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
