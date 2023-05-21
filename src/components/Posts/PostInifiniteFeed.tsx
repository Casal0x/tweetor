import React from "react";
import LoadingSpinner from "../Base/LoadingSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { PostView } from "./PostView";

type Post = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  profile: { id: string; profileImageUrl: string | null; username: string };
};

type InfinitePostListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Post[];
  noPostMessage?: string;
  parentId?: string;
};

const PostInifiniteFeed = ({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore = false,
  noPostMessage = "No posts to show...",
  parentId,
}: InfinitePostListProps) => {
  if (isLoading)
    return (
      <div className="mt-10 flex w-full justify-center">
        <LoadingSpinner />
      </div>
    );
  if (isError) return <h1>Error...</h1>;

  if (posts == null || posts.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">
        {noPostMessage}
      </h2>
    );
  }
  return (
    <InfiniteScroll
      scrollableTarget={parentId}
      dataLength={posts.length}
      next={fetchNewPosts}
      hasMore={hasMore}
      loader={
        <div className="my-10 flex w-full justify-center">
          <LoadingSpinner />
        </div>
      }
      className="h-full"
    >
      {posts.map((post) => {
        return <PostView key={post.id} {...post} />;
      })}
    </InfiniteScroll>
  );
};

export default PostInifiniteFeed;
