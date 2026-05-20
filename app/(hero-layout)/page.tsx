import HomeLayout from "@/components/Home/HomeLayout";
import { getBanners, getCategories, getSections, getSwipers } from "@/lib/utils/api-client";
import { BannerResponse, CategoriesResponse, HomeSectionsResponse, SwiperResponse } from "@/types";

export default async function page() {
  const bannersData: BannerResponse = await getBanners();
  const sectionsData: HomeSectionsResponse = await getSections();
  const categoriesData: CategoriesResponse = await getCategories();
  const swipersData: SwiperResponse = await getSwipers();

  return (
    <HomeLayout
      banners={bannersData}
      categories={categoriesData}
      sections={sectionsData}
      swipers={swipersData}
    />
  );
}
