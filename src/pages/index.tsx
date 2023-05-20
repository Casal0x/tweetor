import { useUser } from "@clerk/nextjs";
import type { GetServerSideProps, NextPage } from "next";
import CreatePostWizzard from "~/components/Posts/CreatePostWizzard";
import PostInifiniteFeed from "~/components/Posts/PostInifiniteFeed";
import PageLayout from "~/layouts/PageLayout";
import { api } from "~/utils/api";

interface IProps {
  deviceType: "mobile" | "desktop";
}

const Home: NextPage<IProps> = ({ deviceType }) => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return null;

  return (
    <PageLayout deviceType={deviceType}>
      <div className="w-100  flex border-b-2  border-y-slate-500/50">
        {!isSignedIn ? (
          <div className="p-4 text-2xl"> # Explore </div>
        ) : (
          <CreatePostWizzard />
        )}
      </div>

      <RecentPosts />
    </PageLayout>
  );
};

function RecentPosts() {
  const posts = api.post.infinitePostFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <PostInifiniteFeed
      posts={posts.data?.pages.flatMap((page) => page.posts)}
      isLoading={posts.isLoading}
      isError={posts.isError}
      fetchNewPosts={posts.fetchNextPage}
      hasMore={posts.hasNextPage}
    />
  );
}

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
