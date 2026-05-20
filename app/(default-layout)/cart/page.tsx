import CartPageLayout from "@/components/CartPage/CartPageLayout";
import { getCategories } from "@/lib/utils/api-client";
import { CategoriesResponse } from "@/types";

export default async function page() {
  const categoriesResponse: CategoriesResponse = await getCategories();

  return <CartPageLayout categoriesResponse={categoriesResponse} />;
}
