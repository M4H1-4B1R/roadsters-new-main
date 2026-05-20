"use client";
import { useState } from "react";
import { X, ChevronDown, Minus, Plus } from "lucide-react";
import useCartStore from "@/hooks/useCartStore";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Category, ProductInCart } from "@/types";
import { useTranslations } from "next-intl";

interface CartItemProps {
  cartItem: ProductInCart;
  category?: Category;
}

export default function CartItem({
  cartItem,
  category,
}: CartItemProps) {
  const toasterTranslations = useTranslations("toaster");
  const { removeFromCart, decreaseQty, increaseQty, updateCartItemVariation } = useCartStore();

  const { id, slug, quantity, final_price: price, image, primary_media, selectedVariations } = cartItem;
  const displayImage = image || primary_media;

  const [openSizeDropdown, setOpenSizeDropdown] = useState(false);

  // Get the first variation value (e.g., color) for display
  const colorVariation = selectedVariations?.find(v =>
    v.name.toLowerCase().includes('color')
  );

  // Get the size variation
  const sizeVariation = selectedVariations?.find(v =>
    v.name.toLowerCase().includes('size')
  );

  const handleRemoveFromCartClick = () => {
    removeFromCart(id);
    toast(toasterTranslations("removedFromCart", { item: cartItem.name }));
  };

  const handleVariationChange = (variationName: string, newValue: string) => {
    if (updateCartItemVariation) {
      updateCartItemVariation(id, variationName, newValue, selectedVariations);
    }
    setOpenSizeDropdown(false);
  };

  // Get available options for a variation from the product's variations data
  const getVariationOptions = (variationName: string): string[] => {
    const variation = cartItem.variations?.find(
      (v: { name: string }) => v.name.toLowerCase() === variationName.toLowerCase()
    );
    if (variation && variation.options) {
      return variation.options.map((opt: { name: string }) => opt.name);
    }
    return [];
  };

  const sizeOptions = sizeVariation ? getVariationOptions(sizeVariation.name) : [];

  // Check if color is a hex code
  const isHexColor = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

  return (
    <div className="flex items-center gap-4 sm:gap-6 py-4 border-b border-gray-100">
      {/* Product Image */}
      <Link
        href={`/products/${slug}`}
        className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 relative overflow-hidden shrink-0"
      >
        {displayImage && (
          <Image
            src={displayImage}
            alt={cartItem.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${slug}`}>
          <p className="text-sm sm:text-base font-medium text-[#1E1E1E] truncate">
            {cartItem.name}
          </p>
        </Link>
        <div className="mt-1">
          {colorVariation && isHexColor(colorVariation.value) ? (
            <div
              className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
              style={{ backgroundColor: colorVariation.value }}
              title={colorVariation.value}
            />
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">
              {colorVariation?.value || category?.name || ""}
            </p>
          )}
        </div>
      </div>

      {/* Size Dropdown */}
      {sizeVariation && (
        <div className="relative">
          <button
            onClick={() => setOpenSizeDropdown(!openSizeDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded text-sm min-w-[60px] justify-between"
          >
            <span>{sizeVariation.value}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {openSizeDropdown && sizeOptions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[80px]">
              {sizeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleVariationChange(sizeVariation.name, option)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors
                    ${option === sizeVariation.value ? "bg-gray-100 font-medium" : ""}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center border border-gray-200 rounded">
        <button
          onClick={() => quantity > 1 && decreaseQty(id)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-3 py-1 text-sm font-medium min-w-[32px] text-center">
          {quantity}
        </span>
        <button
          onClick={() => increaseQty(id)}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Price */}
      <p className="text-sm sm:text-base font-medium text-[#1E1E1E] min-w-[70px] text-right">
        ${(price * quantity).toFixed(2)}
      </p>

      {/* Remove Button */}
      <button
        onClick={handleRemoveFromCartClick}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
