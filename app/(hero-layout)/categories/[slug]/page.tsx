import CategoryDetailsPageLayout from "@/components/CategoriesPage/CategoryDetailsPageLayout";
import { getCategoryByID, getCategories } from "@/lib/utils/api-client";
import { Category, CategoriesResponse } from "@/types";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function page({ params }: PageProps) {
  const { slug } = await params;

  // Fetch the specific category by slug
  const category: Category | null = await getCategoryByID({ slug });

  if (!category) notFound();

  // Fetch all categories for the filter
  const categoriesResponse: CategoriesResponse = await getCategories();

  return (
    <CategoryDetailsPageLayout
      category={category}
      categoriesResponse={categoriesResponse}
    />
  );
}
