import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { GetStaticProps } from "next";
import { useState } from "react";
import Slider from "react-slick";

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

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  const truncateDescription = (desc: string) => {
    const words = desc.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : desc;
  };

  const getRandomRating = () => (4 + Math.random() * 0.9).toFixed(1);

  const shuffledProducts = products.sort(() => Math.random() - 0.5);
  const trendingProducts = shuffledProducts.slice(0, Math.min(5, products.length));
  const popularProducts = shuffledProducts.slice(0, 4);
  const featuredProducts = shuffledProducts.slice(0, 8);

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
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Navigation Bar - Simplified without hamburger */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EduHub Online Store</h1>
          <nav className="flex space-x-6">
            <Link href="/contact" className="hover:text-blue-200 transition-colors font-medium">
              Contact
            </Link>
            <Link href="/terms" className="hover:text-blue-200 transition-colors font-medium">
              Terms
            </Link>
            <Link href="/refund" className="hover:text-blue-200 transition-colors font-medium">
              Refund Policy
            </Link>
          </nav>
        </div>
      </header>

      {/* Trending Products Slider */}
      <section className="bg-gray-800 text-white py-4 border-b-2 border-blue-500">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-4">🔥 Trending Now</h2>
          <Slider {...sliderSettings}>
            {trendingProducts.map((product) => (
              <div key={product.id} className="px-4">
                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                  <span className="text-sm sm:text-base font-medium truncate">{product.name}</span>
                  <Link href={`/product/${product.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition-colors font-medium">
                      View Offer
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Products Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t-2 border-blue-500"></div>
            <h2 className="text-2xl font-bold text-gray-800 mx-4">Featured Products</h2>
            <div className="flex-grow border-t-2 border-blue-500"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.id}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {truncateDescription(product.description)}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg font-bold text-blue-600">₹{product.price.toFixed(2)}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★★★★☆</span>
                          <span className="text-gray-500 text-sm">({getRandomRating()})</span>
                        </div>
                      </div>
                      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors">
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
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t-2 border-blue-500"></div>
            <h2 className="text-2xl font-bold text-gray-800 mx-4">Popular Choices</h2>
            <div className="flex-grow border-t-2 border-blue-500"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.id}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row h-full">
                    <div className="md:w-1/3 h-48 md:h-auto">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">₹{product.price.toFixed(2)}</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★★★★☆</span>
                          <span className="text-gray-500 text-sm">({getRandomRating()})</span>
                        </div>
                      </div>
                      <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors self-start">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t-2 border-blue-500"></div>
            <h2 className="text-2xl font-bold text-gray-800 mx-4">Shop By Category</h2>
            <div className="flex-grow border-t-2 border-blue-500"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {['E-books', 'Courses', 'Templates', 'Tools', 'Guides', 'Kits'].map((category) => (
              <Link key={category} href={`/category/${category.toLowerCase()}`}>
                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:bg-blue-50 transition-colors cursor-pointer border border-gray-200">
                  <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                    <span className="text-blue-600 text-2xl">📚</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 border-t-2 border-blue-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EduHub Store</h3>
              <p className="text-gray-300">Quality educational resources for students and professionals.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} EduHub Online Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
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
