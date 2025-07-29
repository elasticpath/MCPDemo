"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  client,
  createAnAccessToken,
  AccessTokenResponse,
} from "@epcc-sdk/sdks-shopper";
import { CREDENTIALS_COOKIE_KEY } from "../constants";

interface StorefrontContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  credentials: AccessTokenResponse | null;
}

const StorefrontContext = createContext<StorefrontContextType>({
  isAuthenticated: false,
  isLoading: true,
  error: null,
  credentials: null,
});

export const useStorefront = () => {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }
  return context;
};

function tokenExpired(expires: number): boolean {
  return Date.now() > expires * 1000;
}

interface StorefrontProviderProps {
  children: React.ReactNode;
}

export const StorefrontProvider: React.FC<StorefrontProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<AccessTokenResponse | null>(
    null
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Configure the client base URL
        client.setConfig({
          baseUrl: process.env.NEXT_PUBLIC_EPCC_ENDPOINT_URL!,
        });

        // Set up the authentication interceptor
        const interceptor = async (request: Request) => {
          // Bypass interceptor logic for token requests to prevent infinite loop
          if (request.url?.includes("/oauth/access_token")) {
            return request;
          }

          let storedCredentials = JSON.parse(
            localStorage.getItem(CREDENTIALS_COOKIE_KEY) ?? "{}"
          ) as AccessTokenResponse | undefined;

          // Check if token expired or missing
          if (
            !storedCredentials?.access_token ||
            (storedCredentials.expires &&
              tokenExpired(storedCredentials.expires))
          ) {
            const clientId = process.env.NEXT_PUBLIC_EPCC_CLIENT_ID;
            if (!clientId) {
              throw new Error("EPCC Client ID is not configured");
            }

            // Create a new implicit token
            const authResponse = await createAnAccessToken({
              body: {
                grant_type: "implicit",
                client_id: clientId,
              },
            });

            const token = authResponse.data;
            localStorage.setItem(CREDENTIALS_COOKIE_KEY, JSON.stringify(token));
            storedCredentials = token;
            setCredentials(token || null);
          }

          if (storedCredentials?.access_token) {
            request.headers.set(
              "Authorization",
              `Bearer ${storedCredentials.access_token}`
            );
          }
          return request;
        };

        client.interceptors.request.use(interceptor);

        // Get or create initial token
        let storedCredentials = JSON.parse(
          localStorage.getItem(CREDENTIALS_COOKIE_KEY) ?? "{}"
        ) as AccessTokenResponse | undefined;

        if (
          !storedCredentials?.access_token ||
          (storedCredentials.expires && tokenExpired(storedCredentials.expires))
        ) {
          const clientId = process.env.NEXT_PUBLIC_EPCC_CLIENT_ID;
          if (!clientId) {
            throw new Error("EPCC Client ID is not configured");
          }

          const authResponse = await createAnAccessToken({
            body: {
              grant_type: "implicit",
              client_id: clientId,
            },
          });

          const token = authResponse.data;
          localStorage.setItem(CREDENTIALS_COOKIE_KEY, JSON.stringify(token));
          storedCredentials = token;
        }

        setCredentials(storedCredentials || null);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Authentication failed:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: StorefrontContextType = {
    isAuthenticated,
    isLoading,
    error,
    credentials,
  };

  return (
    <StorefrontContext.Provider value={value}>
      {children}
    </StorefrontContext.Provider>
  );
};
