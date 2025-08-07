import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Product interface (same as in index.tsx)
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  url?: string;
}

// Sample product data (same as in index.tsx)
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

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find((p) => p.id === id);
      setProduct(foundProduct || null);
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">E-Commerce Store</h1>
      </header>
      <main className="container mx-auto p-4">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Products
        </Link>
        <div className="bg-white p-6 rounded shadow mt-4">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full max-w-md h-auto object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>
          <Link href={`/checkout?productId=${product.id}`}>
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Purchase
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
