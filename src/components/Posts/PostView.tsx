import { RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@clerk/nextjs";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["post"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const { user } = useUser();
  const { mutate } = api.post.toggleLike.useMutation();

  const handleLike = () => {
    mutate({ postId: post.id });
  };

  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400/50 p-4">
      <Image
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
      />
      <div className="flex w-full flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username} `}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <div>
          <span className="text-2xl">{post.content}</span>
        </div>
        <div className="flex w-full flex-row-reverse">
          {user?.id ? (
            <button
              onClick={handleLike}
              className="rounded-full px-1 hover:bg-pink-400/50"
            >
              <i className="fa-regular fa-heart" /> 0
            </button>
          ) : (
            <>
              <i className="fa-regular fa-heart" /> 0
            </>
          )}
        </div>
      </div>
    </div>
  );
};
