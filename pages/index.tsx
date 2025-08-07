import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

// Define interfaces for Product
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

// Sample product data (replace with real data source in production)
const products: Product[] = [
  {
    id: "1",
    name: "eBook: Learn Programming",
    description: "Comprehensive guide to modern programming techniques.",
    price: 29.99,
    image: "/ebook.jpg",
    type: "ebook",
    url: "https://example.com/ebook-download.pdf",
    telegramLink: "https://t.me/learnprogramming",
  },
  {
    id: "2",
    name: "Physical Book",
    description: "Hardcover programming book.",
    price: 49.99,
    image: "/book.jpg",
    type: "physical",
    telegramLink: "https://t.me/booksupport",
  },
];

// Initialize font
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Dealsbe - Software Deals</h1>
      </header>
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Fresh Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover mb-2"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
              <Link href={`/product/${product.id}`}>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
