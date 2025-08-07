Dealsbe - Exclusive Software Deals for Developers and Startups
Dealsbe is a Next.js-based e-commerce platform designed for developers and startups to browse, view, and purchase software products, including eBooks and physical items. It features a product listing, detailed product views, a checkout process, and secure payment integration with Cashfree's production API. The application is optimized for deployment on Vercel.
Features

Product Listing: Browse a curated list of software products.
Product Details: View detailed information about each product.
Checkout Process: Enter customer details and proceed to payment.
Cashfree Payment Integration: Secure payments via Cashfree's production API.
Post-Payment Handling: Displays success/failure status and provides eBook download links for applicable products.
Production-Ready: Configured for production deployment on Vercel with secure environment variables.

Tech Stack

Frontend: Next.js 14.2.5, React 18, TypeScript, Tailwind CSS
Backend: Next.js API Routes
Payment Gateway: Cashfree Production API (v2022-09-01)
Dependencies: Axios, UUID
Deployment: Vercel

Project Structure
ecommerce-store/
├── pages/
│   ├── api/
│   │   ├── create-order.ts        # Creates a new order
│   │   ├── initiate-payment.ts    # Initiates Cashfree payment
│   │   ├── check-payment.ts       # Checks payment status
│   │   ├── webhook.ts             # Handles Cashfree webhook notifications
│   ├── _app.tsx                   # Next.js app configuration
│   ├── index.tsx                  # Product listing page
│   ├── product/
│   │   ├── [id].tsx               # Product detail page
│   ├── checkout.tsx                # Checkout form page
│   ├── payment.tsx                 # Payment initiation page
│   ├── payment-result.tsx          # Payment success/failure page
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

Creates a new order with customer details.
Request Body: { customerName: string, email: string, address: string, productId: string }
Response: { orderId: string } or { error: string }


POST /api/initiate-payment

Initiates a Cashfree payment session.
Request Body: { orderId: string, productId: string, amount: number }
Response: { paymentLink: string } or { error: string }
Redirects to Cashfree's payment page.


GET /api/check-payment?orderId={orderId}

Checks the status of a payment.
Query Parameter: orderId
Response: { status: string, productId: string } or { error: string }


POST /api/webhook

Handles Cashfree webhook notifications for payment events.
Request Body: Cashfree webhook payload
Response: { status: string }



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


Update .env.local with your production credentials:NEXT_PUBLIC_URL=https://your-vercel-app.vercel.app
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key


Obtain CASHFREE_APP_ID and CASHFREE_SECRET_KEY from your Cashfree production dashboard (Developers > API Keys).


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
NEXT_PUBLIC_URL: Your Vercel deployment URL (e.g., https://your-vercel-app.vercel.app).
CASHFREE_APP_ID: Your Cashfree production app ID.
CASHFREE_SECRET_KEY: Your Cashfree production secret key.


Deploy the project. Vercel will handle the Next.js build and deployment.


Verify Deployment

Ensure the app is accessible at your Vercel URL.
Test the payment flow using real payment methods (Cashfree production mode does not support test cards).



Cashfree Integration

Production Mode: The app uses Cashfree's production API (https://api.cashfree.com/pg). Complete Cashfree's KYC and business verification to enable production mode.
Webhook Configuration: Set up the webhook URL (https://your-vercel-app.vercel.app/api/webhook) in the Cashfree dashboard to receive payment notifications.
Security: Implement webhook signature verification in api/webhook.ts for production use (refer to Cashfree documentation).
Payment Flow:
Users complete checkout and are redirected to Cashfree's payment page.
After payment, users are redirected to /payment-result?orderId={orderId}.
For eBooks, a download link is displayed on successful payment.



Database Integration (Production)

The current implementation uses a static products array and logs orders to the console.
For production, integrate a database (e.g., MongoDB, PostgreSQL with Prisma):
Store products in a products collection/table.
Store orders in an orders collection/table with fields: id, customerName, email, address, productId, paymentStatus.
Update api/create-order.ts to save orders to the database.
Update api/check-payment.ts to fetch productId from the database.



Security Considerations

Environment Variables: Store sensitive data (CASHFREE_SECRET_KEY) in Vercel environment variables, not in code.
Webhook Security: Verify Cashfree webhook signatures using the provided secret key.
Input Validation: Add robust validation for checkout form inputs.
Error Handling: Implement comprehensive error handling and logging (e.g., Sentry).
HTTPS: Ensure all API calls use HTTPS (handled by Vercel).

Future Enhancements

Add user authentication for secure access to purchased eBooks.
Implement a cart system for multiple product purchases.
Add admin panel for managing products and orders.
Support additional payment methods via Cashfree.
Implement email notifications for order confirmation and eBook access.

Troubleshooting

Payment Issues: Verify Cashfree credentials and ensure production mode is enabled.
Deployment Errors: Check Vercel logs for missing environment variables or build issues.
Webhook Failures: Ensure the webhook URL is publicly accessible and configured in Cashfree.

License
MIT License
