"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const products = [
  { id: 1, src: "/product1.png", alt: "Cashmere Coat", title: "CASHMERE COAT", price: "$2,850" },
  { id: 2, src: "/product1.png", alt: "Silk Midi T-Shirt", title: "SILK MIDI T-SHIRT", price: "$1,950" },
  { id: 3, src: "/product1.png", alt: "Wool Blazer", title: "WOOL BLAZER", price: "$2,200" },
  { id: 4, src: "/product1.png", alt: "Tailored Trousers", title: "TAILORED TROUSERS", price: "$890" },
];

export default function BestSellerSection() {
  return (
    <section className="py-12 px-6 sm:px-8 md:px-12 lg:px-20">
      {/* Section header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-sm sm:text-base font-medium text-[#1E1E1E] tracking-[0.1em] uppercase">
          Ready-To-Wear
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
        {products.map((product) => (
          <Link href="/products" key={product.id} className="group">
            <div className="flex flex-col">
              {/* Product Image */}
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={product.src}
                  alt={product.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-600 tracking-wide uppercase mb-1">
                  {product.title}
                </p>
                <p className="text-sm sm:text-base text-[#1E1E1E]">
                  {product.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
