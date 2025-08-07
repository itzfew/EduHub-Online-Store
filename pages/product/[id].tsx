import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
      toast.success("Rating saved!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  if (!product) {
    return <div className="text-center p-4 text-gray-600">Product not found</div>;
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
      {/* Navigation Bar */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EduHub Online Store</h1>
          <nav className="flex space-x-6">
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
            <Link href="/terms" className="nav-link">
              Terms and Conditions
            </Link>
            <Link href="/refund" className="nav-link">
              Refund Policy
            </Link>
          </nav>
        </div>
      </header>
      <main className="product-detail-container">
        <Link href="/" className="back-link">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Link>
        <div className="product-card">
          <div className="product-layout">
            <div className="lg:w-1/2">
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={400}
                className="product-main-image"
              />
              {product.preview.length > 0 && (
                <div className="preview-grid">
                  {product.preview.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={150}
                      className="preview-image"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="product-info">
              <h2 className="product-title">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">₹{product.price.toFixed(2)}</p>
              <div className="rating-container">
                <span className="star-rating">★★★★☆</span>
                <span className="rating-value">({randomRating})</span>
              </div>
              <div className="user-rating">
                <p className="rating-label">Rate this product:</p>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleRating(value)}
                      className={`rating-star ${
                        userRating >= value ? "text-yellow-400" : "text-gray-300"
                      }`}
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
              </Link>
            </div>
          </div>
          <div className="reviews-section">
            <h3 className="reviews-title">Customer Reviews</h3>
            <div className="review-list">
              {getRandomReviews().map((review, index) => (
                <div key={index} className="review-item">
                  <p className="review-text">"{review}"</p>
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
