import { create } from "zustand";
import { Product, ProductInCart } from "@/types";
import { persist, createJSONStorage } from "zustand/middleware";

type CartStore = {
  cart: ProductInCart[];
  addToCart: (product: Product, qty?: number, selectedVariations?: Record<string, string>) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  updateCartItemVariation: (id: number, variationName: string, newValue: string, currentVariations?: { name: string; value: string }[]) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getPromitions: () => number;
};

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      // ADD TO CART
      addToCart: (product, qty = 1, selectedVariations = {}) =>
        set((state) => {
          // Create a unique key based on product ID + selected variations
          const variationKey = Object.entries(selectedVariations)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join('|');

          const existing = state.cart.find(
            (p) => p.id === product.id &&
              (Object.keys(selectedVariations).length === 0 ||
                (p.selectedVariations &&
                  p.selectedVariations.map(v => `${v.name}:${v.value}`).sort().join('|') === variationKey))
          );

          if (existing) {
            return {
              cart: state.cart.map((p) =>
                p.id === existing.id && p === existing
                  ? { ...p, quantity: p.quantity + qty }
                  : p
              ),
            };
          }

          // Convert selectedVariations to array format expected by ProductInCart
          const variationsArray = Object.entries(selectedVariations).map(([name, value]) => ({
            name,
            value,
          }));

          // Insert new cart item
          const newItem: ProductInCart = {
            ...product,
            quantity: qty,
            selectedVariations: variationsArray.length > 0 ? variationsArray : undefined,
          };

          return { cart: [...state.cart, newItem] };
        }),

      // REMOVE
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== id),
        })),

      // INCREASE QTY
      increaseQty: (id) =>
        set((state) => ({
          cart: state.cart.map((p) =>
            p.id === id ? { ...p, quantity: p.quantity + 1 } : p
          ),
        })),

      // DECREASE QTY
      decreaseQty: (id) =>
        set((state) => ({
          cart: state.cart
            .map((p) =>
              p.id === id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
            )
            .filter((p) => p.quantity > 0),
        })),

      // UPDATE QTY
      updateQty: (id, qty) =>
        set((state) => ({
          cart: state.cart.map((p) =>
            p.id === id ? { ...p, quantity: Math.max(1, qty) } : p
          ),
        })),

      // UPDATE CART ITEM VARIATION
      updateCartItemVariation: (id, variationName, newValue, currentVariations) =>
        set((state) => ({
          cart: state.cart.map((p) => {
            if (p.id !== id) return p;

            // Find the item with matching variations
            const itemVariationsKey = p.selectedVariations
              ?.map((v) => `${v.name}:${v.value}`)
              .sort()
              .join('|');
            const currentKey = currentVariations
              ?.map((v) => `${v.name}:${v.value}`)
              .sort()
              .join('|');

            if (currentKey && itemVariationsKey !== currentKey) return p;

            // Update the specific variation
            const updatedVariations = (p.selectedVariations || []).map((v) =>
              v.name.toLowerCase() === variationName.toLowerCase()
                ? { ...v, value: newValue }
                : v
            );

            return { ...p, selectedVariations: updatedVariations };
          }),
        })),

      // CLEAR ALL
      clearCart: () => set({ cart: [] }),

      // COMPUTED TOTALS
      getTotal: () => {
        const { cart } = get();
        return cart.reduce(
          (sum, item) => sum + item.final_price * item.quantity,
          0
        );
      },

      getSubtotal: () => {
        const { cart } = get();
        return cart.reduce(
          (sum, item) => sum + Number(item.base_price) * item.quantity,
          0
        );
      },

      getPromitions: () => {
        return get().getSubtotal() - get().getTotal();
      },
    }),
    {
      name: "cart-products",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;
