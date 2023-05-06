import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "~/utils/api";

import { ClerkProvider } from "@clerk/nextjs";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Tweetor</title>
        <meta
          name="description"
          content="This is tweetor another tweeter clone as portfolio side-project"
        />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
