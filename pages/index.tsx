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
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  // State for hamburger menu and search
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Toggle hamburger menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Truncate description to first 10 words
  const truncateDescription = (desc: string) => {
    const words = desc.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : desc;
  };

  // Generate random rating (4.0 to 4.9)
  const getRandomRating = () => (4 + Math.random() * 0.9).toFixed(1);

  // Filter products by search and category
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "All" || product.type === selectedCategory)
  );

  // Get unique categories
  const categories = ["All", ...new Set(products.map((product) => product.type))];

  // Select random products for trending slider and popular section
  const shuffledProducts = products.sort(() => Math.random() - 0.5);
  const trendingProducts = shuffledProducts.slice(0, Math.min(5, products.length));
  const popularProducts = shuffledProducts.slice(0, 4);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    appendDots: (dots: React.ReactNode) => (
      <div className="pb-4">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => <div className="w-2 h-2 bg-gray-400 rounded-full hover:bg-blue-600 transition" />,
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
      {/* Navigation Bar */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            EduHub Store
          </Link>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
            <Link href="/terms" className="nav-link">
              Terms
            </Link>
            <Link href="/refund" className="nav-link">
              Refund
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
            </div>
          </nav>
          <button className="md:hidden text-2xl" onClick={toggleMenu}>
            {isMenuOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
          </button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-blue-800 p-4 flex flex-col space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
            </div>
            <Link href="/contact" className="nav-link" onClick={toggleMenu}>
              Contact
            </Link>
            <Link href="/terms" className="nav-link" onClick={toggleMenu}>
              Terms
            </Link>
            <Link href="/refund" className="nav-link" onClick={toggleMenu}>
              Refund
            </Link>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Learning Journey</h1>
          <p className="text-lg md:text-xl mb-6">Explore our premium courses and resources tailored for success.</p>
          <Link href="#products" className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Trending Products Slider */}
      <section className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-6">Trending Products</h2>
          <Slider {...sliderSettings}>
            {trendingProducts.map((product) => (
              <div key={product.id} className="px-2">
                <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Image src={product.image} alt={product.name} width={80} height={80} className="rounded-md" />
                    <span className="text-base sm:text-lg font-medium truncate">{product.name}</span>
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <button className="view-trending-btn">
                      <i className="fas fa-eye mr-2"></i>View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Fresh Recommendations Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Fresh Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="block">
              <div className="product-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <h3 className="text-lg font-semibold text-gray-800 truncate text-center">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 text-center">{truncateDescription(product.description)}</p>
                <p className="text-lg font-bold text-blue-600 text-center">₹{product.price.toFixed(2)}</p>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i>
                  </span>
                  <span className="ml-2 text-gray-600 text-sm">({getRandomRating()})</span>
                </div>
                <button className="view-details-btn w-full">
                  <i className="fas fa-shopping-cart mr-2"></i>View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="container mx-auto px-4 py-8 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {popularProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="block">
              <div className="popular-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <button className="view-details-btn w-full">
                  <i className="fas fa-eye mr-2"></i>View
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">EduHub Store</h3>
              <p className="text-gray-400">Empowering learning with premium courses and resources.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400 transition">Terms</Link></li>
                <li><Link href="/refund" className="hover:text-blue-400 transition">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" className="text-2xl hover:text-blue-400 transition">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://twitter.com" target="_blank" className="text-2xl hover:text-blue-400 transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" className="text-2xl hover:text-blue-400 transition">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            &copy; {new Date().getFullYear()} EduHub Store. All rights reserved.
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
