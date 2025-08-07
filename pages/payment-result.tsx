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
}

export default function PaymentResult() {
  const router = useRouter();
  const { purchase_id, item_type } = router.query;
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
    if (!purchase_id || item_type !== "product") {
      setStatus("failed");
      toast.error("Invalid purchase details");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/check-payment?purchaseId=${purchase_id}`);
        const data = await response.json();
        if (data.success && data.status === "PAID") {
          setStatus("success");
          const foundProduct = products.find((p) => p.id === data.productId);
          setProduct(foundProduct || null);
          setTelegramLink(data.telegramLink || null);
        } else {
          setStatus("failed");
          toast.error(data.error || "Payment verification failed");
        }
      } catch (err: any) {
        setStatus("failed");
        toast.error("Failed to verify payment");
      }
    };

    if (products.length > 0) {
      checkPaymentStatus();
    }
  }, [purchase_id, item_type, products]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Payment Result</h1>
        </header>
        <main className="container mx-auto p-4">
          <p>Loading payment status...</p>
        </main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Payment Result</h1>
      </header>
      <main className="container mx-auto p-4">
        {status === "success" ? (
          <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-green-600">Payment Successful!</h2>
            <p className="mt-2">Thank you for your purchase.</p>
            {product?.type === "ebook" && product?.url && (
              <div className="mt-4">
                <p>Access your eBook here:</p>
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
              <div className="mt-4">
                <p>Join our Telegram community:</p>
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
            <Link href="/" className="mt-4 block text-blue-500 hover:underline">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-red-600">Payment Failed</h2>
            <p className="mt-2">Please try again or contact support.</p>
            <Link href="/" className="mt-4 block text-blue-500 hover:underline">
              Back to Home
            </Link>
          </div>
        )}
        <ToastContainer />
      </main>
    </div>
  );
}
