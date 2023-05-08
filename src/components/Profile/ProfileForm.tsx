import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";

const ProfileForm: React.FC = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    console.log("signing out");
    try {
      await signOut();
      await router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <button
        onClick={() => {
          handleSignOut().catch(console.error);
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default ProfileForm;
