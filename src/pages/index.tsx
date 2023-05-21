import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import CreatePostWizzard from "~/components/Posts/CreatePostWizzard";
import PostInifiniteFeed from "~/components/Posts/PostInifiniteFeed";
import PageLayout from "~/layouts/PageLayout";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return null;

  return (
    <PageLayout>
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

export default Home;
