import { useUser } from "@clerk/nextjs";
import { Tab } from "@headlessui/react";
import type { NextPage } from "next";
import CreatePostWizzard from "~/components/Posts/CreatePostWizzard";
import PostInifiniteFeed from "~/components/Posts/PostInifiniteFeed";
import { classNames } from "~/helpers/ClassNames";
import PageLayout from "~/layouts/PageLayout";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return null;

  return (
    <PageLayout>
      <div className="w-100  flex border-b-2  border-y-slate-500/50">
        {!isSignedIn ? (
          <div className="p-4 py-16 text-2xl"> # Explore! </div>
        ) : (
          <CreatePostWizzard />
        )}
      </div>

      {isSignedIn && (
        <Tab.Group>
          <Tab.List className="flex w-full border-b-2 border-b-slate-500/50 text-2xl text-white">
            <Tab
              className={({ selected }) =>
                classNames(
                  "flex-grow py-5 outline-none",
                  selected ? "bg-slate-500/50" : "bg-transparent"
                )
              }
            >
              Explore
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "flex-grow py-5 outline-none",
                  selected ? "bg-slate-500/50" : "bg-transparent"
                )
              }
            >
              Following
            </Tab>
          </Tab.List>
          <Tab.Panels
            id="scrollablePanel"
            className="h-96 flex-grow overflow-y-scroll"
          >
            <Tab.Panel>
              <RecentPosts />
            </Tab.Panel>
            <Tab.Panel>
              <PostInfiniteFollowingFeed />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}

      {!isSignedIn && (
        <div id="scrollablePanel" className="h-96 flex-grow overflow-y-scroll">
          <RecentPosts />
        </div>
      )}
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
      parentId="scrollablePanel"
    />
  );
}

function PostInfiniteFollowingFeed() {
  const posts = api.post.infinitePostFeed.useInfiniteQuery(
    { onlyFollowing: true },
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
      parentId="scrollablePanel"
    />
  );
}

export default Home;
