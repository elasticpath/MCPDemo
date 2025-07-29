"use client";

import { useStorefront } from "../auth/StorefrontProvider";

export default function AuthStatus() {
  const { isAuthenticated, isLoading, error, credentials } = useStorefront();

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 font-medium">
            Authenticating with Elastic Path...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-red-800 font-medium">Authentication Failed</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && credentials) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-green-800 font-medium">
              ✓ Authentication Successful
            </h3>
            <p className="text-green-600 text-sm mt-1">
              Connected to Elastic Path Commerce Cloud
            </p>
            <div className="mt-2 text-xs text-green-600">
              <div>Token Type: {credentials.token_type}</div>
              {credentials.expires && (
                <div>
                  Expires in:{" "}
                  {Math.round((credentials.expires - Date.now() / 1000) / 60)}{" "}
                  minutes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
