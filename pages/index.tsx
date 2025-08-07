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
  // Truncate description to first 10 words
  const truncateDescription = (desc: string) => {
    const words = desc.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : desc;
  };

  // Generate random rating (4.0 to 4.9)
  const getRandomRating = () => (4 + Math.random() * 0.9).toFixed(1);

  // Select random products for trending slider and popular section
  const shuffledProducts = products.sort(() => Math.random() - 0.5);
  const trendingProducts = shuffledProducts.slice(0, Math.min(5, products.length));
  const popularProducts = shuffledProducts.slice(0, 4); // 4 for Popular section

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
  };

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

      {/* Trending Products Slider */}
      <section className="py-8 bg-gray-800 text-white">
        <div className="container mx-auto">
          <h2 className="section-heading">Trending Products</h2>
          <Slider {...sliderSettings}>
            {trendingProducts.map((product) => (
              <div key={product.id} className="px-4">
                <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <span className="text-base font-medium truncate">{product.name}</span>
                  <Link href={`/product/${product.id}`}>
                    <button className="trending-btn">View Product</button>
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Fresh Recommendations Section */}
      <section className="container mx-auto py-12">
        <h2 className="section-heading">Fresh Recommendations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="block">
              <div className="product-card bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
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
                  <span className="text-yellow-400">★★★★☆</span>
                  <span className="ml-2 text-gray-600 text-sm">({getRandomRating()})</span>
                </div>
                <button className="view-details-btn w-full">View Details</button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="bg-gray-200 py-12">
        <div className="container mx-auto">
          <h2 className="section-heading">Popular Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {popularProducts.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="block">
                <div className="popular-card bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover mb-4 rounded-md"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 truncate text-center">{product.name}</h3>
                  <button className="view-details-btn w-full">View Product</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
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
