"use client";
import Button from "@/components/Button";
import { SwiperItem } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface MidHeroSectionProps {
  swipers?: SwiperItem[];
}

export default function MidHeroSection({ swipers = [] }: MidHeroSectionProps) {
  const t = useTranslations("Button");
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-swipe functionality
  useEffect(() => {
    if (swipers.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % swipers.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [swipers.length]);

  // Handle dot click
  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // If no swipers, show default content
  if (swipers.length === 0) {
    return (
      <section className="pt-[98px] pb-12">
        <div
          className="pt-[118px] pb-[72px] px-6 sm:px-12 md:px-20 lg:px-28 text-white"
          style={{ backgroundColor: "#7d7870" }}
        >
          <div className="mb-8 text-center md:text-left">
            <p className="text-2xl sm:text-3xl md:text-[42px] font-light">
              New drops you'll love—
            </p>
            <p className="text-3xl sm:text-4xl md:text-[42px] font-bold">
              shop the latest now.
            </p>
          </div>
          <div className="flex justify-center md:justify-start">
            <Button label={t("DiscoverNow")} variant="primary" onClick={() => { }} />
          </div>
        </div>
      </section>
    );
  }

  const currentSwiper = swipers[activeIndex];
  const title = locale === "ar"
    ? currentSwiper.title_ar ?? currentSwiper.title
    : currentSwiper.title;

  const subtitle = locale === "ar"
    ? currentSwiper.subtitle_ar ?? currentSwiper.subtitle
    : currentSwiper.subtitle;

  return (
    <section className="pt-[98px] pb-12">
      {/* Swiper Content */}
      <div
        className="pt-[118px] pb-[72px] px-6 sm:px-12 md:px-20 lg:px-28 text-white transition-all duration-700"
        style={{
          backgroundImage: currentSwiper?.image
            ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${currentSwiper.image})`
            : undefined,
          backgroundColor: !currentSwiper?.image ? "#7d7870" : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mb-8 text-center md:text-left">
          <p className="text-2xl sm:text-3xl md:text-[42px] font-light transition-opacity duration-500">
            {title}
          </p>
          <p className="text-3xl sm:text-4xl md:text-[42px] font-bold transition-opacity duration-500">
            {subtitle}
          </p>
        </div>
        <div className="flex justify-center md:justify-start">
          {currentSwiper?.link ? (
            <Link href={currentSwiper.link}>
              <Button label={t("DiscoverNow")} variant="primary" onClick={() => { }} />
            </Link>
          ) : (
            <Button label={t("DiscoverNow")} variant="primary" onClick={() => { }} />
          )}
        </div>
      </div>

      {/* Circle Indicators */}
      {swipers.length > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {swipers.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`
                rounded-full transition-all duration-300
                ${index === activeIndex
                  ? "w-8 h-3 bg-[#1E1E1E]"
                  : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
