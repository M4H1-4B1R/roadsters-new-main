"use client";
import { Category, Product } from "@/types";
import ProductRecommendationsSection from "../ProductRecommendationsSection";
import ProductDescription from "./ProductDescription";
import ProductGallery from "./ProductGallery";
import { useTranslations } from "next-intl";

interface ProductDetailsLayoutProps {
  product: Product;
  category?: Category;
}

export default function ProductDetailsLayout({
  product,
  category,
}: ProductDetailsLayoutProps) {
  const ProductDetails = useTranslations("ProductDetails");

  return (
    <div>
      {/* Product Details Section */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-12 pt-30">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Gallery on left */}
          <ProductGallery product={product} />

          {/* Description on right */}
          <ProductDescription product={product} category={category} />
        </div>
      </section>

      {/* Recommendations Section */}
      {product.related_products && product.related_products.length > 0 && (
        <ProductRecommendationsSection
          title="Everyday-Classics"
          products={product.related_products}
        />
      )}
    </div>
  );
}
