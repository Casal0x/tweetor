import { type Post } from "@prisma/client";
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
  const [count, setCount] = useState<number>(0);
  const [filter, setSetFilter] = useState<string>("");
  const pageSize = 2;
  const posts = api.post.paginatedPostFeed.useInfiniteQuery(
    {
      page: pageIndex,
      pageSize,
      where: filter
        ? {
            username: filter,
          }
        : undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
      keepPreviousData: true,
    }
  );

  //   useEffect(() => {
  //     if (posts.data) {
  //       console.log(
  //         Math.ceil(
  //           (posts.data.pages.flatMap((page) => page.count)[0] || 0) / pageSize
  //         )
  //       );
  //       // setData(posts.data.pages.flatMap((page) => page.posts));

  //       if (!count) {
  //         setCount(
  //           (posts.data.pages.flatMap((page) => page.count)[0] || 0) / pageSize
  //         );
  //       }
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [posts.data]);

  return (
    <div className="container">
      <div className="my-4 flex w-full flex-col">
        {posts?.data?.pages
          .flatMap((page) => page.posts)
          .map((post) => (
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
        <input
          type="number"
          value={pageIndex}
          onChange={(e) => {
            const value =
              parseInt(e.target.value) >
              (posts?.data?.pages.flatMap((page) => page.count)[0] || 0) /
                pageSize
                ? (posts?.data?.pages.flatMap((page) => page.count)[0] || 0) /
                  pageSize
                : parseInt(e.target.value) < 1
                ? 1
                : parseInt(e.target.value);

            setPageIndex(Math.ceil(value));
          }}
          max={Math.ceil(
            (posts?.data?.pages.flatMap((page) => page.count)[0] || 0) /
              pageSize
          )}
          min={1}
          className="w-24 rounded-xl border-2 px-4 py-2 text-black"
        />
      </div>
      <div>
        <button
          onClick={() => {
            filter ? setSetFilter("") : setSetFilter("Casal0x");
            setPageIndex(1);
          }}
        >
          {" "}
          Test Filter
        </button>
      </div>
    </div>
  );
};

export default test;
