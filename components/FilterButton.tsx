"use client";

import { IoFilterOutline } from "react-icons/io5";
import { useTranslations } from "use-intl";

export default function FilterButton() {
  const t = useTranslations("Button");

  return (
    <button
      className="
        cursor-pointer
        flex items-center gap-1 
        border-[#D5D5D5] border-[0.5px] rounded-[2px]
        /* Mobile adjustments */
        sm:px-[13px] sm:py-[6.5px] sm:text-sm
        px-2 py-1 text-xs
        w-fit
      "
    >
      <IoFilterOutline className="sm:w-[18px] sm:h-[18px] w-3.5 h-3.5" />
      <p className="whitespace-nowrap">{t("Filter")}</p>
    </button>
  );
}
