import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Terms() {
  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Dealsbe - Terms and Conditions</h1>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Terms and Conditions</h2>
          <div className="text-gray-600 space-y-4">
            <section>
              <h3 className="text-lg font-semibold">1. Introduction</h3>
              <p>
                Welcome to Dealsbe, an online store offering software and digital products. By accessing or using our website, you agree to comply with these Terms and Conditions. If you do not agree, please do not use our services.
              </p>
            </section>
            <section>
              <h3 className="text-lg font-semibold">2. Use of Website</h3>
              <p>
                You agree to use Dealsbe for lawful purposes only. You may not use our website to engage in any activity that violates applicable laws or disrupts our services.
              </p>
            </section>
            <section>
              <h3 className="text-lg font-semibold">3. Product Purchases</h3>
              <p>
                All purchases of digital products (e.g., eBooks, software) are subject to our Refund Policy. Product descriptions, prices, and availability are subject to change without notice.
              </p>
            </section>
            <section>
              <h3 className="text-lg font-semibold">4. Intellectual Property</h3>
              <p>
                All content on Dealsbe, including text, images, and digital products, is owned by or licensed to us. You may not reproduce, distribute, or modify our content without permission.
              </p>
            </section>
            <section>
              <h3 className="text-lg font-semibold">5. Limitation of Liability</h3>
              <p>
                Dealsbe is not liable for any damages arising from the use of our website or products, including but not limited to direct, indirect, or consequential damages.
              </p>
            </section>
            <section>
              <h3 className="text-lg font-semibold">6. Contact</h3>
              <p>
                For questions or concerns, contact us at{" "}
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
