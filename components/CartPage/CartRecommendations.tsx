"use client";
import { useEffect, useState } from "react";
import useCartStore from "@/hooks/useCartStore";
import { Product } from "@/types";
import { useTranslations } from "next-intl";
import ProductCard from "../ProductCard";
import ProductsContainer from "../ProductsContainer";

export default function CartRecommendations() {
    const { cart } = useCartStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const t = useTranslations("CartPage");

    // Handle hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (cart.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Get unique product IDs from cart
                const cartProductIds = new Set(cart.map((item) => item.id));

                // Step 1: Try to get related_products from cart items
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const relatedProducts: Product[] = [];
                cart.forEach((item) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((item as any).related_products && Array.isArray((item as any).related_products)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (item as any).related_products.forEach((rp: any) => {
                            // Only add if not already in cart and not already in relatedProducts
                            if (!cartProductIds.has(rp.id) && !relatedProducts.find(p => p.id === rp.id)) {
                                relatedProducts.push(rp);
                            }
                        });
                    }
                });

                console.log('=== CART RECOMMENDATIONS DEBUG ===');
                console.log('Cart items count:', cart.length);
                console.log('Related products from cart items:', relatedProducts.length);

                // If we found related products, use them
                if (relatedProducts.length > 0) {
                    console.log('Using related products:', relatedProducts);
                    setProducts(relatedProducts.slice(0, 8));
                    setLoading(false);
                    return;
                }

                // Step 2: Try fetching by categories
                const categoryIds: number[] = [];
                cart.forEach((item) => {
                    if (item.categories && Array.isArray(item.categories)) {
                        item.categories.forEach((catId: number) => {
                            if (!categoryIds.includes(catId)) {
                                categoryIds.push(catId);
                            }
                        });
                    }
                });

                console.log('Cart categories found:', categoryIds);

                // Try each category until we find one with products
                for (const catId of categoryIds) {
                    const url = `/api/products?category=${catId}&page_size=12`;
                    console.log('Trying category:', catId);

                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        const allProducts = data.results || data || [];
                        const filtered = allProducts.filter(
                            (product: Product) => !cartProductIds.has(product.id)
                        );

                        if (filtered.length > 0) {
                            console.log('Found products in category', catId, ':', filtered.length);
                            setProducts(filtered.slice(0, 8));
                            setLoading(false);
                            return;
                        }
                    }
                }

                // Step 3: Fallback to general products
                console.log('No category products found, fetching general products');
                const fallbackUrl = '/api/products?page_size=12';
                const fallbackResponse = await fetch(fallbackUrl);

                if (fallbackResponse.ok) {
                    const data = await fallbackResponse.json();
                    console.log('Fallback API response:', data);

                    const allProducts = data.results || data || [];
                    const filtered = allProducts.filter(
                        (product: Product) => !cartProductIds.has(product.id)
                    );

                    console.log('Fallback filtered products:', filtered.length);
                    setProducts(filtered.slice(0, 8));
                } else {
                    console.error('Fallback fetch failed:', fallbackResponse.status);
                }
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [mounted, cart]);

    // Don't render during SSR
    if (!mounted) {
        return null;
    }

    // Show loading state
    if (loading) {
        return (
            <section className="mb-24 px-4 md:px-6">
                <p className="text-[#1E1E1E] text-center mb-12 font-bold text-3xl sm:text-[42px]">
                    {t("SimilarStyles")}
                </p>
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </section>
        );
    }

    // Don't show if cart is empty
    if (cart.length === 0) {
        return null;
    }

    // Don't show if no products to recommend
    if (products.length === 0) {
        return null;
    }

    return (
        <section className="mb-24 px-4 md:px-6">
            {/* Title */}
            <p className="text-[#1E1E1E] text-center mb-12 font-bold text-3xl sm:text-[42px]">
                {t("SimilarStyles")}
            </p>

            {/* Products Grid */}
            <ProductsContainer>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ProductsContainer>
        </section>
    );
}
