import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "~/utils/api";

import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";

import "~/styles/globals.css";
import ProfileGenerator from "~/helpers/ProfileGenerator";
import { type GetServerSideProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const MyApp: AppType = ({ Component, pageProps }) => {
  const profile = api.profile.getProfileById.useQuery();

  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Tweetor</title>
        <meta
          name="description"
          content="This is tweetor another twitter clone as portfolio side-project"
        />
      </Head>
      <div className="bg-gradient-to-b from-[#15162c] to-[#2e026d]">
        <SignedIn>
          <ProfileGenerator profile={profile}>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const ssg = generateSSGHelper();
  await ssg.profile.getProfileById.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default api.withTRPC(MyApp);
