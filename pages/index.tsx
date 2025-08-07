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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Truncate text functions
  const truncateDescription = (desc: string, wordCount = 10) => {
    const words = desc.split(" ");
    return words.length > wordCount 
      ? words.slice(0, wordCount).join(" ") + "..." 
      : desc;
  };

  const getRandomRating = () => (4 + Math.random() * 0.9).toFixed(1);

  // Select random products for sections
  const trendingProducts = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
  const popularProducts = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

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
    centerMode: true,
    centerPadding: '0px'
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Navigation Bar */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold md:text-2xl">EduHub Online Store</h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/contact" className="text-white hover:text-blue-200 transition-colors duration-200">
                Contact
              </Link>
              <Link href="/terms" className="text-white hover:text-blue-200 transition-colors duration-200">
                Terms
              </Link>
              <Link href="/refund" className="text-white hover:text-blue-200 transition-colors duration-200">
                Refund Policy
              </Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700 pb-4 px-4">
            <div className="space-y-2">
              <Link 
                href="/contact" 
                className="block px-3 py-2 rounded-md text-white hover:bg-blue-600 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link 
                href="/terms" 
                className="block px-3 py-2 rounded-md text-white hover:bg-blue-600 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Terms
              </Link>
              <Link 
                href="/refund" 
                className="block px-3 py-2 rounded-md text-white hover:bg-blue-600 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Refund Policy
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Trending Products Slider */}
      <section className="bg-gray-800 text-white py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-center mb-3">Trending Products</h2>
          <div className="max-w-2xl mx-auto">
            <Slider {...sliderSettings}>
              {trendingProducts.map((product) => (
                <div key={product.id} className="px-2">
                  <div className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3">
                    <span className="text-sm sm:text-base truncate flex-1">{product.name}</span>
                    <Link href={`/product/${product.id}`} className="ml-4">
                      <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Fresh Recommendations Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Fresh Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.id}`} className="block h-full">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <div className="relative pt-[100%] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {truncateDescription(product.description, 12)}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg font-bold text-blue-600">₹{product.price.toFixed(2)}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★★★★☆</span>
                          <span className="ml-1 text-gray-600 text-xs">({getRandomRating()})</span>
                        </div>
                      </div>
                      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Popular Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.id}`} className="block h-full">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <div className="relative pt-[100%] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                      <button className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200">
                        View Now
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
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
