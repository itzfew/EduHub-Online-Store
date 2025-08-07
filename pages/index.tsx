import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { GetStaticProps } from "next";

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
  preview: string[];
}

// Initialize font
const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  // Truncate description to first 10 words
  const truncateDescription = (desc: string) => {
    const words = desc.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : desc;
  };

  // Generate random rating (4.0 to 4.9)
  const getRandomRating = () => (4 + Math.random() * 0.9).toFixed(1);

  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Dealsbe - Software Deals</h1>
      </header>
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-6 text-center">Fresh Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{truncateDescription(product.description)}</p>
              <p className="text-lg font-bold text-blue-600">₹{product.price.toFixed(2)}</p>
              <div className="flex items-center mb-4">
                <span className="text-yellow-400">★★★★☆</span>
                <span className="ml-2 text-gray-600 text-sm">({getRandomRating()})</span>
              </div>
              <Link href={`/product/${product.id}`}>
                <button className="view-details-btn">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products: Product[] = (await import("../data/products.json")).default;
  return {
    props: {
      products,
    },
  };
};
