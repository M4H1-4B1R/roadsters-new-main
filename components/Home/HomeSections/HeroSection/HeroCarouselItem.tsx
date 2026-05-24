"use client";

import { BannerItem } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

interface HeroCarouselItemProps {
  BannerItem: BannerItem;
}

export default function HeroCarouselItem({
  BannerItem,
}: HeroCarouselItemProps) {
  const locale = useLocale();
  const t = useTranslations("Button");

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="px-6 sm:px-12 md:px-20 lg:px-28 text-white w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] relative flex items-center"
      style={{
        backgroundImage: BannerItem.file
          ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${BannerItem.file})`
          : undefined,
        backgroundColor: !BannerItem.file ? "#6B6B6B" : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-[50%] sm:max-w-[45%] md:max-w-[40%]">
        {/* Title (if exists) */}
        {BannerItem.title && (
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-center lg:text-5xl font-semibold leading-tight mb-4">
            {locale === "ar"
              ? BannerItem.title_ar ?? BannerItem.title
              : BannerItem.title}
          </h1>
        )}

        {/* Subtitle (if exists) */}
        {BannerItem.subtitle && (
          <p className="text-base sm:text-lg md:text-xl mb-6 font-light">
            {locale === "ar"
              ? BannerItem.subtitle_ar ?? BannerItem.subtitle
              : BannerItem.subtitle}
          </p>
        )}

        {/* Underlined Link - same style as banner */}
        <Link
          href={BannerItem.link || "/products"}
          className="text-white text-sm sm:text-base font-normal underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          {t("DiscoverNow")}
        </Link>
      </div>
    </div>
  );
}
