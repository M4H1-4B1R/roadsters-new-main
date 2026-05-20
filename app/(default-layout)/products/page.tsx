import ProductsPageLayout from "@/components/ProductsPage/ProductsPageLayout";
import { getCategories } from "@/lib/utils/api-client";
import { CategoriesResponse } from "@/types";

export default async function page() {
  const categoriesResponse: CategoriesResponse = await getCategories();

  return <ProductsPageLayout categoriesResponse={categoriesResponse} />;
}
