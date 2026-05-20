"use client";
import { ReactNode } from "react";
import { IconType } from "react-icons";

interface InputsContainerProps {
  title: string;
  icon?: IconType;
  children: ReactNode;
}

export default function InputsContainer({
  title,
  icon: Icon,
  children,
}: InputsContainerProps) {
  return (
    <div
      className="
        bg-white rounded-2xl shadow-sm border border-gray-100 w-full
        p-4 sm:p-6 lg:p-8               /* responsive padding */
      "
    >
      {/* Title + Icon */}
      <div
        className="
          flex items-center gap-2 font-bold text-[#1E1E1E]
          text-xl sm:text-2xl lg:text-3xl    /* responsive text size */
          mb-4 sm:mb-6                       /* responsive spacing */
        "
      >
        {Icon && <Icon className="text-[#1E1E1E] text-xl sm:text-2xl" />}
        {title}
      </div>

      {/* Children */}
      <div className="space-y-3 sm:space-y-4 lg:space-y-5">
        {children}
      </div>
    </div>
  );
}
