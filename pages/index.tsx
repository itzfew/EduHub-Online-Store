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
}

// Initialize font
const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
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

export const getStaticProps: GetStaticProps = async () => {
  const products: Product[] = (await import("../data/products.json")).default;
  return {
    props: {
      products,
    },
  };
};
