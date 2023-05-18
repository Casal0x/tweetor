import React from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import LoadingSpinner from "~/components/Base/LoadingSpinner";

const CreatePostWizzard: React.FC = () => {
  const { user } = useUser();
  const { data: profile } = api.profile.getProfileById.useQuery();

  const [content, setContent] = React.useState("");
  const ctx = api.useContext();

  const { mutate, isLoading } = api.post.createPost.useMutation({
    async onSuccess() {
      setContent("");
      await ctx.post.infinitePostFeed.invalidate();
    },
    onError(error) {
      console.log(error);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content) return;
    if (user?.id) {
      mutate({ content });
    }
  };

  if (!user || !profile) return null;

  return (
    <div className="mx-6 my-6 flex w-full pt-10 sm:pt-0 ">
      <div className="relative h-20 w-20">
        <Link href={`@${profile.username}`}>
          <Image
            src={profile.profileImageUrl}
            className="mt-2 cursor-pointer rounded-full"
            alt={`@${profile?.username || "unknown"}'s profile picture`}
            width={130}
            height={130}
          />
        </Link>
      </div>

      <form onSubmit={onSubmit} className="flex h-full w-full flex-col">
        <input
          className="mb-2 ml-3 h-20 w-full border-b-2 border-slate-500/50 bg-transparent text-2xl text-white outline-none"
          type="text"
          placeholder="Type your message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex">
          <button
            className="ml-auto rounded bg-violet-500 px-4 py-2 font-bold text-white hover:bg-violet-600 disabled:cursor-default disabled:bg-violet-400 disabled:hover:bg-violet-400"
            type="submit"
            disabled={!(content.length > 0) || isLoading}
          >
            {!isLoading ? (
              <>
                Send <i className="fa-regular fa-paper-plane"></i>
              </>
            ) : (
              <span className="flex">
                <LoadingSpinner /> <span className="ml-2">Posting...</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostWizzard;
