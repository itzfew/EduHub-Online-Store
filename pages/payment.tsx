import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Payment() {
  const router = useRouter();
  const { purchaseId } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!purchaseId) {
      setError("Invalid purchase ID");
      setLoading(false);
      return;
    }

    const initiatePayment = async () => {
      try {
        const response = await fetch("/api/initiate-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purchaseId }),
        });

        const data = await response.json();
        if (data.paymentSessionId) {
          const cashfree = window.Cashfree({ mode: "production" });
          cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_self",
            returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-result?purchase_id=${purchaseId}&item_type=product`,
          });
        } else {
          setError(data.error || "Failed to initiate payment");
          setLoading(false);
        }
      } catch (err: any) {
        setError("An error occurred: " + (err.message || "Unknown error"));
        setLoading(false);
      }
    };

    // Load Cashfree SDK
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => {
      console.log("Cashfree SDK loaded");
      initiatePayment();
    };
    document.body.appendChild(script);
  }, [purchaseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Processing Payment</h1>
        </header>
        <main className="container mx-auto p-4">
          <p>Loading payment...</p>
        </main>
        <ToastContainer />
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
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </main>
        <ToastContainer />
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
      <ToastContainer />
    </div>
  );
}
