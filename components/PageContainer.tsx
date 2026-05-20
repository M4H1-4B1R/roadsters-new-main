"use client";
import { ReactNode } from "react";
import FilterButton from "./FilterButton";
import { CategoriesResponse } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

interface PageContainerProps {
  headerTitle?: string;
  description?: string;
  children: ReactNode;
  filters?: boolean;
  categories?: CategoriesResponse;
}

export default function PageContainer({
  headerTitle,
  description,
  filters = false,
  children,
  categories,
}: PageContainerProps) {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="mt-8 px-4 sm:px-8 mb-24">
      {/* Header */}
      <div className="text-center px-2">
        {headerTitle && (
          <p className="text-[#1E1E1E] text-3xl sm:text-4xl md:text-[42px] mb-2.5 font-bold">
            {headerTitle}
          </p>
        )}
        {description && (
          <p className="text-sm sm:text-base font-normal max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Filter + Tabs */}

      <div className="flex w-full gap-4 relative mt-10 sm:my-[54px] xl:items-center justify-between">
        {filters && (
          <div className="">
            <FilterButton />
          </div>
        )}

        {/* Categories */}
        {categories && (
          <div className="w-full text-[#1E1E1E] flex gap-4 flex-wrap sm:gap-[54px] justify-center text-base sm:text-lg overflow-x-auto no-scrollbar">
            {categories.results.map((category) => (
              <Link
                href={`/categories/${category.slug}`}
                key={category.id}
                className={`  ${
                  pathname === `/categories/${category.slug}`
                    ? "border-b font-medium"
                    : ""
                }  pb-[5px] cursor-pointer  border-black whitespace-nowrap`}
              >
                {locale === "ar" ? category.name_ar : category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* children */}
      <div>{children}</div>
    </div>
  );
}
