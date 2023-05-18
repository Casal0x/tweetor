import { api } from "~/utils/api";

import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import relativeTime from "dayjs/plugin/relativeTime";
import { useUser } from "@clerk/nextjs";

dayjs.extend(relativeTime);

type PostViewProps = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  profile: { id: string; profileImageUrl: string | null; username: string };
};

export const PostView = ({
  id,
  content,
  createdAt,
  likeCount,
  likedByMe,
  profile,
}: PostViewProps) => {
  const { isSignedIn } = useUser();
  const trpcUtils = api.useContext();
  const { mutate } = api.post.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.post.infinitePostFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.posts.map((post) => {
                if (post.id === id) {
                  return {
                    ...post,
                    likeCount: post.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }

                return post;
              }),
            };
          }),
        };
      };

      trpcUtils.post.infinitePostFeed.setInfiniteData({}, updateData);
      trpcUtils.post.infinitePostFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.post.infiniteProfilePostFeed.setInfiniteData(
        { profileId: profile.id },
        updateData
      );
    },
  });

  const handleLike = () => {
    mutate({ postId: id });
  };

  return (
    <div key={id} className="flex gap-3 border-b border-slate-400/50 p-4">
      <Image
        src={profile.profileImageUrl || ""}
        className="h-14 w-14 rounded-full"
        alt={`@${profile?.username}'s profile picture`}
        width={56}
        height={56}
      />
      <div className="flex w-full flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${profile.username}`}>
            <span>{`@${profile.username} `}</span>
          </Link>
          <Link href={`/post/${id}`}>
            <span className="font-thin">{` · ${dayjs(
              createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <div>
          <span className="text-2xl">{content}</span>
        </div>
        <div className="flex w-full flex-row-reverse">
          {isSignedIn ? (
            <button
              onClick={handleLike}
              className="rounded-full px-1 hover:bg-pink-400/50"
            >
              <i
                className={`fa-solid fa-heart ${
                  likedByMe ? "text-red-500" : ""
                }`}
              />{" "}
              {likeCount}
            </button>
          ) : (
            <div>
              <i className="fa-solid fa-heart" /> {likeCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
