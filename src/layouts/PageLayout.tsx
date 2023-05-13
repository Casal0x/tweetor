import React from "react";
import LeftSideBar from "~/components/Menus/LeftSideBar";

interface IProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<IProps> = ({ children }) => {
  return (
    <main className="grid min-h-screen grid-cols-12">
      <LeftSideBar />

      <div className="col-span-12 flex flex-col gap-2 border-x-2 border-x-slate-500/25 md:col-span-6 ">
        {children}
      </div>
      <div className="col-span-12 md:col-span-3">Feed</div>
    </main>
  );
};

export default PageLayout;
