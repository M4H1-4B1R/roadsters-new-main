"use client";
import { CategoriesResponse } from "@/types";
import CategoriesSectionItem from "../Home/HomeSections/CategoriesSection/CategoriesSectionItem";
import Image from "next/image";

interface CategoriesPageLayoutProps {
  categoriesResponse?: CategoriesResponse;
}

export default function CategoriesPageLayout({
  categoriesResponse,
}: CategoriesPageLayoutProps) {
  return (
    <>
      {/* Hero Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <Image
          src="/categ.png"
          alt="Categories"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Categories Grid */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-12">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categoriesResponse?.results.map((category) => (
            <CategoriesSectionItem key={category.id} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}
