"use client";

import { createContext, useContext, useState, useEffect } from "react";
// import { useCurrency } from './CurrencyContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentCurrency } = useCurrency();
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // Helper function to generate consistent item keys
  const generateItemKey = (item) => {
    if (!item) return "null-item";

    // Base key is the product ID or slug
    let baseKey = item.id ? String(item.id) : item.slug || "unknown";

    // Add variation information if available
    if (
      item.selectedVariations &&
      Array.isArray(item.selectedVariations) &&
      item.selectedVariations.length > 0
    ) {
      const variationsKey = item.selectedVariations
        .map((v) => `${v.name}:${v.value}:${v.additionalPrice || "0"}`)
        .sort()
        .join("|");
      return `${baseKey}-${variationsKey}`;
    }

    return baseKey;
  };

  const getMaxStock = (item) => {
    if (item.inventory_mode === "TRACK_VARIATIONS") {
      return item.maxStock;
    } else if (item.inventory_mode === "TRACK") {
      return item.stock;
    }
    return 99; // Default max for TOGGLE mode
  };

  const addToCart = (newItem) => {
    // Ensure there's always a valid quantity
    if (!newItem || typeof newItem.quantity === "undefined") return;

    const quantity = Math.max(1, newItem.quantity);
    console.log("Adding to cart with key generation:", newItem);

    setCartItems((prevItems) => {
      const newItemKey = generateItemKey(newItem);
      console.log("Generated key for new item:", newItemKey);

      // Log existing item keys for debugging
      prevItems.forEach((item) => {
        console.log(
          "Existing item key:",
          generateItemKey(item),
          "for item:",
          item.name
        );
      });

      const existingItemIndex = prevItems.findIndex(
        (item) => generateItemKey(item) === newItemKey
      );
      console.log("Found existing item at index:", existingItemIndex);

      if (existingItemIndex !== -1) {
        // Update existing item - increment quantity if it has the EXACT same options
        const existingItem = prevItems[existingItemIndex];

        // Check if the items have the same variations
        let hasSameVariations = true;

        // If both items have selectedVariations, compare them
        if (existingItem.selectedVariations && newItem.selectedVariations) {
          // Check if they have the same number of variations
          if (
            existingItem.selectedVariations.length !==
            newItem.selectedVariations.length
          ) {
            hasSameVariations = false;
          } else {
            // Compare each variation
            for (let i = 0; i < existingItem.selectedVariations.length; i++) {
              const existingVar = existingItem.selectedVariations[i];
              const newVar = newItem.selectedVariations[i];

              if (
                existingVar.name !== newVar.name ||
                existingVar.value !== newVar.value
              ) {
                hasSameVariations = false;
                break;
              }
            }
          }
        } else if (
          (existingItem.selectedVariations && !newItem.selectedVariations) ||
          (!existingItem.selectedVariations && newItem.selectedVariations)
        ) {
          // One has variations and the other doesn't
          hasSameVariations = false;
        }

        console.log("Items have same variations:", hasSameVariations);

        if (hasSameVariations) {
          // Only update quantity for exact matches
          return prevItems.map((item, index) => {
            if (index !== existingItemIndex) return item;

            const maxStock = getMaxStock(item);
            const newQuantity = Math.min(item.quantity + quantity, maxStock);
            console.log("Updating quantity to:", newQuantity);

            return {
              ...item,
              quantity: newQuantity,
            };
          });
        } else {
          // Different options, add as new item
          console.log("Adding as a new item due to different options");
          const maxStock = getMaxStock(newItem);
          return [
            ...prevItems,
            {
              ...newItem,
              quantity: Math.min(quantity, maxStock),
            },
          ];
        }
      }

      // Add new item with validated quantity
      console.log("Adding new item");
      const maxStock = getMaxStock(newItem);
      return [
        ...prevItems,
        {
          ...newItem,
          quantity: Math.min(quantity, maxStock),
        },
      ];
    });
  };

  const updateQuantity = (itemKey, newQuantity) => {
    // Ensure newQuantity is a number and at least 1
    const quantity = Math.max(1, parseInt(newQuantity) || 1);

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (generateItemKey(item) !== itemKey) return item;

        // Determine max stock based on inventory mode
        const maxStock =
          item.inventory_mode === "TRACK_VARIATIONS"
            ? item.maxStock
            : item.inventory_mode === "TRACK"
            ? item.stock
            : 99;

        // Ensure quantity doesn't exceed max stock
        const validQuantity = Math.min(quantity, maxStock);

        return {
          ...item,
          quantity: validQuantity,
        };
      })
    );
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => generateItemKey(item) !== itemKey)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateItemTotal = (item) => {
    const basePrice = item.price * item.quantity;
    const variationPrice =
      item.selectedOptions?.reduce(
        (total, option) => total + (option.additional_price || 0),
        0
      ) || 0;
    return basePrice + variationPrice * item.quantity;
  };

  const calculateCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateCartTotal,
        subtotal: calculateCartTotal(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  return useContext(CartContext);
}
