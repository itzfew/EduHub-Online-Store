import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { GetStaticProps } from "next";
import { useState } from "react";
import Slider from "react-slick";


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
  // State for hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle hamburger menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Truncate description to first 10 words
  const truncateDescription = (desc: string) => {
    const words = desc.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : desc;
  };

  // Generate random rating (4.0 to 4.9)
  const getRandomRating = () => (4 + Math.random() * 0.9).toFixed(1);

  // Select random products for trending slider
  const trendingProducts = products
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(5, products.length));

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
      {/* Navigation Bar */}
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dealsbe - Software Deals</h1>
          <nav className="hidden md:flex space-x-6">
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
          <button className="md:hidden hamburger-btn" onClick={toggleMenu}>
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-blue-700 p-4 flex flex-col space-y-4">
            <Link href="/contact" className="nav-link" onClick={toggleMenu}>
              Contact
            </Link>
            <Link href="/terms" className="nav-link" onClick={toggleMenu}>
              Terms and Conditions
            </Link>
            <Link href="/refund" className="nav-link" onClick={toggleMenu}>
              Refund Policy
            </Link>
          </nav>
        )}
      </header>

      {/* Trending Products Slider */}
      <section className="bg-gray-800 text-white py-2">
        <div className="container mx-auto">
          <h2 className="text-lg font-semibold text-center mb-2">Trending Products</h2>
          <Slider {...sliderSettings}>
            {trendingProducts.map((product) => (
              <div key={product.id} className="px-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base truncate">{product.name}</span>
                  <Link href={`/product/${product.id}`}>
                    <button className="view-trending-btn">View</button>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">Fresh Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="block">
              <div className="product-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{truncateDescription(product.description)}</p>
                <p className="text-lg font-bold text-blue-600">₹{product.price.toFixed(2)}</p>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400">★★★★☆</span>
                  <span className="ml-2 text-gray-600 text-sm">({getRandomRating()})</span>
                </div>
                <button className="view-details-btn w-full">View Details</button>
              </div>
            </Link>
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
