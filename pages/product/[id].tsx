import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

interface ProductDetailProps {
  product: Product | null;
}

// Fake reviews
const fakeReviews = [
  "Thank you for this book, it really helped!",
  "Shukriya sir, iss se asaan ho gaya mujhe!",
  "Amazing content, highly recommend to everyone!",
  "This book changed my approach to coding!",
  "Very well-written, worth every penny!",
  "Super helpful, made learning so easy!",
  "Great resource for beginners and pros!",
  "Thank you for such an insightful book!",
  "Iss book ne meri coding skills improve ki!",
  "Fantastic guide, loved the examples!",
];

// Get 3 random reviews
const getRandomReviews = () => {
  const shuffled = fakeReviews.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [userRating, setUserRating] = useState<number>(0);
  const [randomRating, setRandomRating] = useState<string>("4.0");

  useEffect(() => {
    // Generate random rating (4.0 to 4.9)
    setRandomRating((4 + Math.random() * 0.9).toFixed(1));
    // Load user rating from local storage
    if (product) {
      const storedRating = localStorage.getItem(`rating_${product.id}`);
      if (storedRating) {
        setUserRating(parseInt(storedRating));
      }
    }
  }, [product]);

  const handleRating = (value: number) => {
    if (product) {
      setUserRating(value);
      localStorage.setItem(`rating_${product.id}`, value.toString());
      toast.success("Rating saved!");
    }
  };

  if (!product) {
    return <div className="text-center p-4">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Dealsbe - Software Deals</h1>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          Back to Products
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={400}
                className="w-full h-auto object-cover rounded-md mb-4"
              />
              {product.preview.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {product.preview.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-auto object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">₹{product.price.toFixed(2)}</p>
              <div className="flex items-center mb-4">
                <span className="text-yellow-400">★★★★☆</span>
                <span className="ml-2 text-gray-600">({randomRating})</span>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Rate this product:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleRating(value)}
                      className={`rating-star ${userRating >= value ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <Link
                href={`/checkout?productId=${product.id}&productName=${encodeURIComponent(
                  product.name
                )}&amount=${product.price}&telegramLink=${encodeURIComponent(product.telegramLink || "")}`}
              >
                <button className="purchase-btn">Purchase Now</button>
             obium

              </Link>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Reviews</h3>
            <div className="space-y-2">
              {getRandomReviews().map((review, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-md">
                  <p className="text-gray-600 italic">"{review}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ToastContainer />
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
