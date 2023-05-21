import React from "react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

interface IProps {
  username?: string;
}

const LeftSideBar: React.FC<IProps> = ({ username }) => {
  return (
    <>
      <DesktopMenu username={username} />

      <MobileMenu username={username} />
    </>
  );
};

export default LeftSideBar;
