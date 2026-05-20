"use client";
import { Category, Product } from "@/types";
import SizeSelector from "./SizeSelector";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ProductDescriptionProps {
  product: Product;
  category?: Category;
}

export default function ProductDescription({
  product,
  category,
}: ProductDescriptionProps) {
  const ProductDetails = useTranslations("ProductDetails");
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
    <div className="w-full lg:w-[45%]">
      {/* Product Title */}
      <h1 className="text-[#0A0A0A] font-semibold text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide mb-3">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-center gap-3 mb-8">
        {Number(product.base_price) > product.final_price && (
          <p className="text-gray-400 text-lg line-through">
            ${product.base_price}
          </p>
        )}
        <p className="text-[#0A0A0A] text-xl sm:text-2xl">
          ${product.final_price}
        </p>
      </div>

      {/* Size Selector (includes color, size options and add to cart) */}
      <div className="mb-8">
        <SizeSelector product={product} />
      </div>

      {/* Description Dropdown */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="w-full py-4 flex justify-between items-center text-left"
        >
          <span className="text-sm font-medium text-[#0A0A0A] uppercase tracking-wide">
            Description
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${isDescriptionOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isDescriptionOpen && (
          <div className="pb-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
