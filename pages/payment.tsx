import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

export default function Payment() {
  const router = useRouter();
  const { orderId } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      console.error("No orderId provided in payment page");
      setError("Invalid order");
      setLoading(false);
      return;
    }

    const initiatePayment = async () => {
      try {
        const product = products.find((p) => p.id === "1"); // Replace with actual order lookup in production
        if (!product) {
          console.error("Product not found for orderId:", orderId);
          setError("Product not found");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/initiate-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, productId: product.id, amount: product.price }),
        });

        const data = await response.json();
        if (data.paymentLink) {
          console.log(`Redirecting to payment link for orderId: ${orderId}`);
          window.location.href = data.paymentLink; // Redirect to Cashfree
        } else {
          console.error(`Payment initiation failed for orderId: ${orderId}`, data);
          setError(data.error || "Failed to initiate payment");
          setLoading(false);
        }
      } catch (err: any) {
        console.error(`Error initiating payment for orderId: ${orderId}`, err);
        setError("An error occurred: " + (err.message || "Unknown error"));
        setLoading(false);
      }
    };

    initiatePayment();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Processing Payment</h1>
        </header>
        <main className="container mx-auto p-4">
          <p>Loading payment...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Payment Error</h1>
        </header>
        <main className="container mx-auto p-4">
          <p className="text-red-500">{error}</p>
          <Link href={`/checkout?productId=1`} className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Try Again
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Redirecting</h1>
      </header>
      <main className="container mx-auto p-4">
        <p>Redirecting to payment...</p>
      </main>
    </div>
  );
}
