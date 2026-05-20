"use client";
import { Category, Product, RelatedProduct } from "@/types";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: RelatedProduct | Product;
  category?: Category;
}

// Helper function to extract hex colors from product variations
// Matches the structure used in ProductDetails/SizeSelector.tsx
function extractColorHexValues(product: Product | RelatedProduct): string[] {
  const colors: string[] = [];
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  // Only full Product type has variations
  if (!("variations" in product)) return colors;

  const fullProduct = product as Product;

  // Check variations array - structure: { name: "Color", options: [{name: "#hex", image?: "url"}] }
  if (fullProduct.variations && Array.isArray(fullProduct.variations)) {
    for (const variation of fullProduct.variations) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const variationObj = variation as any;
      const variationName = variationObj.name?.toLowerCase() || "";

      // Check if this is a color variation (name includes "color")
      if (variationName.includes("color") || variationName.includes("colour") || variationName.includes("لون")) {
        // Check options array
        if (variationObj.options && Array.isArray(variationObj.options)) {
          for (const option of variationObj.options) {
            // option.name is the hex color code
            const optionName = option?.name;
            if (optionName && typeof optionName === 'string' && hexRegex.test(optionName)) {
              if (!colors.includes(optionName)) {
                colors.push(optionName);
              }
            }
          }
        }

        // Also check values array (alternative structure)
        if (variationObj.values && Array.isArray(variationObj.values)) {
          for (const value of variationObj.values) {
            if (typeof value === 'string' && hexRegex.test(value)) {
              if (!colors.includes(value)) {
                colors.push(value);
              }
            }
          }
        }
      }
    }
  }

  return colors;
}

export default function ProductCard({ product, category }: ProductCardProps) {
  const locale = useLocale();

  // Get image URL from product - prioritize the main 'image' field (card image)
  const getImageUrl = () => {
    // Check direct image property FIRST - this is the main product card image
    if (product.image) {
      return product.image;
    }
    // Check primary_media - it's an object with {type, url, ...}
    if ("primary_media" in product && product.primary_media) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const media = product.primary_media as any;
      if (typeof media === 'string') {
        return media;
      }
      if (media.url) {
        return media.url;
      }
      if (media.thumbnail) {
        return media.thumbnail;
      }
    }
    // Check images array (for full Product type with images array)
    if ("images" in product && product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // Handle both string URLs and object format {id, image, ...}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return typeof firstImage === 'string' ? firstImage : (firstImage as any).image;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  // Check if product is out of stock
  const isOutOfStock = ('in_stock' in product && !product.in_stock) ||
    ('is_available' in product && product.is_available === false);

  // Check if there's a discount
  const hasDiscount = (product.discount_price && Number(product.discount_price) > 0) ||
    Number(product.base_price) !== product.final_price;

  // Extract color hex values
  const colorHexValues = extractColorHexValues(product);
  const displayColors = colorHexValues.slice(0, 2);
  const remainingColorsCount = colorHexValues.length - 2;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block group cursor-pointer"
      scroll={true}
    >
      {/* Image Box */}
      <div className="relative aspect-[3/4] bg-gray-100 mb-2 overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          />
        )}
      </div>

      {/* Color Swatches - Below Image, Right Aligned */}
      {colorHexValues.length > 0 && (
        <div className="flex items-center justify-end gap-1.5 mb-2">
          {displayColors.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-sm shadow-sm border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          {remainingColorsCount > 0 && (
            <span className="text-[10px] font-medium text-gray-500">
              +{remainingColorsCount}
            </span>
          )}
        </div>
      )}

      {/* Product Info - Centered */}
      <div className="text-center">
        {/* Product Name - Uppercase */}
        <p className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wide mb-1">
          {locale === "ar" ? product.name_ar ?? product.name : product.name}
        </p>

        {/* Price / Out of Stock */}
        {isOutOfStock ? (
          <p className="text-sm font-semibold text-red-600">
            Out of Stock
          </p>
        ) : (
          <div className="flex justify-center gap-2 items-center">
            {/* Show strikethrough base price if there's a valid discount */}
            {hasDiscount && (
              <p className="text-xs sm:text-sm line-through text-gray-400">
                ${product.base_price}
              </p>
            )}
            {/* Show final/discount price */}
            <p className="text-sm sm:text-base text-[#1E1E1E]">
              ${product.discount_price && Number(product.discount_price) > 0
                ? product.discount_price
                : product.final_price}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
