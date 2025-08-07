import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  url?: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "eBook: Learn Programming",
    description: "Comprehensive guide to modern programming techniques.",
    price: 29.99,
    image: "/ebook.jpg",
    type: "ebook",
    url: "https://example.com/ebook-download.pdf",
  },
  {
    id: "2",
    name: "Physical Book",
    description: "Hardcover programming book.",
    price: 49.99,
    image: "/book.jpg",
    type: "physical",
  },
];

export default function PaymentResult() {
  const router = useRouter();
  const { orderId } = router.query;
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/check-payment?orderId=${orderId}`);
        const data = await response.json();
        if (data.status === "PAID") {
          setStatus("success");
          const product = products.find((p) => p.id === data.productId);
          setProduct(product || null);
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setStatus("failed");
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  if (status === "loading") {
    return <div>Loading payment status...</div>;
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
      </main>
    </div>
  );
}
