import React from "react";

const LeftSideBar: React.FC = () => {
  return (
    <div className="col-span-12 flex flex-col justify-between md:col-span-3">
      <div className="main-menu flex w-full flex-col pr-2">
        <div className="flex justify-end">Logo</div>
        <ul className="flex flex-col items-end">
          <li>Home</li>
          <li>Profile</li>
          <li>Github</li>
          <li>Link</li>
          <li>Link</li>
        </ul>
      </div>
      <div className="user-menu mb-4 flex w-full flex-row-reverse pr-2">
        User
      </div>
    </div>
  );
};

export default LeftSideBar;
