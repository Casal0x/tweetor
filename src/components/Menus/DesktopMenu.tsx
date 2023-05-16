import Link from "next/link";
import React from "react";
import { useUser } from "@clerk/nextjs";
import UserButton from "~/components/Base/UserButton";

type Props = {
  username?: string;
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
