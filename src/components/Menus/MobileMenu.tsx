import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";

interface IProps {
  username?: string;
}

const MobileMenu = ({ username }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 w-full">
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
        <div className="fixed left-0 top-0 z-50 mr-5 flex h-full w-full flex-col items-start bg-gradient-to-b from-[#15162c] to-[#2e026d]">
          <div className="my-2 ml-4 h-8 text-2xl">
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
              <Link
                onClick={toggleMenu}
                href={`/@${username}`}
                className="px-4 py-2 hover:bg-gray-700"
              >
                <i className="fa-solid fa-user mr-3"></i>
                Profile
              </Link>
            )}
            <Link
              onClick={toggleMenu}
              href="/"
              className="px-4 py-2 hover:bg-gray-700"
            >
              <i className="fa-solid fa-right-from-bracket mr-2" />
              Log out
            </Link>
          </nav>
        </div>
      </Transition>
    </>
  );
};

export default MobileMenu;