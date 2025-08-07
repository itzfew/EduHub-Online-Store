import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  url?: string;
  telegramLink?: string;
  preview: string[];
}

// Payment interface based on Cashfree API response
interface Payment {
  payment_status: "SUCCESS" | "FAILED" | "USER_DROPPED" | "NOT_ATTEMPTED";
  cf_payment_id: number;
  order_id: string;
  product_id?: string; // Added to store productId if included in order
  telegram_link?: string; // Added to store telegramLink if included in order
}

export default function PaymentResult() {
  const router = useRouter();
  const { purchase_id, item_type, order_id } = router.query;
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [product, setProduct] = useState<Product | null>(null);
  const [telegramLink, setTelegramLink] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load products dynamically
    const loadProducts = async () => {
      try {
        const productsData: Product[] = (await import("../data/products.json")).default;
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load product data");
        setStatus("failed");
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!purchase_id || item_type !== "product" || !order_id) {
      setStatus("failed");
      toast.error("Invalid purchase details or missing order ID");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`https://api.cashfree.com/pg/orders/${order_id}`, {
          method: "GET",
          headers: {
            "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_APP_ID || "",
            "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
            "x-api-version": "2023-08-01",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data: Payment[] = await response.json();
        // Find the latest successful payment
        const successfulPayment = data.find((payment) => payment.payment_status === "SUCCESS");

        if (successfulPayment) {
          setStatus("success");
          // Assume product_id and telegram_link are stored in payment or order data
          // If not, you may need to map purchase_id to productId/telegramLink in a database
          const foundProduct = products.find((p) => p.id === (successfulPayment.product_id || ""));
          setProduct(foundProduct || null);
          setTelegramLink(successfulPayment.telegram_link || null);
        } else {
          setStatus("failed");
          toast.error("No successful payment found for this order");
        }
      } catch (err: any) {
        setStatus("failed");
        toast.error(`Failed to verify payment: ${err.message}`);
      }
    };

    if (products.length > 0) {
      checkPaymentStatus();
    }
  }, [purchase_id, item_type, order_id, products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Payment Result</h1>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {status === "loading" ? (
          <div className="text-center p-6">
            <p className="text-lg text-gray-600">Loading payment status...</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            {status === "success" ? (
              <>
                <h2 className="text-xl font-semibold text-green-600 mb-4">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
                {product?.type === "ebook" && product?.url && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">Access your eBook here:</p>
                    <a
                      href={product.url}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download eBook
                    </a>
                  </div>
                )}
                {telegramLink && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">Join our Telegram community:</p>
                    <a
                      href={telegramLink}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Telegram
                    </a>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-red-600 mb-4">Payment Failed</h2>
                <p className="text-gray-600 mb-4">Please try again or contact support.</p>
              </>
            )}
            <Link href="/" className="home-btn">
              Back to Home
            </Link>
          </div>
        )}
        <ToastContainer />
      </main>
    </div>
  );
}
