"use client";
import CategoriesSection from "./HomeSections/CategoriesSection/CategoriesSection";
import HeroSection from "./HomeSections/HeroSection/HeroSection";
import Banner from "./HomeSections/banner/banner";
import {
  BannerResponse,
  CategoriesResponse,
  HomeSectionsResponse,
  SwiperResponse,
} from "@/types";
import Section from "../Section";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

interface HomeLayoutProps {
  banners?: BannerResponse;
  sections?: HomeSectionsResponse;
  categories: CategoriesResponse;
  swipers?: SwiperResponse;
}

export default function HomeLayout({
  banners,
  sections,
  categories,
  swipers,
}: HomeLayoutProps) {
  return (
    <main>
      <HeroSection banners={banners} />

      {/* Logo Swiper - Infinite Scrolling Marquee */}
      {swipers && swipers.length > 0 && (
        <div className="bg-[#F5F5F5] py-8 border-y border-gray-200 overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={60}
            slidesPerView={3}
            loop={true}
            speed={5000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              reverseDirection: false,
            }}
            allowTouchMove={false}
            breakpoints={{
              640: { slidesPerView: 4, spaceBetween: 50 },
              768: { slidesPerView: 5, spaceBetween: 60 },
              1024: { slidesPerView: 6, spaceBetween: 70 },
              1280: { slidesPerView: 7, spaceBetween: 80 },
            }}
            className="w-full max-w-7xl mx-auto px-4 swiper-linear"
          >
            {/* Repeat slides enough times that Swiper loop stays enabled even
               with few logos (loop disables itself below ~2x slidesPerView=7). */}
            {Array.from(
              { length: Math.ceil(16 / swipers.length) },
              () => swipers,
            )
              .flat()
              .map((swiper, index) => (
              <SwiperSlide
                key={`${swiper.id}-${index}`}
                className="flex items-center justify-center"
              >
                <div className="relative w-32 h-16">
                  {swiper.image && (
                    <Image
                      src={swiper.image}
                      alt={swiper.title || "Brand Logo"}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <CategoriesSection categories={categories} />
      {/* Other sections (not first) */}
      {sections
        ?.filter(
          (s) =>
            s.is_active && s.order !== 1 && s.products && s.products.length > 0,
        )
        .map((section) => (
          <Section key={section.id} first={false} section={section} />
        ))}
      {/* First section appears last */}
      {sections
        ?.filter(
          (s) =>
            s.is_active && s.order === 1 && s.products && s.products.length > 0,
        )
        .map((section) => (
          <Section key={section.id} first={true} section={section} />
        ))}
    </main>
  );
}
