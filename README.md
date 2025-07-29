# Elastic Path Commerce Cloud Authentication & Shopping Cart

This Next.js application includes Elastic Path Commerce Cloud authentication setup with the Shopper SDK, a complete product listing page, and full shopping cart functionality.

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

## Features

This application includes:

### ✅ Authentication Features

- **Implicit Token Authentication**: Automatic token generation and management
- **Token Refresh**: Automatic token refresh when expired
- **SDK Configuration**: Pre-configured Elastic Path Shopper SDK
- **Authentication Context**: React context for authentication state
- **Status Indicator**: Visual indicator showing authentication status

### ✅ Product Listing Features

- **Product Grid**: Responsive grid layout displaying products
- **Product Cards**: Beautiful product cards with images, names, prices, and descriptions
- **Loading States**: Smooth loading animations while fetching products
- **Error Handling**: Graceful error handling with user-friendly messages
- **Empty States**: Appropriate messages when no products are found
- **Image Fallbacks**: Placeholder images for products without photos

### ✅ Shopping Cart Features

- **Add to Cart**: Functional "Add to Cart" buttons on all product cards
- **Cart Management**: Add, update quantities, and remove items from cart
- **Cart Sidebar**: Sliding cart sidebar showing cart contents
- **Cart Button**: Header cart button with item count badge
- **Real-time Updates**: Automatic cart refresh after operations
- **Quantity Controls**: Increase/decrease item quantities in cart
- **Cart Totals**: Display subtotals, taxes, and total amounts
- **Success Notifications**: Toast notifications when items are added
- **Persistent Cart**: Cart persists across browser sessions
- **Error Handling**: Graceful error handling for all cart operations

### ✅ Checkout Features

- **Guest Checkout**: Complete checkout without creating an account
- **Customer Information**: Collect contact details and addresses
- **Billing & Shipping**: Separate billing and shipping address forms
- **Order Creation**: Convert cart to order using Elastic Path APIs
- **Order Confirmation**: Beautiful confirmation page with order details
- **Form Validation**: Client-side validation for required fields
- **Loading States**: Visual feedback during checkout process
- **Error Handling**: Graceful error handling with user feedback
- **Responsive Design**: Mobile-friendly checkout experience

## Authentication Flow

1. **Automatic Authentication**: When the app loads, it automatically requests an implicit token from Elastic Path
2. **Token Storage**: Tokens are stored in localStorage with automatic expiration handling
3. **Request Interceptors**: All API requests automatically include the Bearer token
4. **Status Display**: The header shows authentication status with success/error indicators

## Product Listing Flow

1. **Data Fetching**: Uses `getByContextAllProducts` from the Elastic Path SDK
2. **Image Processing**: Extracts and displays product main images
3. **Responsive Design**: Grid adapts to different screen sizes
4. **Interactive Elements**: Functional add to cart buttons with loading states

## Shopping Cart Flow

1. **Cart Initialization**: Cart is automatically created using `initializeCart` on app load
2. **Add to Cart**: Products are added using `manageCarts` API with real product IDs
3. **Cart Display**: Cart sidebar shows items with quantities, prices, and totals
4. **Cart Operations**: Users can update quantities or remove items using cart APIs
5. **Persistence**: Cart ID is stored in localStorage and persists across sessions

## Checkout Flow

1. **Start Checkout**: User clicks "Checkout" button in cart sidebar
2. **Guest Information**: Customer fills out contact information and addresses
3. **Order Creation**: Form data is converted to order using `checkoutApi`
4. **Order Confirmation**: Success page displays order details and next steps
5. **Cart Cleanup**: Cart ID is cleared after successful order creation

## Components

### Authentication

- **StorefrontProvider**: React context provider for authentication state
- **AuthStatus**: Visual component showing authentication status

### Products

- **ProductGrid**: Main grid component displaying all products
- **ProductCard**: Individual product card component
- **useProducts**: Custom hook for fetching and managing product data

### Shopping Cart

- **CartProvider**: React context for cart state management
- **CartButton**: Header cart button with item count
- **CartSidebar**: Sliding sidebar displaying cart contents
- **CartSuccessNotification**: Toast notifications for cart actions

### Checkout

- **CheckoutProvider**: React context for checkout state management
- **CheckoutForm**: Guest checkout form with address collection
- **OrderConfirmation**: Order success page with details
- **CheckoutPage**: Main checkout page component

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   └── StorefrontProvider.tsx    # Authentication context
│   ├── context/
│   │   ├── CartProvider.tsx          # Cart context and operations
│   │   └── CheckoutProvider.tsx      # Checkout context and operations
│   ├── components/
│   │   ├── AuthStatus.tsx            # Auth status indicator
│   │   ├── ProductCard.tsx           # Individual product card
│   │   ├── ProductGrid.tsx           # Product grid layout
│   │   ├── CartButton.tsx            # Cart button with count
│   │   ├── CartSidebar.tsx           # Cart sidebar display
│   │   ├── CartSuccessNotification.tsx # Success toast
│   │   ├── CheckoutForm.tsx          # Guest checkout form
│   │   └── OrderConfirmation.tsx     # Order confirmation page
│   ├── checkout/
│   │   └── page.tsx                  # Checkout page
│   ├── hooks/
│   │   └── useProducts.ts            # Product fetching hook
│   ├── constants.ts                  # App constants
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout with providers
│   └── page.tsx                      # Main product listing page
├── lib/
│   └── client.ts                     # SDK client configuration
└── ...
```

## Getting Your Elastic Path Credentials

1. Log in to your [Elastic Path Commerce Manager](https://useast.cm.elasticpath.com)
2. Go to **System** > **Application Keys**
3. Create a new application key or use an existing one
4. Copy the **Client ID** (not the client secret - that's for server-side use)
5. Note your API endpoint URL (e.g., `https://euwest.api.elasticpath.com`)

## Development Notes

### Adding Products to Your Store

To see products in the listing:

1. Log in to your Elastic Path Commerce Manager
2. Go to **Product Experience Manager**
3. Create and publish products with images
4. Ensure your products are published to a catalog
5. The products will automatically appear in your storefront

### Using the Shopping Cart

1. **Adding Items**: Click "Add to Cart" on any product card
2. **Viewing Cart**: Click the cart icon in the header to open the cart sidebar
3. **Managing Items**: Use +/- buttons to change quantities or click "Remove" to delete items
4. **Cart Persistence**: Your cart will persist when you refresh the page or close/reopen the browser

### Using Checkout

1. **Start Checkout**: Click "Checkout" button in the cart sidebar
2. **Fill Information**: Complete the contact information and address forms
3. **Address Options**: Choose to use the same address for billing and shipping, or enter separate addresses
4. **Complete Order**: Click "Complete Order" to create the order
5. **Order Confirmation**: View your order details and confirmation information

### Cart API Operations

The cart uses the following Elastic Path SDK functions:

- `initializeCart()`: Creates or retrieves existing cart
- `manageCarts()`: Adds products to cart
- `updateACartItem()`: Updates item quantities
- `deleteACartItem()`: Removes items from cart
- `getCart()`: Fetches cart with items and totals

### Checkout API Operations

The checkout uses the following Elastic Path SDK functions:

- `checkoutApi()`: Converts cart to order with customer information
- `getCartId()`: Retrieves current cart ID for checkout process

### Customization

- **Styling**: All components use Tailwind CSS for easy customization
- **Product Layout**: Modify `ProductCard.tsx` to change the card layout
- **Grid Configuration**: Adjust grid columns in `ProductGrid.tsx`
- **Cart UI**: Customize `CartSidebar.tsx` for different cart layouts
- **Notifications**: Modify `CartSuccessNotification.tsx` for custom success messages
- **Checkout Form**: Modify `CheckoutForm.tsx` to add/remove form fields
- **Order Confirmation**: Customize `OrderConfirmation.tsx` for different confirmation layouts

### Next Steps

This implementation provides a foundation for:

- **Payment Processing**: Add payment gateways (credit cards, PayPal, etc.)
- **Product Detail Pages**: Individual product pages with variations
- **Search and Filtering**: Product search and category filtering
- **Customer Accounts**: User registration and login
- **Order History**: Display past customer orders
- **Promotions**: Discount codes and promotional pricing
- **Order Management**: Order status updates and tracking
- **Email Notifications**: Order confirmation and shipping emails

## Security Notes

- This implementation uses **localStorage** for token storage (client-side only)
- For production applications, consider server-side cookie storage for enhanced security
- The client ID is safe to expose in frontend code (it's public by design)
- Never include client secrets in frontend applications

## Learn More

- [Elastic Path Documentation](https://documentation.elasticpath.com/)
- [Elastic Path Shopper SDK](https://github.com/elasticpath/composable-frontend)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

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
