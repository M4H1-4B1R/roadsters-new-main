"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BannerResponse } from "@/types";
import HeroCarouselItem from "./HeroCarouselItem";

interface HeroSectionProps {
  banners?: BannerResponse;
}

export default function HeroSection({ banners }: HeroSectionProps) {
  return (
    <section className="relative">
      <Carousel dir="ltr" className="relative" opts={{ loop: true }}>
        <CarouselContent>
          {banners?.map((banner) => {
            if (banner.is_active)
              return (
                <CarouselItem key={banner.id}>
                  <HeroCarouselItem BannerItem={banner} />
                </CarouselItem>
              );
          })}
        </CarouselContent>

        {/* Previous Button */}
        <CarouselPrevious className="absolute md:flex hidden h-12 w-12 left-8 top-1/2 -translate-y-1/2 z-20" />

        {/* Next Button */}
        <CarouselNext className="absolute md:flex hidden h-12 w-12 right-8 top-1/2 -translate-y-1/2 z-20" />
      </Carousel>
    </section>
  );
}
