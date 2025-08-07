import type { AppProps } from "next/app";
import "../styles/index.css";
import "../styles/checkout.css";
import "../styles/results.css";
import "../styles/products.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
