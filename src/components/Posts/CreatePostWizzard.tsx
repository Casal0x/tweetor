import React from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { api } from "~/utils/api";

const CreatePostWizzard: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [content, setContent] = React.useState("");
  const ctx = api.useContext();

  const { mutate } = api.post.createPost.useMutation({
    async onSuccess() {
      setContent("");
      await ctx.post.getAll.invalidate();
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

  const handleSignOut = () => {
    signOut().catch(console.log);
  };

  if (!user) return null;

  return (
    <div className="mx-6 my-6 flex w-full">
      <Menu as="div" className="relative inline-block">
        <div>
          <Menu.Button className="relative h-20 w-20">
            <Image
              src={user.profileImageUrl}
              alt={user.fullName || ""}
              fill
              sizes="100vw"
              className="rounded-full"
              style={{
                objectFit: "contain",
              }}
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-slate-900 shadow-lg ring-1 ring-white ring-opacity-10 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={`/profile/${user.id}`}
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-white"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <i className="fa-regular fa-user mr-2" />
                    ) : (
                      <i className="fa-regular fa-user mr-2" />
                    )}
                    Profile
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={`/profile/settings`}
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-white"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {active ? (
                      <i className="fa-solid fa-gear mr-2" />
                    ) : (
                      <i className="fa-solid fa-gear mr-2" />
                    )}
                    Settings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-white"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={handleSignOut}
                  >
                    {active ? (
                      <i className="fa-solid fa-right-from-bracket mr-2" />
                    ) : (
                      <i className="fa-solid fa-right-from-bracket mr-2" />
                    )}
                    Log out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

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
            disabled={!(content.length > 0)}
          >
            Send <i className="fa-regular fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostWizzard;
