"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { Product, RelatedProduct } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductRecommendationsSectionProps {
  title: string;
  products: RelatedProduct[] | Product[];
}

export default function ProductRecommendationsSection({
  title,
  products,
}: ProductRecommendationsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm sm:text-base font-medium text-[#1E1E1E] tracking-[0.1em] uppercase">
          {title}
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
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
