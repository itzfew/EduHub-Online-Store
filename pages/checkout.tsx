import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock database (replace with real database in production)
const orders: {
  [key: string]: {
    purchaseId: string;
    productId: string;
    productName: string;
    amount: number;
    telegramLink: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    telegramUsername: string;
    customerAddress: string;
    paymentStatus: string;
    createdAt: string;
  };
} = {};

export default function Checkout() {
  const router = useRouter();
  const { productId, productName, amount, telegramLink } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    telegramUsername: "",
    customerAddress: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => console.log("Cashfree SDK loaded");
    document.body.appendChild(script);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.telegramUsername ||
      !formData.customerAddress
    ) {
      toast.error("Please fill in all fields.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (!/^\d{10}$/.test(formData.customerPhone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }
    if (!productId || !productName || !amount || !telegramLink) {
      toast.error("Missing required product information.");
      return false;
    }
    return true;
  };

  const saveUnpaidDetails = async () => {
    try {
      const purchaseId = `PURCHASE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      orders[purchaseId] = {
        purchaseId,
        productId: productId as string,
        productName: productName as string,
        amount: parseFloat(amount as string),
        telegramLink: telegramLink as string,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        telegramUsername: formData.telegramUsername,
        customerAddress: formData.customerAddress,
        paymentStatus: "unpaid",
        createdAt: new Date().toISOString(),
      };
      console.log("Unpaid product details saved:", orders[purchaseId]);
      return purchaseId;
    } catch (error) {
      console.error("Error saving unpaid product details:", error);
      toast.error("Failed to save form details.");
      return null;
    }
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const purchaseId = await saveUnpaidDetails();
    if (!purchaseId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          amount: parseFloat(amount as string),
          telegramLink,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          telegramUsername: formData.telegramUsername,
          customerAddress: formData.customerAddress,
          purchaseId,
          itemType: "product",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create payment order");
      }
      const { paymentSessionId, orderId } = data;
      if (!window?.Cashfree || !paymentSessionId) {
        throw new Error("Cashfree SDK not loaded or session missing");
      }
      const cashfree = window.Cashfree({ mode: "production" });
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-result?purchase_id=${purchaseId}&item_type=product`,
      });
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        telegramUsername: "",
        customerAddress: "",
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Dealsbe - Checkout</h1>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center sm:text-4xl">
            Product Checkout
          </h1>
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Enter Your Details</h2>
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (10 digits)
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234567890"
                  required
                />
              </div>
              <div>
                <label htmlFor="telegramUsername" className="block text-sm font-medium text-gray-700 mb-1">
                  Telegram Username
                </label>
                <input
                  type="text"
                  id="telegramUsername"
                  name="telegramUsername"
                  value={formData.telegramUsername}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="@username"
                  required
                />
              </div>
              <div>
                <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="customerAddress"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full address"
                  required
                />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Summary</h3>
                <p className="text-gray-600"><strong>Product:</strong> {productName}</p>
                <p className="text-gray-600"><strong>Amount:</strong> ₹{amount}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Proceed to Payment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </main>
    </div>
  );
}
