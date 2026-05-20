"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import useCartStore from "@/hooks/useCartStore";
import ApplicationState from "../ApplicationState";
import { CategoriesResponse, Product } from "@/types";
import { useRouter } from "next/navigation";
import CartItem from "./CartItem";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "../Button";
import ProductRecommendationsSection from "../ProductRecommendationsSection";
import { getProducts } from "@/lib/utils/api-client";

interface CartPageLayoutProps {
  categoriesResponse: CategoriesResponse;
}

export default function CartPageLayout({
  categoriesResponse,
}: CartPageLayoutProps) {
  const { cart, getTotal, getSubtotal, getPromitions } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);

    // Fetch recommendations
    async function fetchRecommendations() {
      try {
        const data = await getProducts({ page: 1 });
        if (data && data.results) {
          setRecommendations(data.results.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    }
    fetchRecommendations();
  }, []);

  if (isLoading) return <ApplicationState state="loading" />;

  if (cart.length === 0) return <ApplicationState state="emptyCart" onClick={() => router.push("/products")} />;

  const subtotal = getSubtotal();
  const promotions = getPromitions();
  const total = getTotal();

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-12 pt-30">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1E1E] mb-10">
        Shopping Cart.
      </h1>

      {/* Cart Items */}
      <div className="space-y-6 mb-10">
        {cart.map((item) => {
          const category = categoriesResponse.results.find(
            (cat) => cat.id === item.categories?.[0]
          );
          return (
            <CartItem
              key={item.id}
              cartItem={item}
              category={category}
            />
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-6">
        {/* Summary */}
        <div className="max-w-md space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal:</span>
            <span className="text-[#1E1E1E]">${subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping:</span>
            <div className="flex gap-2">
              <span className="line-through text-gray-400">$9.99</span>
              <span className="text-[#1E1E1E]">$0.00</span>
            </div>
          </div>

          {/* Promotions (if any) */}
          {promotions > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Discount:</span>
              <span className="text-red-500">-${promotions.toFixed(2)}</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between text-lg font-semibold text-[#1E1E1E] pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <div className="pt-6">
            <Button
              label="Proceed to Checkout"
              onClick={() => router.push("/checkout")}
              variant="secondary"
              fullWidth
              rounded={false}
            />
          </div>
        </div>
      </div>

      {/* Continue Shopping Link */}
      <div className="mt-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-[#1E1E1E] hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="underline">Continue Shopping</span>
        </Link>
      </div>

      {/* Recommendations */}
      <div className="mt-20">
        <ProductRecommendationsSection
          title="TAILORED-ESSENTIALS"
          products={recommendations}
        />
      </div>
    </div>
  );
}
