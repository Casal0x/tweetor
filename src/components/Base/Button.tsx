import React from "react";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
}

const colors = {
  primary: "bg-blue-500 hover:bg-blue-900 text-white",
  secondary: "bg-gray-500 hover:bg-gray-900 text-white",
  success: "bg-green-600 hover:bg-green-900 text-white",
  danger: "bg-red-500 hover:bg-red-900 text-white",
  warning: "bg-yellow-600 hover:bg-yellow-900 text-white",
  info: "bg-blue-500 hover:bg-blue-900 text-gray-700 hover:text-gray-400",
  light: "bg-gray-100 hover:bg-gray-300 text-gray-800",
  dark: "bg-gray-800 hover:bg-gray-900 text-white",
};

const Button: React.FC<IProps> = ({
  children,
  className = "",
  color = "primary",
  ...rest
}) => {
  return (
    <button
      className={`rounded px-3 py-2 ${colors[color]}${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
