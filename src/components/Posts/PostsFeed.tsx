import React from "react";
import { api } from "~/utils/api";
import LoadingSpinner from "../Base/LoadingSpinner";
import { PostView } from "./PostView";
import { useUser } from "@clerk/nextjs";

const PostsFeed: React.FC = () => {
  const {
    data,
    isLoading: postsLoading,
    isRefetching,
  } = api.post.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const postFeed = React.useRef<HTMLDivElement>(null);
  const profile = api.profile.getProfileById.useQuery();

  React.useEffect(() => {
    postFeed.current?.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [isRefetching]);

  if (postsLoading || isRefetching)
    return (
      <div className="mt-10 flex w-full justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!data) return <div>Something went wrong</div>;

  return (
    <div ref={postFeed} className="flex h-96 grow flex-col overflow-y-scroll">
      {data.map((fullPost) => (
        <PostView
          {...{ ...fullPost, profile: profile.data || null }}
          key={fullPost.post.id}
        />
      ))}
    </div>
  );
};

export default PostsFeed;
