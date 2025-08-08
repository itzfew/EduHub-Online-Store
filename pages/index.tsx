import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { GetStaticProps } from "next";
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
  // Generate random rating (4.0 to 4.9)
  const getRandomRating = () => (4 + Math.random() * 0.9).toFixed(1);

  // Select random products for trending slider and popular section
  const shuffledProducts = products.sort(() => Math.random() - 0.5);
  const trendingProducts = shuffledProducts.slice(0, Math.min(5, products.length));
  const popularProducts = shuffledProducts.slice(0, 6); // 6 for Popular section (3 per row, 2 rows)

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
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Navigation Bar */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="header-container">
          <div className="flex items-center justify-center space-x-3">
            <Image
              src="/logo.jpg" // Using public/logo.jpg
              alt="EduHub Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold">EduHub Online Store</h1>
          </div>
        </div>
        <nav className="nav-links">
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
        {/* Trending Products Slider */}
        <section className="trending-slider">
          <div className="container mx-auto">
            <Slider {...sliderSettings}>
              {trendingProducts.map((product) => (
                <div key={product.id} className="px-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white product-name">
                      {product.name}
                    </span>
                    <Link href={`/product/${product.id}`}>
                      <button className="view-trending-btn">View</button>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </header>

      {/* Fresh Recommendations Section */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="section-heading">Fresh Recommendations</h2>
        <div className="grid grid-cols-2 gap-6">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="block">
              <div className="product-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="product-image w-full h-48 object-cover mb-4 rounded-md"
                />
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2 product-name">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <p className="text-xl font-bold text-black">{product.price.toFixed(0)} ₹</p>
                  <span className="rating-box bg-green-500 text-white text-sm font-medium px-2 py-1 rounded">
                    🌟 {getRandomRating()}
                  </span>
                </div>
                <button className="view-details-btn">View Details</button>
              </div>
            </Link>
          ))}
        </div>

        {/* Popular Products Section */}
        <h2 className="section-heading mt-10">Popular Products</h2>
        <div className="grid grid-cols-3 gap-6">
          {popularProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="block">
              <div className="popular-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="product-image w-full h-48 object-cover mb-4 rounded-md"
                />
                <button className="view-details-btn">View</button>
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
