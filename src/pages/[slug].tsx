import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import PageLayout from "~/layouts/PageLayout";
import PostInifiniteFeed from "~/components/Posts/PostInifiniteFeed";

const ProfileFeed = (props: { profileId: string }) => {
  const posts = api.post.infiniteProfilePostFeed.useInfiniteQuery(
    {
      profileId: props.profileId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div id="scrollablePanel" className="h-96 grow flex-col overflow-y-scroll">
      <PostInifiniteFeed
        posts={posts.data?.pages.flatMap((page) => page.posts)}
        isLoading={posts.isLoading}
        isError={posts.isError}
        hasMore={posts.hasNextPage}
        fetchNewPosts={posts.fetchNextPage}
        noPostMessage="User has no posts..."
        parentId="scrollablePanel"
      />
    </div>
  );
};

interface IPageProps {
  username: string;
}

const ProfilePage: NextPage<IPageProps> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative mt-14 h-36 bg-slate-600 sm:mt-0">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? "unknown"}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? "unknown"
        }`}</div>
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed profileId={data.id} />
      </PageLayout>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<IPageProps> = async (
  ctx
) => {
  const ssg = generateSSGHelper();

  const slug = ctx.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export default ProfilePage;
