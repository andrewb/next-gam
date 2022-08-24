import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import AdManager from "../components/AdManager";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Next.js + GAM demo</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AdManager>
        <Component {...pageProps} />
      </AdManager>
    </>
  );
}

export default MyApp;
