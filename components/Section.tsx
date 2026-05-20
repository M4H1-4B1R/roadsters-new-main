"use client";
import ProductsContainer from "./ProductsContainer";
import ProductCard from "./ProductCard";
import { HomeSection } from "@/types";
import Link from "next/link";
import { useLocale } from "use-intl";
import { ArrowRight } from "lucide-react";

interface SectionProps {
  section: HomeSection;
  first?: boolean;
}

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Section({ first, section }: SectionProps) {
  const locale = useLocale();

  // First section: Title on left, products on right (Swiper)
  if (first) {
    return (
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-20 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left side - Title & Navigation */}
          <div className="lg:w-[25%] flex flex-col justify-center gap-8 relative z-20">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-semibold text-[#1E1E1E] leading-tight">
              {locale === "ar" ? section.title_ar : section.title}
            </h2>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button className={`swiper-prev-${section.id} w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors`}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className={`swiper-next-${section.id} w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors`}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right side - Products (Swiper) */}
          <div className="lg:w-[75%] relative w-full">
            {/* Gradient Overlay - Fades into white on the left */}
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden lg:block" />

            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3 },
              }}
              navigation={{
                prevEl: `.swiper-prev-${section.id}`,
                nextEl: `.swiper-next-${section.id}`,
              }}
              className="!pl-4 lg:!pl-0"
            >
              {section.products.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    );
  }

  // Other sections: Header with "See more" link, 4-column product grid
  return (
    <section className="py-12 px-6 sm:px-8 md:px-12 lg:px-20">
      {/* Section header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm sm:text-base font-medium text-[#1E1E1E] tracking-[0.1em] uppercase">
          {locale === "ar" ? section.title_ar : section.title}
        </h2>
        <Link
          href="/products"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          See more
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Products grid - 4 columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {section.products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
