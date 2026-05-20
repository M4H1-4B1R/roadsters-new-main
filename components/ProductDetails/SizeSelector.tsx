/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Button from "../Button";
import SizeContainer from "./SizeContainer";
import { Product } from "@/types";
import { useState } from "react";
import { useTranslations } from "next-intl";
import useCartStore from "@/hooks/useCartStore";
import { toast } from "sonner";

interface SizeSelectorProps {
  product: Product;
}

export default function SizeSelector({ product }: SizeSelectorProps) {
  const { addToCart } = useCartStore();
  const ProductDetails = useTranslations("ProductDetails");
  const toasterTranslations = useTranslations("toaster");
  const ButtonTransaltions = useTranslations("Button");

  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCartClick = () => {
    // Check if all variations are selected
    const variations = product.variations || [];
    if (variations.length > 0) {
      const unselectedVariations = variations
        .filter((v: any) => !selectedOptions[v.name])
        .map((v: any) => v.name);

      if (unselectedVariations.length > 0) {
        // Show validation message with unselected variation names
        const message = `${ProductDetails("SelectFirst")} ${unselectedVariations.join(", ")}`;
        setValidationMessage(message);

        // Clear message after 3 seconds
        setTimeout(() => setValidationMessage(null), 3000);
        return;
      }
    }

    // Clear any validation message
    setValidationMessage(null);

    // Add to cart with selected quantity and variations
    addToCart(product, quantity, selectedOptions);
    toast.success(toasterTranslations("addedToCart", { item: product.name }));

    // Reset quantity after adding
    setQuantity(1);
  };

  // Render variations if they exist, otherwise handle empty state.
  // Assumes `product.variations` structure based on requirements.

  const variations = product.variations || [];

  // State to track selected options for each variation
  // Key: variation name, Value: selected item value
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const handleOptionSelect = (variationName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variationName]: value,
    }));
  };

  // Check if all variations have a selection
  const allVariationsSelected =
    variations.length > 0 &&
    variations.every((v: any) => selectedOptions[v.name]);

  // Check stock status based on selected variations and combinations.

  let isOutOfStock = false;

  if (allVariationsSelected && product.variation_combinations?.length > 0) {
    // Find matching combination for selected options.
    // Backend returns: { id, options: [{id, name, name_ar, ...}], stock }
    const combination = product.variation_combinations.find((combo: any) => {
      // Get option names from this combination
      const comboOptionNames = (combo.options || []).map((opt: any) => opt.name?.toLowerCase());
      // Get selected option values
      const selectedValues = Object.values(selectedOptions).map((v: string) => v.toLowerCase());

      // Check if all selected options are in this combination's options
      if (comboOptionNames.length !== selectedValues.length) return false;

      return selectedValues.every((val: string) => comboOptionNames.includes(val));
    });

    if (!combination) {
      // Combination doesn't exist -> Out of stock (or invalid)
      isOutOfStock = true;
    } else {
      // Check stock of combination
      if (combination.stock <= 0) {
        isOutOfStock = true;
      }
    }
  } else if (variations.length === 0) {
    // No variations - check product stock and availability directly
    if (!product.in_stock || product.is_available === false) isOutOfStock = true;
  }
  // If variations exist but not all selected, don't show out of stock yet

  return (
    <div className="w-full">
      {variations.length > 0 ? (
        variations.map((variation: any, index: number) => {
          const isColorVariation = variation.name.toLowerCase().includes("color");

          return (
            <div key={index} className="mb-6">
              <p className="mb-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                {variation.name}: {selectedOptions[variation.name] && (
                  <span className="text-[#0A0A0A]">{selectedOptions[variation.name]}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                {variation.options?.map((option: any, idx: number) => {
                  const isSelected =
                    selectedOptions[variation.name] === option.name;

                  // Check if option.name is a hex color code
                  const isHexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(option.name);

                  // Determine if this should be a color circle
                  const showAsColorCircle = isColorVariation && (option.image || isHexColor);

                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        handleOptionSelect(variation.name, option.name)
                      }
                    >
                      {showAsColorCircle ? (
                        <div
                          className={`w-10 h-10 rounded-full cursor-pointer transition-all ${isSelected
                            ? "ring-2 ring-offset-2 ring-black"
                            : "ring-1 ring-gray-300 hover:ring-gray-400"
                            }`}
                          style={{
                            backgroundImage: option.image ? `url(${option.image})` : undefined,
                            backgroundColor: isHexColor ? option.name : (option.image ? undefined : '#ccc'),
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                          title={option.name}
                        />
                      ) : (
                        <SizeContainer
                          sizeLabel={option.name}
                          selected={isSelected}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="mb-6">
          <p className="text-gray-500 text-sm">
            {ProductDetails("NoVariationsAvailable")}
          </p>
        </div>
      )}

      {/* Validation Message */}
      {validationMessage && (
        <div className="w-full text-amber-600 font-medium text-sm text-center border border-amber-200 bg-amber-50 py-2 px-3 rounded-lg mb-3 animate-pulse">
          {validationMessage}
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="flex gap-3 items-center">
        {isOutOfStock ? (
          <div className="w-full text-red-600 font-bold text-lg text-center border border-red-200 bg-red-50 py-3 rounded-lg">
            {ProductDetails("OutOfStock")}
          </div>
        ) : (
          <Button
            label={ButtonTransaltions("AddtoCart")}
            fullWidth
            onClick={handleAddToCartClick}
            variant="primary"
            className="bg-black text-white hover:bg-gray-800"
          />
        )}
      </div>
    </div>
  );
}
