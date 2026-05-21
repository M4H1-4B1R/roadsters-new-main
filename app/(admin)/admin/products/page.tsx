import { adminDb } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus, Search, Edit3 } from "lucide-react";
import DeleteProductButton from "./_components/DeleteProductButton";

const PAGE_SIZE = 15;

interface RawProduct {
  id: number;
  slug: string;
  name: string;
  name_ar: string | null;
  price: number;
  sale_price: number | null;
  category_id: number | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

interface ProductRow {
  id: number;
  slug: string;
  name: string;
  price: number;
  sale_price: number | null;
  stock: number;
  is_active: boolean;
  category_name: string | null;
  primary_image: string | null;
  created_at: string;
}

async function getProducts(params: {
  page: number;
  search?: string;
  category_id?: string;
  price_min?: string;
  price_max?: string;
  sort?: string;
}): Promise<{ products: ProductRow[]; totalPages: number; count: number }> {
  const { page, search, category_id, price_min, price_max, sort } = params;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = adminDb.from("products").select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,name_ar.ilike.%${search}%`
    );
  }

  if (category_id) {
    query = query.eq("category_id", Number(category_id));
  }

  if (price_min) {
    query = query.gte("price", parseFloat(price_min));
  }

  if (price_max) {
    query = query.lte("price", parseFloat(price_max));
  }

  let orderColumn = "created_at";
  let orderDir: "asc" | "desc" = "desc";

  if (sort === "price_asc") {
    orderColumn = "price";
    orderDir = "asc";
  } else if (sort === "price_desc") {
    orderColumn = "price";
    orderDir = "desc";
  } else if (sort === "name_asc") {
    orderColumn = "name";
    orderDir = "asc";
  } else if (sort === "name_desc") {
    orderColumn = "name";
    orderDir = "desc";
  }

  const { data: products, count } = await query
    .order(orderColumn, { ascending: orderDir === "asc" })
    .range(from, to);

  if (!products) return { products: [], totalPages: 0, count: 0 };

  const raw = products as unknown as RawProduct[];
  const productIds = raw.map((p) => p.id);

  const primaryImages: Record<number, string | null> = {};
  if (productIds.length > 0) {
    const { data: images } = await adminDb
      .from("product_images")
      .select("product_id, image_url")
      .in("product_id", productIds)
      .eq("is_primary", true);

    if (images) {
      for (const img of images as {
        product_id: number;
        image_url: string;
      }[]) {
        primaryImages[img.product_id] = img.image_url;
      }
    }
  }

  const categoryIds = raw
    .map((p) => p.category_id)
    .filter((id): id is number => id !== null);

  const categoryMap: Record<number, string> = {};
  if (categoryIds.length > 0) {
    const { data: categories } = await adminDb
      .from("categories")
      .select("id, name")
      .in("id", categoryIds);

    if (categories) {
      for (const c of categories) {
        categoryMap[c.id as number] = (c as { name: string }).name;
      }
    }
  }

  const totalCount = count ?? 0;

  return {
    products: raw.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      sale_price: p.sale_price,
      stock: p.stock,
      is_active: p.is_active,
      category_name: p.category_id
        ? categoryMap[p.category_id] ?? null
        : null,
      primary_image: primaryImages[p.id] ?? null,
      created_at: p.created_at,
    })),
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    count: totalCount,
  };
}

async function getCategoryOptions() {
  const { data } = await adminDb
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (data ?? []) as Array<{ id: number; name: string }>;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() || undefined;
  const category_id = params.category_id || undefined;
  const price_min = params.price_min || undefined;
  const price_max = params.price_max || undefined;
  const sort = params.sort || undefined;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const [result, categoryOptions] = await Promise.all([
    getProducts({
      page: currentPage,
      search,
      category_id,
      price_min,
      price_max,
      sort,
    }),
    getCategoryOptions(),
  ]);

  const { products, totalPages, count } = result;

  function pageUrl(p: number) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (category_id) sp.set("category_id", category_id);
    if (price_min) sp.set("price_min", price_min);
    if (price_max) sp.set("price_max", price_max);
    if (sort) sp.set("sort", sort);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/admin/products${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <form
        method="GET"
        action="/admin/products"
        className="mb-6 flex flex-wrap gap-2 items-end"
      >
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            name="search"
            type="text"
            defaultValue={search ?? ""}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
        <select
          name="category_id"
          defaultValue={category_id ?? ""}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          name="price_min"
          type="number"
          step="0.01"
          min={0}
          placeholder="Min price"
          defaultValue={price_min ?? ""}
          className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <input
          name="price_max"
          type="number"
          step="0.01"
          min={0}
          placeholder="Max price"
          defaultValue={price_max ?? ""}
          className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <select
          name="sort"
          defaultValue={sort ?? ""}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A-Z</option>
          <option value="name_desc">Name: Z-A</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Filter
        </button>
        {(search || category_id || price_min || price_max || sort) && (
          <Link
            href="/admin/products"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">
            {search
              ? "No products match your search."
              : "No products yet."}
          </p>
          {!search && (
            <Link
              href="/admin/products/new"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus size={14} />
              Add your first product
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {count} product{count === 1 ? "" : "s"}
            {search && <> matching &ldquo;{search}&rdquo;</>}
          </p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider w-12"></th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {product.primary_image ? (
                        <img
                          src={product.primary_image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 text-xs">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {product.category_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {product.sale_price ? (
                        <>
                          <span className="text-gray-900 font-medium">
                            ${Number(product.sale_price).toFixed(2)}
                          </span>
                          <span className="ml-1.5 text-xs text-gray-400 line-through">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm ${
                          product.stock > 0
                            ? "text-gray-900"
                            : "text-red-500"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {currentPage > 1 && (
            <Link
              href={pageUrl(currentPage - 1)}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageUrl(p)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                p === currentPage
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link
              href={pageUrl(currentPage + 1)}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
