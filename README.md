# Elastic Path Commerce Cloud Authentication Setup

This Next.js application includes Elastic Path Commerce Cloud authentication setup with the Shopper SDK.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_EPCC_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_EPCC_ENDPOINT_URL=https://euwest.api.elasticpath.com
```

Replace `your_client_id_here` with your actual Elastic Path Commerce Cloud client ID.

### 2. Installation

Install dependencies using pnpm:

```bash
pnpm install
```

### 3. Running the Application

Start the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Authentication Features

This setup includes:

- ✅ **Implicit Token Authentication**: Automatic token generation and management
- ✅ **Token Refresh**: Automatic token refresh when expired
- ✅ **SDK Configuration**: Pre-configured Elastic Path Shopper SDK
- ✅ **Authentication Context**: React context for authentication state
- ✅ **Status Indicator**: Visual indicator showing authentication status

## Authentication Flow

1. **Automatic Authentication**: When the app loads, it automatically requests an implicit token from Elastic Path
2. **Token Storage**: Tokens are stored in localStorage with automatic expiration handling
3. **Request Interceptors**: All API requests automatically include the Bearer token
4. **Status Display**: The main page shows authentication status with success/error indicators

## Components

- **StorefrontProvider**: React context provider for authentication state
- **AuthStatus**: Visual component showing authentication status
- **SDK Client**: Pre-configured Elastic Path client with interceptors

## Getting Your Elastic Path Credentials

1. Log in to your [Elastic Path Commerce Manager](https://useast.cm.elasticpath.com)
2. Go to **System** > **Application Keys**
3. Create a new application key or use an existing one
4. Copy the **Client ID** (not the client secret - that's for server-side use)
5. Note your API endpoint URL (e.g., `https://euwest.api.elasticpath.com`)

## Security Notes

- This implementation uses **localStorage** for token storage (client-side only)
- For production applications, consider server-side cookie storage for enhanced security
- The client ID is safe to expose in frontend code (it's public by design)
- Never include client secrets in frontend applications

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
