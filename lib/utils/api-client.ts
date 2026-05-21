/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Product,
  RelatedProduct,
  BannerItem,
  SwiperItem,
  Category,
  CategoriesResponse,
  HomeSection,
  HomeSectionProduct,
  ProductsResponse,
} from "@/types";
import axios from "axios";
import { db } from "@/lib/supabase/db";

// Client for direct backend API calls (client-side POST requests).
// Still used by the POST helpers (validateCoupon/createOrder) which are
// migrated to Supabase in Phase 5. All GET/read helpers below use Supabase.
const apiClient = axios.create({
  baseURL: process.env.BASE_API_URL,
});

// ---------------------------------------------------------------------------
// Shape mappers: Supabase rows -> the Django/DRF shapes the components expect.
// The storefront components were built against the Django API response; the
// Supabase schema is flatter and uses different column names, so each row is
// translated back into the original contract (see types/index.ts).
// ---------------------------------------------------------------------------

// product_images rows -> ordered array of URL strings (primary first).
function imageUrls(imageRows: any[] | null | undefined): string[] {
  return (imageRows ?? [])
    .slice()
    .sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary) ||
        (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    .map((img) => img.image_url)
    .filter(Boolean);
}

function videoUrls(videoRows: any[] | null | undefined): string[] {
  return (videoRows ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((v) => v.video_url)
    .filter(Boolean);
}

// final price = discount/sale price if set, else base price (Product.get_final_price).
function finalPrice(row: any): number {
  return Number(row.sale_price != null ? row.sale_price : row.price);
}

function mapVariations(variationRows: any[] | null | undefined): any[] {
  return (variationRows ?? []).map((v) => ({
    id: v.id,
    name: v.name,
    name_ar: v.name_ar ?? null,
    options: (v.options ?? []).map((o: any) => ({
      id: o.id,
      // schema stores option label as `value`; the UI reads `option.name`.
      name: o.value,
      name_ar: o.value_ar ?? null,
      additional_price: "0.00",
      image: null,
    })),
  }));
}

function mapCombinations(
  comboRows: any[] | null | undefined,
  optionsById: Map<number, any>
): any[] {
  return (comboRows ?? []).map((c) => ({
    id: c.id,
    options: (c.option_ids ?? [])
      .map((id: number) => optionsById.get(id))
      .filter(Boolean),
    stock: c.stock ?? 0,
  }));
}

// Full product (detail/list/section/favorites). `images`/`videos` are returned
// as string[] to match the Product type; components also handle object form.
function mapProduct(row: any): Product {
  const images = imageUrls(row.images);
  const variations = mapVariations(row.variations);
  const optionsById = new Map<number, any>();
  variations.forEach((v) =>
    (v.options ?? []).forEach((o: any) => optionsById.set(o.id, o))
  );
  const primary = images[0] ?? null;

  return {
    id: row.id,
    name: row.name,
    name_ar: row.name_ar ?? null,
    description: row.description ?? "",
    description_ar: row.description_ar ?? null,
    base_price: String(row.price),
    discount_price: row.sale_price != null ? String(row.sale_price) : null,
    final_price: finalPrice(row),
    is_available: Boolean(row.is_active),
    inventory_mode: "TRACK",
    stock: row.stock ?? 0,
    in_stock: (row.stock ?? 0) > 0,
    images,
    videos: videoUrls(row.videos),
    variations,
    variation_combinations: mapCombinations(
      row.variation_combinations,
      optionsById
    ),
    categories: row.category_id != null ? [row.category_id] : [],
    created_at: row.created_at ?? "",
    updated_at: row.created_at ?? "",
    image: primary,
    slug: row.slug,
    best_seller: Boolean(row.is_featured),
    related_products: [],
    primary_media: primary,
    has_media: images.length > 0,
  };
}

// Lightweight product used inside sections (ProductBasicSerializer shape).
function mapProductBasic(row: any): HomeSectionProduct {
  const primary = imageUrls(row.images)[0] ?? null;
  return {
    id: row.id,
    name: row.name,
    name_ar: row.name_ar ?? null,
    description: row.description ?? "",
    description_ar: row.description_ar ?? null,
    slug: row.slug,
    base_price: String(row.price),
    discount_price: row.sale_price != null ? String(row.sale_price) : null,
    final_price: finalPrice(row),
    is_available: Boolean(row.is_active),
    inventory_mode: "TRACK",
    stock: row.stock ?? 0,
    in_stock: (row.stock ?? 0) > 0,
    image: primary,
    best_seller: Boolean(row.is_featured),
  };
}

function mapRelatedProduct(row: any): RelatedProduct {
  return {
    id: row.id,
    name: row.name,
    name_ar: row.name_ar ?? null,
    base_price: String(row.price),
    discount_price: row.sale_price != null ? String(row.sale_price) : null,
    final_price: finalPrice(row),
    image: imageUrls(row.images)[0] ?? null,
    slug: row.slug,
    is_available: Boolean(row.is_active),
    categories: row.category_id != null ? [row.category_id] : [],
  };
}

function mapBanner(row: any): BannerItem {
  return {
    id: row.id,
    title: row.title ?? null,
    subtitle: row.subtitle ?? null,
    title_ar: row.title_ar ?? null,
    subtitle_ar: row.subtitle_ar ?? null,
    file: row.image_url ?? null,
    link: row.link_url ?? null,
    is_active: Boolean(row.is_active),
    created_at: row.created_at ?? "",
    updated_at: row.created_at ?? "",
  };
}

function mapSwiper(row: any): SwiperItem {
  return {
    id: row.id,
    title: row.title ?? null,
    title_ar: row.title_ar ?? null,
    subtitle: row.subtitle ?? null,
    subtitle_ar: row.subtitle_ar ?? null,
    image: row.image_url ?? null,
    icon: null,
    link: row.link_url ?? null,
    is_active: Boolean(row.is_active),
    order: row.sort_order ?? 0,
    created_at: row.created_at ?? "",
    updated_at: row.created_at ?? "",
  };
}

function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    name_ar: row.name_ar ?? "",
    slug: row.slug,
    description: row.description ?? "",
    description_ar: row.description_ar ?? "",
    image: row.image_url ?? null,
    parent: row.parent_id ?? null,
    // Components never read subcategories; kept empty (schema has no nesting yet).
    subcategories: [],
    // Schema has no `featured` column; treat active categories as featured so
    // the homepage "shop by category" + featured nav render. See note in PR.
    featured: row.featured ?? Boolean(row.is_active),
    created_at: row.created_at ?? "",
    updated_at: row.created_at ?? "",
  };
}

function mapShippingOption(row: any) {
  return {
    id: row.id,
    name: row.name,
    name_ar: row.name_ar ?? undefined,
    // schema's `delivery_time` (e.g. "3-5 days") surfaces as the description.
    description: row.delivery_time ?? undefined,
    price: String(row.price),
    is_active: Boolean(row.is_active),
  };
}

// Joins pulled for every full product fetch.
const PRODUCT_SELECT =
  "*, images:product_images(*), videos:product_videos(*), variations(*, options:variation_options(*)), variation_combinations(*)";

// ---------------------------------------------------------------------------
// Read API (Supabase)
// ---------------------------------------------------------------------------

// Fetch banners
export async function getBanners(): Promise<BannerItem[]> {
  const { data, error } = await db
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
  return (data ?? []).map(mapBanner);
}

// Fetch swipers
export async function getSwipers(): Promise<SwiperItem[]> {
  const { data, error } = await db
    .from("swipers")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("Error fetching swipers:", error);
    return [];
  }
  return (data ?? []).map(mapSwiper);
}

// Fetch homepage sections (resolves product_ids -> product rows)
export async function getSections(): Promise<HomeSection[]> {
  const { data: sections, error } = await db
    .from("sections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error || !sections) {
    console.error("Error fetching sections:", error);
    return [];
  }

  const allIds = Array.from(
    new Set(sections.flatMap((s: any) => s.product_ids ?? []))
  );

  let byId = new Map<number, HomeSectionProduct>();
  if (allIds.length > 0) {
    const { data: products } = await db
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .in("id", allIds);
    byId = new Map(
      (products ?? []).map((p: any) => [p.id, mapProductBasic(p)])
    );
  }

  return sections.map((s: any) => ({
    id: s.id,
    title: s.title,
    title_ar: s.title_ar ?? "",
    products: (s.product_ids ?? [])
      .map((id: number) => byId.get(id))
      .filter(Boolean) as HomeSectionProduct[],
    is_active: Boolean(s.is_active),
    order: s.sort_order ?? 0,
    created_at: s.created_at ?? "",
    updated_at: s.created_at ?? "",
  }));
}

// Fetch categories (paginated DRF shape: { count, next, previous, results })
export async function getCategories(): Promise<CategoriesResponse> {
  const { data, error } = await db
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) {
    console.error("Error fetching categories:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
  const results = (data ?? []).map(mapCategory);
  return { count: results.length, next: null, previous: null, results };
}

// Fetch a single category by slug
export async function getCategoryByID({
  slug,
}: {
  slug: string;
}): Promise<Category | null> {
  const { data, error } = await db
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error(`Error fetching category ${slug}:`, error);
    return null;
  }
  return mapCategory(data);
}

// Helper: apply the UI's sort token to a products query.
function applySort(query: any, sort?: string) {
  if (!sort) return query.order("created_at", { ascending: false });
  switch (sort) {
    case "price_asc":
      return query.order("price", { ascending: true });
    case "price_desc":
      return query.order("price", { ascending: false });
    case "newest":
      return query.order("created_at", { ascending: false });
  }
  // Django-style ordering tokens (e.g. "name", "-base_price", "best_seller").
  const desc = sort.startsWith("-");
  const raw = desc ? sort.slice(1) : sort;
  const columnByField: Record<string, string> = {
    base_price: "price",
    discount_price: "sale_price",
    best_seller: "is_featured",
    name: "name",
    created_at: "created_at",
  };
  const column = columnByField[raw];
  if (column) return query.order(column, { ascending: !desc });
  return query.order("created_at", { ascending: false });
}

function isTruthyFlag(value: any): boolean {
  return value === true || value === "true" || value === "1";
}

// Fetch products with filtering/search/sort/pagination.
// Mirrors the contract in PRODUCT_FILTERING_API.md. Returns the paginated
// shape { count, next, previous, results } the components consume.
export async function getProducts(
  filters: Record<string, any> = {}
): Promise<ProductsResponse> {
  let query = db
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("is_active", true);

  // Search across English + Arabic name fields.
  if (filters.search) {
    const s = String(filters.search)
      .replace(/[,%()*]/g, "")
      .trim();
    if (s) query = query.or(`name.ilike.%${s}%,name_ar.ilike.%${s}%`);
  }

  // Category — comma-separated slugs -> category_id IN (...).
  if (filters.category) {
    const slugs = String(filters.category)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const { data: cats } = await db
      .from("categories")
      .select("id")
      .in("slug", slugs);
    const ids = (cats ?? []).map((c: any) => c.id);
    query = query.in("category_id", ids.length ? ids : [-1]);
  }

  // Price range — either combined `price=min-max` or separate min_price/max_price.
  let minPrice: number = NaN;
  let maxPrice: number = NaN;
  if (filters.price) {
    const [minStr, maxStr] = String(filters.price).split("-");
    minPrice = minStr ? Number(minStr) : NaN;
    maxPrice = maxStr ? Number(maxStr) : NaN;
  }
  if (filters.min_price) minPrice = Number(filters.min_price);
  if (filters.max_price) maxPrice = Number(filters.max_price);
  if (!isNaN(minPrice)) query = query.gte("price", minPrice);
  if (!isNaN(maxPrice)) query = query.lte("price", maxPrice);

  // Boolean filters.
  if (filters.best_seller !== undefined && isTruthyFlag(filters.best_seller)) {
    query = query.eq("is_featured", true);
  }
  if (filters.in_stock !== undefined && isTruthyFlag(filters.in_stock)) {
    query = query.gt("stock", 0);
  }

  // Sorting.
  query = applySort(query, filters.sort ? String(filters.sort) : undefined);

  // Pagination (backend PAGE_SIZE = 20).
  const page = Number(filters.page) || 1;
  const pageSize = Number(filters.page_size) || 20;
  query = query.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error("Error fetching products:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
  return {
    count: count ?? 0,
    next: null,
    previous: null,
    results: (data ?? []).map(mapProduct),
  };
}

// Fetch a single product by slug (with full joins + related products)
export async function getProductByID({
  slug,
}: {
  slug: string;
}): Promise<Product | null> {
  const { data, error } = await db
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error(`Error fetching product ${slug}:`, error);
    return null;
  }

  const product = mapProduct(data);

  // Related products: other active products in the same category.
  if ((data as any).category_id != null) {
    const { data: related } = await db
      .from("products")
      .select("*, images:product_images(*)")
      .eq("is_active", true)
      .eq("category_id", (data as any).category_id)
      .neq("id", (data as any).id)
      .order("created_at", { ascending: false })
      .limit(6);
    product.related_products = (related ?? []).map(mapRelatedProduct);
  }

  return product;
}

// Fetch several products by slug (favorites page). Preserves input order.
export async function getSomeProductBySlugs({
  favoriteSlugs,
}: {
  favoriteSlugs: string[];
}): Promise<Product[]> {
  if (!favoriteSlugs?.length) return [];
  const { data, error } = await db
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .in("slug", favoriteSlugs);
  if (error) {
    console.error("Error fetching products by slugs:", error);
    return [];
  }
  const order = new Map(favoriteSlugs.map((s, i) => [s, i]));
  return (data ?? [])
    .map(mapProduct)
    .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
}

// Fetch countries.
// No `countries` table exists in the storefront schema (out of scope), and no
// component currently consumes this. Returns an empty list.
export async function getCountries() {
  return [];
}

// Fetch shipping options
export async function getShippingOptions() {
  const { data, error } = await db
    .from("shipping_options")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });
  if (error) {
    console.error("Error fetching shipping options:", error);
    return [];
  }
  return (data ?? []).map(mapShippingOption);
}

// ---------------------------------------------------------------------------
// Write API — migrated to Supabase in Phase 5. Left calling the proxy for now.
// ---------------------------------------------------------------------------

// Validate coupon - calls Next.js API route which proxies to backend
export async function validateCoupon(code: string, totalAmount: number) {
  try {
    const response = await apiClient.post("/api/validate-coupon", {
      coupon_code: code,
      total_amount: totalAmount,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        status: error.response?.status || 500,
        details: error.response?.data || { error: "Unknown error" },
      };
    }
    throw error;
  }
}

// Create order - calls Next.js API route which proxies to backend
export async function createOrder(orderData: any) {
  try {
    const response = await apiClient.post("/api/orders/create", orderData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        status: error.response?.status || 500,
        details: error.response?.data || { error: "Unknown error" },
      };
    }
    throw error;
  }
}

export default apiClient;
