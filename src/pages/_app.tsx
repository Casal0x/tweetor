import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "~/utils/api";

import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";

import "~/styles/globals.css";
import ProfileGenerator from "~/helpers/ProfileGenerator";

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
      <div className="bg-gradient-to-b from-[#15162c] to-[#2e026d]">
        <SignedIn>
          <ProfileGenerator>
            <Component {...pageProps} />
          </ProfileGenerator>
        </SignedIn>
        <SignedOut>
          <Component {...pageProps} />
        </SignedOut>
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
