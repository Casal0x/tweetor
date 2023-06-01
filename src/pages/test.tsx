import { Post } from "@prisma/client";
import { type NextPage } from "next";
import { type FC, useState, useEffect } from "react";
import { api } from "~/utils/api";

const test: NextPage = () => {
  return (
    <div className="flex min-h-screen justify-center text-white">
      <PaginatedComponent />
    </div>
  );
};

const PaginatedComponent: FC = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [data, setData] = useState<Post[]>([]);
  const posts = api.post.paginatedPostFeed.useInfiniteQuery(
    {
      page: pageIndex,
      pageSize: 2,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  );

  useEffect(() => {
    if (posts.data) {
      setData(posts.data.pages.flatMap((page) => page.posts));
    }
  }, [posts.data]);

  return (
    <div className="container">
      <div className="my-4 flex w-full flex-col">
        {data.map((post) => (
          <div key={post.id} className="border p-4">
            {post.content}
          </div>
        ))}
      </div>
      <div className="mt-6 flex w-full justify-end gap-2">
        <button
          className="rounded-xl border-2 px-4 py-2 hover:bg-slate-400/50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 1}
        >
          Previous
        </button>
        <button
          className="rounded-xl border-2 px-4 py-2 hover:bg-slate-400/50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!posts.hasNextPage}
          onClick={() => setPageIndex(pageIndex + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default test;
