import type { AppProps } from "next/app";
import { Layout } from "~/layouts/Layout";
import "../styles/globals.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
