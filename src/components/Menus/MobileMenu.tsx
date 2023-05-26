import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import UserButton from "~/components/Base/UserButton";
import { SignInButton, useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/clerk-react";

interface IProps {
  username?: string;
}

const MobileMenu = ({ username }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 w-full bg-indigo-950 sm:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            className="text-2xl text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            <i className="fa-solid fa-bars" />
          </button>
          <span className="text-lg font-bold"></span>
          <div className="w-6"></div>
        </div>
      </div>

      <Transition
        as={Fragment}
        show={isOpen}
        enter="transition-opacity duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed left-0 top-0 z-50 mr-5 flex h-full w-full flex-col items-start bg-gradient-to-b from-[#15162c] to-[#2e026d] sm:hidden">
          <div className="flex h-full flex-col">
            <div className="my-2 ml-4 h-8 text-2xl text-white/50">
              <button onClick={toggleMenu}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <nav className="flex flex-col text-2xl font-bold text-white">
              <Link
                onClick={toggleMenu}
                href="/"
                className="px-4 py-2 hover:bg-gray-700"
              >
                <i className="fa-solid fa-house mr-3"></i>
                Home
              </Link>
              {username && (
                <>
                  <Link
                    onClick={toggleMenu}
                    href={`/@${username}`}
                    className="px-4 py-2 hover:bg-gray-700"
                  >
                    <i className="fa-solid fa-user mr-3"></i>
                    Profile
                  </Link>
                  <SignOutButton>
                    <button
                      onClick={toggleMenu}
                      className="px-4 py-2 hover:bg-gray-700"
                    >
                      <i className="fa-solid fa-right-from-bracket mr-2" />
                      Log out
                    </button>
                  </SignOutButton>
                </>
              )}
              {!username && (
                <SignInButton mode="modal">
                  <button
                    onClick={toggleMenu}
                    className="px-4 py-2 hover:bg-gray-700"
                  >
                    <i className="fa-solid fa-right-from-bracket mr-2" />
                    Sign In
                  </button>
                </SignInButton>
              )}
            </nav>
          </div>
          {username && user && (
            <div>
              <UserButton username={username} user={user} />
            </div>
          )}
        </div>
      </Transition>
    </>
  );
};

export default MobileMenu;
