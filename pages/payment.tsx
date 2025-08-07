import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  url?: string;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  productId: string;
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
      setError("Invalid order");
      setLoading(false);
      return;
    }

    const initiatePayment = async () => {
      try {
        // Fetch order details (in production, query from database)
        // For demo, we'll assume order exists
        const order: Order = { id: orderId as string, customerName: "", email: "", address: "", productId: products[0].id };
        const product = products.find((p) => p.id === order.productId);

        if (!product) {
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
          window.location.href = data.paymentLink; // Redirect to Cashfree
        } else {
          setError("Failed to initiate payment");
          setLoading(false);
        }
      } catch (err) {
        setError("An error occurred");
        setLoading(false);
      }
    };

    initiatePayment();
  }, [orderId]);

  if (loading) {
    return <div>Loading payment...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Payment Error</h1>
        </header>
        <main className="container mx-auto p-4">
          <p className="text-red-500">{error}</p>
        </main>
      </div>
    );
  }

  return <div>Redirecting to payment...</div>;
}
