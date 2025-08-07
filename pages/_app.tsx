import type { AppProps } from "next/app";
import "../styles/index.css";
import "../styles/checkout.css";
import "../styles/results.css";
import "../styles/products.css";
import "../styles/home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
