import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import PageLayout from "~/layouts/PageLayout";
import LoadingSpinner from "~/components/Base/LoadingSpinner";
import { PostView } from "~/components/Posts/PostView";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="h-96 grow flex-col overflow-y-scroll">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

interface IPageProps {
  username: string;
  deviceType: "mobile" | "desktop";
}

const ProfilePage: NextPage<IPageProps> = ({ username, deviceType }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout deviceType={deviceType}>
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
        <ProfileFeed userId={data.userId} />
      </PageLayout>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<IPageProps> = async (
  ctx
) => {
  const UA = ctx.req.headers["user-agent"] ?? "";

  const isMobile = Boolean(
    UA.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );
  const ssg = generateSSGHelper();

  const slug = ctx.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
      deviceType: isMobile ? "mobile" : "desktop",
    },
  };
};

export default ProfilePage;
