import Link from "next/link";
import React, { Fragment } from "react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { useClerk, useUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";

type Props = {
  username?: string;
};

const UserButton = ({
  username,
  user,
}: {
  username: string;
  user: UserResource;
}) => {
  const { signOut } = useClerk();
  const handleSignOut = () => {
    signOut().catch(console.log);
  };
  return (
    <Menu as="div" className="relative inline-block">
      <div>
        <Menu.Button className="group flex rounded-full px-3 py-3 hover:bg-slate-300/50">
          <div className="relative mr-2 flex h-14 w-14">
            <Image
              src={user.profileImageUrl}
              alt={`@${username}`}
              fill
              sizes="100vw"
              className="rounded-full"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          <div className="mr-2 flex flex-col items-start justify-center">
            <div className="group-hover:text-white">@{username}</div>
            <div className="text-gray-400/80 group-hover:text-white/60">
              {user.fullName}
            </div>
          </div>
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
        <Menu.Items className="absolute mt-2 w-56 origin-top-right -translate-y-48 translate-x-20 divide-y divide-gray-100 rounded-md bg-slate-900 shadow-lg ring-1 ring-white ring-opacity-10 focus:outline-none">
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
  );
};

const DesktopMenu = ({ username }: Props) => {
  const { user } = useUser();

  return (
    <nav className="col-span-12 flex flex-col items-end justify-between md:col-span-3">
      <div className="main-menu flex w-1/2 flex-col pr-2">
        <Link href="/">
          <i className="fa-solid fa-kiwi-bird p-4 pl-0 text-4xl" />
        </Link>

        <ul className="mt-4 flex flex-col">
          <li className="mb-3">
            <Link
              className="flex items-center text-xl transition  duration-500 ease-in-out hover:text-indigo-400"
              href="/"
            >
              <i className="fa-solid fa-house mr-3"></i>
              <span className="pt-1">Home</span>
            </Link>
          </li>

          {username && (
            <li className="mb-3">
              <Link
                className="flex items-center text-xl transition  duration-500 ease-in-out hover:text-indigo-400"
                href={`/@${username}`}
              >
                <i className="fa-solid fa-user mr-3"></i>
                <span className="pt-1">Profile</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
      {username && user && (
        <div className="user-menu mb-4 flex w-full flex-row-reverse pr-2">
          <UserButton username={username} user={user} />
        </div>
      )}
    </nav>
  );
};

export default DesktopMenu;
