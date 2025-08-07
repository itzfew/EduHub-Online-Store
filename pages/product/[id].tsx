import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";

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
}

interface ProductDetailProps {
  product: Product | null;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Dealsbe - Software Deals</h1>
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
          <p className="text-lg font-bold mb-4">₹{product.price.toFixed(2)}</p>
          <Link
            href={`/checkout?productId=${product.id}&productName=${encodeURIComponent(
              product.name
            )}&amount=${product.price}&telegramLink=${encodeURIComponent(product.telegramLink || "")}`}
          >
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Purchase
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products: Product[] = (await import("../../data/products.json")).default;
  const paths = products.map((product) => ({
    params: { id: product.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const products: Product[] = (await import("../../data/products.json")).default;
  const product = products.find((p) => p.id === params?.id) || null;

  return {
    props: {
      product,
    },
  };
};
