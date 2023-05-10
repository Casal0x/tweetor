import React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import LoadingSpinner from "~/components/Base/LoadingSpinner";

interface ProfileGeneratorProps {
  children: React.ReactNode;
}

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({ children }) => {
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

export default ProfileGenerator;
