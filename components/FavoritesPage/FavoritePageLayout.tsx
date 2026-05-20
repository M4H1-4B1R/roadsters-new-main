"use client";
import { Product } from "@/types";
import ProductCard from "../ProductCard";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import PageContainer from "../PageContainer";
import useFavoritesStore from "@/hooks/useFavoritesStore";
import { getSomeProductBySlugs } from "@/lib/utils/api-client";
import ApplicationState from "../ApplicationState";
// import { Spinner } from "../ui/spinner";

export default function FavoritePageLayout() {
  const t = useTranslations("FavoritesPage");
  const { favoriteSlugs } = useFavoritesStore();
  const [favProducts, setFavProducts] = useState<Product[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (favoriteSlugs.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const products = await getSomeProductBySlugs({ favoriteSlugs });

      setFavProducts(products);

      setIsLoading(false);
    }

    fetchFavorites();
  }, [favoriteSlugs]);

  if (isLoading) return <ApplicationState state="loading" />;

  if (favoriteSlugs.length !== 0 && favProducts?.length !== 0)
    return (
      <PageContainer headerTitle={t("title")} description={t("subtitle")}>
        <div className="flex gap-3 sm:gap-6 mt-10 md:gap-8 flex-wrap justify-center">
          {favProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </PageContainer>
    );
  if (favoriteSlugs.length === 0)
    return <ApplicationState state="emptyFavorites" />;
}
