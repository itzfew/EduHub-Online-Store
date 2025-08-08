import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { GetStaticProps } from "next";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaSearch, FaFilter, FaStar, FaArrowRight, FaArrowLeft, FaShoppingCart, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

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
  category: string;
}

// Initialize fonts
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

interface HomeProps {
  products: Product[];
}

export default function Home({ products }: HomeProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Toggle hamburger menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterProducts(query, selectedCategory);
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(searchQuery, category);
  };

  // Filter products based on search and category
  const filterProducts = (query: string, category: string) => {
    let filtered = products;
    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }
    if (category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }
    setFilteredProducts(filtered);
  };

  // Truncate description to first 10 words
  const truncateDescription = (desc: string) => {
    const words = desc.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : desc;
  };

  // Generate random rating (4.0 to 4.9)
  const getRandomRating = () => (4 + Math.random() * 0.9).toFixed(1);

  // Get unique categories
  const categories = ["All", ...new Set(products.map((product) => product.category))];

  // Select random products for trending slider
  const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
  const trendingProducts = shuffledProducts.slice(0, Math.min(5, products.length));

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
    nextArrow: <FaArrowRight className="text-white" />,
    prevArrow: <FaArrowLeft className="text-white" />,
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
      {/* Navigation Bar */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold tracking-tight">
            EduHub Store
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
              <Link href="/terms" className="nav-link">
                Terms
              </Link>
              <Link href="/refund" className="nav-link">
                Refund Policy
              </Link>
            </nav>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <button className="md:hidden hamburger-btn" onClick={toggleMenu}>
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-indigo-700 p-4 flex flex-col space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <Link href="/contact" className="nav-link" onClick={toggleMenu}>
              Contact
            </Link>
            <Link href="/terms" className="nav-link" onClick={toggleMenu}>
              Terms
            </Link>
            <Link href="/refund" className="nav-link" onClick={toggleMenu}>
              Refund Policy
            </Link>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Learning Journey</h1>
          <p className="text-lg md:text-xl mb-6">Explore our curated collection of educational resources.</p>
          <Link href="#products" className="inline-block bg-white text-indigo-600 font-semibold py-3 px-6 rounded-full hover:bg-indigo-100 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-gray-200">
        <div className="container mx-auto flex items-center justify-center gap-4 flex-wrap">
          <FaFilter className="text-indigo-600" />
          <h3 className="text-lg font-semibold">Filter by Category:</h3>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 hover:bg-indigo-100"
              } transition`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Products Slider */}
      <section className="bg-gray-800 text-white py-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-4">Trending Products</h2>
          <Slider {...sliderSettings}>
            {trendingProducts.map((product) => (
              <div key={product.id} className="px-4">
                <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <span className="text-sm sm:text-base truncate">{product.name}</span>
                  <Link href={`/product/${product.id}`}>
                    <button className="view-trending-btn flex items-center gap-2">
                      View <FaArrowRight />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Fresh Recommendations Section */}
      <main id="products" className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Fresh Recommendations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                <div className="hidden sm:block">
                  <p className="text-gray-600 text-sm mb-2 text-center">{truncateDescription(product.description)}</p>
                  <p className="text-lg font-bold text-indigo-600 text-center">₹{product.price.toFixed(2)}</p>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-yellow-400 flex">
                      {[...Array(4)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                      <FaStar className="text-gray-300" />
                    </span>
                    <span className="ml-2 text-gray-600 text-sm">({getRandomRating()})</span>
                  </div>
                </div>
                <button className="view-details-btn w-full flex items-center justify-center gap-2">
                  View Details <FaShoppingCart />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">EduHub Store</h3>
            <p className="text-gray-400">Empowering learning through quality educational resources.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/refund" className="text-gray-400 hover:text-white">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white"><FaFacebookF /></a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white"><FaTwitter /></a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white"><FaInstagram /></a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} EduHub Store. All rights reserved.
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
