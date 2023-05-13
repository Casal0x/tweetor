import React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import LoadingSpinner from "~/components/Base/LoadingSpinner";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

interface ProfileGeneratorProps {
  children: React.ReactNode;
}

const ProfileGenerator = ({ children }: ProfileGeneratorProps) => {
  const router = useRouter();
  const { data, isFetching } = api.profile.getProfileById.useQuery();

  if (data && router.pathname === "/profile/create")
    router.push("/").catch(console.error);

  if (data || router.pathname === "/profile/create") return <>{children}</>;

  if (!isFetching) {
    if (!data && router.pathname !== "/profile/create") {
      router.push("/profile/create").catch(console.error);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner size={16} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
  const ssg = generateSSGHelper();

  const { userId } = getAuth(ctx.req);
  if (!userId) {
    // handle user is not logged in.
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  await ssg.profile.getProfileByUserId.prefetch({ userId });

  return { props: { ...buildClerkProps(ctx.req), trpcState: ssg.dehydrate() } };
};

export default ProfileGenerator;
