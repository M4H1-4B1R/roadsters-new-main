import ProductDetailsLayout from "@/components/ProductDetails/ProductDetailsLayout";
import { getCategoryByID, getProductByID } from "@/lib/utils/api-client";
import { Category, Product } from "@/types";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { slug } = await params;
  const { category: categorySlug } = await searchParams;

  const product: Product = await getProductByID({ slug });

  let category: Category | undefined;

  if (categorySlug) {
    try {
      category = await getCategoryByID({ slug: categorySlug });
    } catch (error) {
      console.error("Error fetching category by slug:", error);
    }
  }

  // Fallback to first category of product if no category param or fetch failed
  if (!category && product.categories.length > 0) {
    try {
      const categoriesResponse = await import("@/lib/utils/api-client").then(m => m.getCategories());
      category = categoriesResponse.results.find((c: Category) => c.id === product.categories[0]);
    } catch (error) {
      console.error("Error fetching categories fallback:", error);
    }
  }

  return <ProductDetailsLayout product={product} category={category} />;
}
