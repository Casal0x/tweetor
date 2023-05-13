import React from "react";
import { api } from "~/utils/api";
import LoadingSpinner from "../Base/LoadingSpinner";
import { PostView } from "./PostView";

const PostsFeed: React.FC = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();

  if (postsLoading)
    return (
      <div className="flex grow">
        <LoadingSpinner />
      </div>
    );

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex grow flex-col overflow-y-scroll">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

export default PostsFeed;
