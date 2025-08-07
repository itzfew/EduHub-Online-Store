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

// Order interface for receipt
interface OrderDetails {
  order_id: string;
  productId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
}

export default function PaymentResult() {
  const router = useRouter();
  const { purchase_id, item_type, order_id } = router.query;
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [product, setProduct] = useState<Product | null>(null);
  const [telegramLink, setTelegramLink] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

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
    // Wait for router to be ready
    if (!router.isReady) {
      console.log("Router not ready, waiting...");
      return;
    }

    // Log query parameters for debugging
    console.log("Query params:", { purchase_id, item_type, order_id });

    if (!purchase_id || !item_type || !order_id) {
      console.warn("Missing query parameters:", { purchase_id, item_type, order_id });
      setStatus("failed");
      toast.error("Missing or invalid purchase details");
      return;
    }

    if (item_type !== "product") {
      console.warn("Invalid item_type:", item_type);
      setStatus("failed");
      toast.error("Invalid item type");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/verify-payment?order_id=${order_id}`);
        const data = await response.json();
        console.log("Verify payment response:", data);
        if (data.success && data.status === "PAID") {
          setStatus("success");
          const foundProduct = products.find((p) => p.id === data.productId);
          setProduct(foundProduct || null);
          setTelegramLink(data.telegramLink || null);
          // Store order details for receipt
          setOrderDetails({
            order_id: order_id as string,
            productId: data.productId,
            amount: 1, // Replace with actual amount from API if available
            customerName: "Waheed", // Replace with actual customer data
            customerEmail: "tsajktv@gmail.com",
            customerPhone: "7780858886",
            createdAt: new Date().toISOString(),
          });
          // Clear any previous error toasts
          toast.dismiss();
        } else {
          setStatus("failed");
          toast.error(data.error || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setStatus("failed");
        toast.error(`Failed to verify payment: ${err.message}`);
      }
    };

    if (products.length > 0) {
      checkPaymentStatus();
    }
  }, [router.isReady, purchase_id, item_type, order_id, products]);

  // Generate and download receipt as LaTeX PDF
  const handleDownloadReceipt = async () => {
    if (!orderDetails) {
      toast.error("Order details not available");
      return;
    }

    try {
      // Generate LaTeX content for receipt with table and digital signature
      const latexContent = `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{fontspec}
\\setmainfont{DejaVu Sans}
\\usepackage{fancyhdr}
\\usepackage{booktabs}
\\usepackage{array}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[C]{Payment Receipt}
\\fancyfoot[C]{\\thepage}
\\begin{document}
\\begin{center}
  \\textbf{\\Large Payment Receipt}\\\\
  \\vspace{0.5cm}
  EduHub Online Store\\\\
  \\vspace{0.2cm}
  \\small itzme.eduhub.contact@gmail.com
\\end{center}
\\vspace{0.5cm}
\\noindent
\\begin{tabular}{@{}>{\\bfseries}l p{4in}@{}}
  \\toprule
  Order ID & ${orderDetails.order_id} \\\\
  Product ID & ${orderDetails.productId} \\\\
  Amount & INR ${orderDetails.amount.toFixed(2)} \\\\
  Customer Name & ${orderDetails.customerName} \\\\
  Email & ${orderDetails.customerEmail} \\\\
  Phone & ${orderDetails.customerPhone} \\\\
  Date & ${new Date(orderDetails.createdAt).toLocaleDateString()} \\\\
  \\bottomrule
\\end{tabular}
\\vspace{0.5cm}
\\noindent
\\textbf{Digitally Signed}\\\\
EduHub Online Store\\\\
Date: ${new Date().toLocaleDateString()}
\\vspace{0.5cm}
\\noindent
Thank you for your purchase! For support, contact itzme.eduhub.contact@gmail.com.
\\end{document}
`;

      // Create a Blob for the LaTeX content
      const blob = new Blob([latexContent], { type: "text/latex" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt_${orderDetails.order_id}.tex`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      console.error("Failed to generate receipt:", error);
      toast.error("Failed to download receipt");
    }
  };

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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
            {status === "success" ? (
              <>
                <h2 className="text-xl font-semibold text-green-600 mb-4">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
                {(product?.type === "ebook" && product?.url) || telegramLink ? (
                  <div className="button-container flex justify-center gap-4 mb-4">
                    {product?.type === "ebook" && product?.url && (
                      <a
                        href={product.url}
                        className="action-btn ebook-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download eBook
                      </a>
                    )}
                    {telegramLink && (
                      <a
                        href={telegramLink}
                        className="action-btn telegram-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Telegram
                      </a>
                    )}
                  </div>
                ) : null}
                <div className="link-container flex justify-center gap-4 mt-4">
                  <Link href="/" className="home-link">
                    Back to Home
                  </Link>
                  <button onClick={handleDownloadReceipt} className="receipt-link">
                    Download Receipt
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-red-600 mb-4">Payment Failed</h2>
                <p className="text-gray-600 mb-4">Please try again or contact support.</p>
                <div className="link-container flex justify-center gap-4 mt-4">
                  <Link href="/" className="home-link">
                    Back to Home
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
        <ToastContainer autoClose={5000} limit={1} />
      </main>
    </div>
  );
}
