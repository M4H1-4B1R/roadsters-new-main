import React, { ReactNode } from "react";

export default function ProductsContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto md:flex-wrap md:justify-center no-scrollbar">
      {children}
    </div>
  );
}
