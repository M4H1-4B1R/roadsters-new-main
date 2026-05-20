import CategoriesPageLayout from "@/components/CategoriesPage/CategoriesPageLayout";
import { getCategories } from "@/lib/utils/api-client";
import { CategoriesResponse } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function page() {
  const categoriesResponse: CategoriesResponse = await getCategories();

  return <CategoriesPageLayout categoriesResponse={categoriesResponse} />;
}
