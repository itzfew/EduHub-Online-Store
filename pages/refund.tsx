import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Refund() {
  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center"> Refund Policy</h1>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          
          <div className="text-gray-600 space-y-4">
            <section>
              <h3 className="text-lg font-semibold">1. Non-Refundable Digital Products</h3>
              <p>
                All purchases of digital products, including eBooks, software, and other digital content sold on Dealsbe, are final and non-refundable. Due to the nature of digital goods, we do not offer refunds or exchanges once the product has been delivered or accessed.
              </p>
            </section>
            <section>
              <h3 className="text-lg font-semibold">2. Exceptions</h3>
              <p>
                In rare cases, if you believe there was an error with your purchase (e.g., you did not receive the product or received the wrong product), please contact us within 7 days of purchase. We will investigate and, if applicable, provide a replacement or alternative solution at our discretion.
              </p>
            </section>
            <section>
              <h3 className="text-lg font-semibold">3. Contact</h3>
              <p>
                For support or inquiries regarding your purchase, contact us at{" "}
                <a href="mailto:itzme.eduhub.contact@gmail.com" className="text-blue-600 hover:underline">
                  itzme.eduhub.contact@gmail.com
                </a>.
              </p>
            </section>
          </div>
          <div className="mt-6 text-center">
            <Link href="/" className="text-red-600 font-bold underline hover:text-red-700">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
