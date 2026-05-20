"use client";
import useCartStore from "@/hooks/useCartStore";
import CartItem from "./CartItem";
import { CategoriesResponse } from "@/types";

interface ShoppingBagProps {
  categoriesResponse: CategoriesResponse;
}

export default function ShoppingBag({ categoriesResponse }: ShoppingBagProps) {
  const { cart } = useCartStore();

  return (
    <div className="flex w-full flex-col gap-16">
      {cart.map((cartItem, index) => (
        <CartItem
          key={`${cartItem.id}-${index}`}
          cartItem={cartItem}
          category={categoriesResponse.results.find(
            (cat) => cat.id === cartItem.categories[0]
          )}
        />
      ))}
    </div>
  );
}
