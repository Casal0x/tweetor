import React from "react";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

interface IProps {
  deviceType: "mobile" | "desktop";
  username?: string;
}

const LeftSideBar: React.FC<IProps> = ({ deviceType, username }) => {
  return deviceType === "desktop" ? (
    <DesktopMenu username={username} />
  ) : (
    <MobileMenu username={username} />
  );
};

export default LeftSideBar;
