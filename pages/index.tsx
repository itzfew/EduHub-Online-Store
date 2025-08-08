import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import Slider to disable SSR
const Slider = dynamic(() => import("react-slick"), { ssr: false });

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
    <div className={`min-h-screen ${inter.className}`}>
      {/* Navigation Bar */}
      <header className="header">
        <div className="header-container">
          <div className="header-title">
            <Image
              src="/logo.jpg" // Using public/logo.jpg
              alt="EduHub Logo"
              width={40}
              height={40}
              className="header-logo"
            />
            <h1 className="header-title-text">EduHub Online Store</h1>
          </div>
        </div>
        <nav className="nav">
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
        <section className="trending">
          <div className="container">
            <Suspense fallback={<div className="trending-fallback">Loading...</div>}>
              <Slider {...sliderSettings}>
                {trendingProducts.map((product) => (
                  <div key={product.id} className="trending-slide">
                    <span className="trending-product-name">{product.name}</span>
                  </div>
                ))}
              </Slider>
            </Suspense>
          </div>
        </section>
      </header>

      {/* Fresh Recommendations Section */}
      <main className="main">
        <h2 className="section-heading">Fresh Recommendations</h2>
        <div className="product-grid product-grid-2">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="product-link">
              <div className="product-card">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="product-image"
                />
                <h3 className="product-name">{product.name}</h3>
                <div className="product-info">
                  <p className="product-price">{product.price.toFixed(0)}₹</p>
                  <span className="product-rating">🌟 {getRandomRating()}</span>
                </div>
                <button className="product-button">View Details</button>
              </div>
            </Link>
          ))}
        </div>

        {/* Popular Products Section */}
        <h2 className="section-heading">Popular Products</h2>
        <div className="product-grid product-grid-3">
          {popularProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="product-link">
              <div className="product-card">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="product-image"
                />
                <button className="product-button">View</button>
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
