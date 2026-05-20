"use client";
import Link from "next/link";
import CategoriesSectionItem from "./CategoriesSectionItem";
import Button from "@/components/Button";
import { CategoriesResponse } from "@/types";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";  // Default Swiper styles
import "swiper/css/navigation";  // For navigation (optional)
import "swiper/css/pagination";  // For pagination (optional)


interface CategoriesSectionProps {
  categories: CategoriesResponse;
}

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  const t = useTranslations("Button");

  return (
    <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-20">
      {/* Section Header */}
      <div className="flex flex-col gap-4 mb-10 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1C1C] tracking-tight">
          Categories
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Step into a world of effortless sophistication—where every piece tells a story of heritage, intention, and impeccable taste
        </p>
      </div>

      {/* Swiper (Slider) */}
      <Swiper
        spaceBetween={4} // Space between items
        slidesPerView="auto" // Auto adjust slides to fit content width
        breakpoints={{
          640: {
            slidesPerView: 1, // 1 slide for small screens
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 2, // 2 slides on medium screens
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3, // 3 slides on large screens
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 3.25, // ~3/4 visible for larger screens
            spaceBetween: 4,
          },
        }}
        className="flex overflow-hidden"
      >
        {categories.results.map((category) => {
          if (category.featured)
            return (
              <SwiperSlide key={category.id}>
                <CategoriesSectionItem category={category} />
              </SwiperSlide>
            );
        })}
      </Swiper>

      {/* View All Link */}
      <div className="flex justify-center items-center mt-12">
        <Link
          href="/categories"
          scroll={true}
          className="text-[#1E1E1E] text-sm sm:text-base font-medium underline underline-offset-4 hover:text-gray-600 transition-colors"
        >
          {t("ViewAll")}
        </Link>
      </div>
    </section>
  );
}
