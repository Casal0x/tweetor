import React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from "~/components/Base/LoadingSpinner";

interface ProfileGeneratorProps {
  children: React.ReactNode;
}

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({ children }) => {
  const router = useRouter();
  const { user } = useUser();

  if (user?.id && router.pathname !== "/profile/create") {
    const { data } = api.profile.getProfileById.useQuery({
      id: user.id,
    });
    if (!data) {
      router.push("/profile/create").catch(console.error);
    }
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingSpinner size={16} />
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default ProfileGenerator;
