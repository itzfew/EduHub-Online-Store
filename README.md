Dealsbe - Exclusive Software Deals for Developers and Startups
Dealsbe is a Next.js-based e-commerce platform for developers and startups to browse, view, and purchase software products, including eBooks and physical items. It features a product listing, detailed product views, a checkout process, and secure payment integration with Cashfree's production API. The application is optimized for deployment on Vercel.
Features

Product Listing: Browse a curated list of software products.
Product Details: View detailed information about each product.
Checkout Process: Enter customer details (name, email, phone, Telegram username, address) and proceed to payment.
Cashfree Payment Integration: Secure payments via Cashfree's production API using the Cashfree SDK.
Post-Payment Handling: Displays success/failure status and provides eBook download links and Telegram links for applicable products.
Production-Ready: Configured for production deployment on Vercel with secure environment variables.

Tech Stack

Frontend: Next.js 14.2.5, React 18, TypeScript, Tailwind CSS, react-toastify
Backend: Next.js API Routes
Payment Gateway: Cashfree Production API (v2022-09-01)
Dependencies: Axios, UUID, react-toastify
Deployment: Vercel

Project Structure
ecommerce-store/
├── pages/
│   ├── api/
│   │   ├── create-order.ts        # Creates a new order and saves customer details
│   │   ├── initiate-payment.ts    # Initiates Cashfree payment with payment_session_id
│   │   ├── check-payment.ts       # Checks payment status
│   │   ├── webhook.ts             # Handles Cashfree webhook notifications
│   ├── _app.tsx                   # Next.js app configuration
│   ├── index.tsx                  # Product listing page
│   ├── product/
│   │   ├── [id].tsx               # Product detail page
│   ├── checkout.tsx                # Checkout form page
│   ├── payment.tsx                # Payment initiation page
│   ├── payment-result.tsx         # Payment success/failure page
├── public/
│   ├── ebook.jpg                  # Sample eBook image
│   ├── book.jpg                   # Sample physical book image
├── .env.example                   # Example environment variables
├── package.json                   # Project dependencies and scripts
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── README.md                      # Project documentation

API Endpoints

POST /api/create-order

Creates a new order with customer details and initiates Cashfree payment.
Request Body: { productId, productName, amount, telegramLink, customerName, customerEmail, customerPhone, telegramUsername, customerAddress, purchaseId, itemType }
Response: { success: true, paymentSessionId: string, orderId: string, purchaseId: string } or { success: false, error: string }


POST /api/initiate-payment

Initiates a Cashfree payment session for an existing order.
Request Body: { purchaseId: string }
Response: { success: true, paymentSessionId: string, orderId: string, purchaseId: string } or { success: false, error: string }


GET /api/check-payment?purchaseId={purchaseId}

Checks the status of a payment.
Query Parameter: purchaseId
Response: { success: true, status: string, productId: string, telegramLink: string } or { success: false, error: string }


POST /api/webhook

Handles Cashfree webhook notifications for payment events.
Request Body: Cashfree webhook payload
Response: { success: true, status: string } or { success: false, error: string }



Prerequisites

Node.js 18.x or later
Cashfree production account (https://www.cashfree.com/)
Vercel account (https://vercel.com/)
GitHub account for repository management

Setup Instructions

Clone the Repository
git clone <your-repo-url>
cd ecommerce-store


Install Dependencies
npm install


Configure Environment Variables

Copy .env.example to .env.local:cp .env.example .env.local


Update .env.local with your production credentials:NEXT_PUBLIC_BASE_URL=https://your-vercel-app.vercel.app
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_WEBHOOK_SECRET=your_cashfree_webhook_secret


Obtain CASHFREE_APP_ID, CASHFREE_SECRET_KEY, and CASHFREE_WEBHOOK_SECRET from your Cashfree production dashboard (Developers > API Keys).


Add Product Images

Place product images (e.g., ebook.jpg, book.jpg) in the public/ directory.
Update the products array in pages/index.tsx, pages/product/[id].tsx, and pages/payment-result.tsx with actual product data.


Run Locally
npm run dev


Access the app at http://localhost:3000.



Deployment to Vercel

Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main


Set Up Vercel

Log in to Vercel and create a new project.
Import your GitHub repository.
Configure environment variables in Vercel:
NEXT_PUBLIC_BASE_URL: Your Vercel deployment URL (e.g., https://your-vercel-app.vercel.app).
CASHFREE_APP_ID: Your Cashfree production app ID.
CASHFREE_SECRET_KEY: Your Cashfree production secret key.
CASHFREE_WEBHOOK_SECRET: Your Cashfree webhook secret.


Deploy the project. Vercel will handle the Next.js build and deployment.


Verify Deployment

Ensure the app is accessible at your Vercel URL.
Test the payment flow using real payment methods (Cashfree production mode does not support test cards).



Cashfree Integration

Production Mode: The app uses Cashfree's production API (https://api.cashfree.com/pg) and SDK (https://sdk.cashfree.com/js/v3/cashfree.js).
Webhook Configuration: Set up the webhook URL (https://your-vercel-app.vercel.app/api/webhook) in the Cashfree dashboard to receive payment notifications.
Security: The webhook endpoint verifies signatures using CASHFREE_WEBHOOK_SECRET.
Payment Flow:
Users complete checkout and are redirected to Cashfree's payment page via the SDK.
After payment, users are redirected to /payment-result?purchase_id={purchaseId}&item_type=product.
For eBooks, a download link and Telegram link are displayed on successful payment.



Database Integration (Production)

The current implementation uses a mock in-memory database (orders object). For production, integrate a database (e.g., Vercel Postgres, MongoDB):
Store orders with fields: purchaseId, productId, productName, amount, telegramLink, customerName, customerEmail, customerPhone, telegramUsername, customerAddress, paymentStatus, createdAt.
Update api/create-order.ts, api/initiate-payment.ts, and api/check-payment.ts to use the database.
Example Prisma schema:model Order {
  purchaseId       String   @id
  productId        String
  productName      String
  amount           Float
  telegramLink     String
  customerName     String
  customerEmail    String
  customerPhone    String
  telegramUsername String
  customerAddress  String
  paymentStatus    String
  createdAt        DateTime
}





Security Considerations

Environment Variables: Store sensitive data (CASHFREE_SECRET_KEY, CASHFREE_WEBHOOK_SECRET) in Vercel environment variables.
Webhook Security: The webhook endpoint verifies signatures to prevent unauthorized requests.
Input Validation: The checkout form includes validation for email and phone number.
Error Handling: Uses react-toastify for user-friendly error messages.
HTTPS: Ensure all API calls use HTTPS (handled by Vercel).

Future Enhancements

Add user authentication to secure checkout and track purchases.
Implement a cart system for multiple product purchases.
Add admin panel for managing products and orders.
Support additional payment methods via Cashfree.
Implement email notifications for order confirmation and eBook access.

Troubleshooting

Payment Issues: Verify Cashfree credentials and ensure production mode is enabled. Check for duplicate order_id in the Cashfree dashboard.
Deployment Errors: Check Vercel logs for missing environment variables or build issues.
Webhook Failures: Ensure the webhook URL is publicly accessible and configured in Cashfree.

License
MIT License
