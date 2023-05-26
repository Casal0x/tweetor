import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import PageLayout from "~/layouts/PageLayout";
import PostInifiniteFeed from "~/components/Posts/PostInifiniteFeed";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import { classNames } from "~/helpers/ClassNames";

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

const FollowButton = ({
  userId,
  isFollowing,
  onClick,
  isLoading,
}: {
  userId: string;
  isFollowing: boolean;
  onClick: () => void;
  isLoading: boolean;
}) => {
  const { userId: currentUserId } = useAuth();

  if (!currentUserId || userId === currentUserId) return null;

  return (
    <button
      disabled={isLoading}
      className={classNames(
        "rounded-full px-4 py-1",
        isFollowing
          ? "bg-slate-500 hover:bg-slate-700"
          : "bg-blue-400 hover:bg-blue-300"
      )}
      onClick={onClick}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

interface IPageProps {
  username: string;
}

const ProfilePage: NextPage<IPageProps> = ({ username }) => {
  const router = useRouter();
  const trpcUtils = api.useContext();
  const { data: profile, error } = api.profile.getUserByUsername.useQuery({
    username,
  });

  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getUserByUsername.setData({ username }, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;

        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier,
        };
      });
    },
  });

  if (!profile || error) {
    router.push("/404").catch(console.error);
    return null;
  }

  return (
    <>
      <Head>
        <title>{profile.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={profile.profileImageUrl}
            alt={`${profile.username}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${profile.username}`}</div>
        <div className="flex w-full border-b border-slate-400">
          <div className="flex flex-grow items-center pl-2">
            {profile.postsCount} Posts - {profile.followersCount} Followers -{" "}
            {profile.followsCount} Following
          </div>
          <div className="flex flex-1 justify-end pb-2 pr-2">
            <FollowButton
              userId={profile.userId}
              isLoading={toggleFollow.isLoading}
              onClick={() => toggleFollow.mutate({ userId: profile.userId })}
              isFollowing={profile.isFollowing}
            />
          </div>
        </div>
        <ProfileFeed profileId={profile.id} />
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
