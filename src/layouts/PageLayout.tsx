import React from "react";
import LeftSideBar from "~/components/Menus/LeftSideBar";
import { api } from "~/utils/api";

interface IProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<IProps> = ({ children }) => {
  const { data } = api.profile.getProfileById.useQuery();

  return (
    <main className="mt-14 grid min-h-screen grid-cols-12 text-white sm:mt-0">
      <LeftSideBar username={data?.username} />

      <div className="col-span-12 flex flex-col border-x-2 border-x-slate-500/25 md:col-span-6">
        {children}
      </div>
      <div className="col-span-12 hidden sm:block md:col-span-3"></div>
    </main>
  );
};

export default PageLayout;
