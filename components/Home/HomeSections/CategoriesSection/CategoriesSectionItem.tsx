"use client";
import { Category } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

interface CategoriesSectionItemProps {
  category: Category;
}

export default function CategoriesSectionItem({
  category,
}: CategoriesSectionItemProps) {
  const locale = useLocale();
  const t = useTranslations("Button");

  return (
    <Link href={`/categories/${category.slug}`} scroll={true}>
      <div
        className="
          w-full
          min-w-[260px] sm:min-w-[300px] md:min-w-[350px] 
          h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]
          flex flex-col justify-end items-center
          pb-10 sm:pb-12 md:pb-14
          cursor-pointer
          relative
          overflow-hidden
          group
        "
        style={{
          backgroundImage: category.image
            ? `linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 30%, transparent 60%), url(${category.image})`
            : undefined,
          backgroundColor: !category.image ? "#94a3b8" : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Category Name */}
        <h3 className="text-xl sm:text-2xl md:text-[28px] text-center text-white font-semibold mb-2">
          {locale === "ar" ? category.name_ar : category.name}
        </h3>

        {/* Shop Now Link - underlined style matching the design */}
        <span className="text-white text-sm sm:text-base font-light underline underline-offset-4 group-hover:opacity-80 transition-opacity">
          {t("ShopNow")}
        </span>
      </div>
    </Link>
  );
}
