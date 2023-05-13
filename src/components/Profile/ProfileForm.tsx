import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
const usernameRegex = /^[a-zA-Z0-9]+$/;

const ProfileForm: React.FC = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { mutate } = api.profile.setProfile.useMutation();
  const utils = api.useContext();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username && usernameRegex.test(username)) {
      mutate(
        { username, profileImageUrl: user?.profileImageUrl || "" },
        {
          async onSuccess() {
            await utils.profile.getProfileById.invalidate();
            await router.push("/");
          },
        }
      );
    }
  };

  const handleSignOut = async () => {
    console.log("signing out");
    try {
      await signOut();
      await router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setUsername(value);
    if (value.length > 0) {
      usernameRegex.test(value)
        ? setError("")
        : setError(
            "Username must be alphanumeric, and cannot contain spaces or special characters."
          );
    } else {
      setError("");
    }
  };
  return (
    <div className="flex h-screen w-screen flex-col items-center pt-6 ">
      <h3 className="text-4xl">Almost there!</h3>
      <form onSubmit={handleSubmit}>
        <div className="my-8 w-96">
          <input
            className={`h-16 w-96 rounded-xl border-2 border-white/50 bg-transparent p-4 text-2xl text-white placeholder-white placeholder-opacity-50 outline-none${
              error.length > 0 ? " border-red-600/50" : ""
            }`}
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Select your username"
          />
          {error && (
            <p className="pt-1 text-sm font-medium text-red-600/90">{error}</p>
          )}
        </div>
        <div className="flex w-full justify-end">
          <button
            className="text-m mr-4 rounded-xl border-2 border-white/50 bg-transparent px-4 py-2 text-white placeholder-opacity-50 outline-none hover:bg-white hover:text-black"
            onClick={() => {
              handleSignOut().catch(console.error);
            }}
          >
            Cancel
          </button>
          <button
            className="text-l items-center rounded-md bg-violet-500 px-6 py-2 text-white hover:bg-violet-900 disabled:bg-violet-300 disabled:hover:bg-violet-300"
            type="submit"
            disabled={!username || error.length > 0}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
