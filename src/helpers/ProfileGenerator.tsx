import React from "react";
import type { api } from "~/utils/api";
import { useRouter } from "next/router";
import LoadingSpinner from "~/components/Base/LoadingSpinner";
import type { inferAsyncReturnType } from "@trpc/server";

interface ProfileGeneratorProps {
  children: React.ReactNode;
  profile: inferAsyncReturnType<typeof api.profile.getProfileById.useQuery>;
}

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({
  children,
  profile,
}) => {
  const router = useRouter();
  const { data, isFetching } = profile;

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

export default ProfileGenerator;
