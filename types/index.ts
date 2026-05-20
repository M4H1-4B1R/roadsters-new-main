/* eslint-disable @typescript-eslint/no-explicit-any */

/////////////////////////////Banner Types/////////////////////////////

export interface BannerItem {
  id: number;
  title: string | null;
  subtitle: string | null;
  title_ar: string | null;
  subtitle_ar: string | null;
  file: string | null;
  link: string | null;
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export type BannerResponse = BannerItem[];

/////////////////////////////Swiper Types/////////////////////////////

export interface SwiperItem {
  id: number;
  title: string | null;
  title_ar: string | null;
  subtitle: string | null;
  subtitle_ar: string | null;
  image: string | null;
  icon: string | null;
  link: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export type SwiperResponse = SwiperItem[];

/////////////////////////////Product Types/////////////////////////////

export interface Product {
  id: number;
  name: string;
  name_ar: string | null;
  description: string;
  description_ar: string | null;
  base_price: string;
  discount_price: string | null;
  final_price: number;
  is_available: boolean;
  inventory_mode: string;
  stock: number;
  in_stock: boolean;
  images: string[];
  videos: string[];
  variations: any[];
  variation_combinations: any[];
  categories: number[];
  created_at: string;
  updated_at: string;
  image: string | null;
  slug: string;
  best_seller: boolean;
  related_products: RelatedProduct[];
  primary_media: string | null;
  has_media: boolean;
}

export interface RelatedProduct {
  id: number;
  name: string;
  name_ar: string | null;
  base_price: number | string;
  discount_price: number | string | null;
  final_price: number;
  image: string | null;
  slug: string;
  is_available: boolean;
  categories?: number[];
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductInCart extends Product {
  quantity: number;
  selectedVariations?: { name: string; value: string }[];
}

///////////////////////////Category Types///////////////////////////////

export interface Category {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  image: string | null;
  parent: number | null;
  subcategories: Category[]; // recursive type
  featured: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface CategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

///////////////////////////Section Types///////////////////////////////

export interface HomeSectionProduct {
  id: number;
  name: string;
  name_ar: string | null;
  description: string;
  description_ar: string | null;
  slug: string;
  base_price: string; // API returns string
  discount_price: string | null; // also string or null
  final_price: number;
  is_available: boolean;
  inventory_mode: "TOGGLE" | "TRACK" | "TRACK_VARIATIONS";
  stock: number;
  in_stock: boolean | null; // sometimes true/false, sometimes null
  image: string | null;
  best_seller: boolean;
}

export interface HomeSection {
  id: number;
  title: string;
  title_ar: string;
  products: HomeSectionProduct[];
  is_active: boolean;
  order: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
}

export type HomeSectionsResponse = HomeSection[];
