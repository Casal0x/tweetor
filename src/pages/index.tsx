import { SignInButton, useUser } from "@clerk/nextjs";
import type { GetServerSideProps, NextPage } from "next";
import CreatePostWizzard from "~/components/Posts/CreatePostWizzard";
import PostsFeed from "~/components/Posts/PostsFeed";
import PageLayout from "~/layouts/PageLayout";

interface IProps {
  deviceType: "mobile" | "desktop";
}

const Home: NextPage<IProps> = ({ deviceType }) => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return null;

  return (
    <PageLayout deviceType={deviceType}>
      <div className="w-100  flex border-b-2  border-y-slate-500/50">
        {!isSignedIn ? <SignInButton mode="modal" /> : <CreatePostWizzard />}
      </div>

      <PostsFeed />
    </PageLayout>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<IProps> = async (ctx) => {
  const UA = ctx.req.headers["user-agent"] ?? "";

  const isMobile = Boolean(
    UA.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );

  return {
    props: {
      deviceType: isMobile ? "mobile" : "desktop",
    },
  };
};

export default Home;
