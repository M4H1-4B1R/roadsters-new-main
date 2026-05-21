import { adminDb } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus, Search, Package, Edit3, FolderTree } from "lucide-react";

interface RawCategory {
  id: number;
  slug: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  image_url: string | null;
  parent_id: number | null;
  featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

interface CategoryCard {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  featured: boolean;
  parentName: string | null;
  productCount: number;
}

const PAGE_SIZE = 12;

async function getCategories(
  page: number,
  search?: string
): Promise<{ categories: CategoryCard[]; totalPages: number; count: number }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = adminDb
    .from("categories")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,name_ar.ilike.%${search}%`);
  }

  const { data: categories, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (!categories) return { categories: [], totalPages: 0, count: 0 };

  const raw = categories as unknown as RawCategory[];

  const parentIds = raw
    .map((c) => c.parent_id)
    .filter((id): id is number => id !== null);

  const parentMap: Record<number, string> = {};
  if (parentIds.length > 0) {
    const { data: parents } = await adminDb
      .from("categories")
      .select("id, name")
      .in("id", parentIds);
    if (parents) {
      for (const p of parents) {
        parentMap[p.id as number] = (p as { name: string }).name;
      }
    }
  }

  const categoryIds = raw.map((c) => c.id);
  const productCounts: Record<number, number> = {};
  if (categoryIds.length > 0) {
    const { data: productData } = await adminDb
      .from("products")
      .select("category_id")
      .in("category_id", categoryIds);
    if (productData) {
      for (const p of productData as { category_id: number }[]) {
        productCounts[p.category_id] =
          (productCounts[p.category_id] ?? 0) + 1;
      }
    }
  }

  const totalCount = count ?? 0;

  return {
    categories: raw.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      image_url: c.image_url,
      featured: c.featured,
      parentName: c.parent_id ? parentMap[c.parent_id] ?? null : null,
      productCount: productCounts[c.id] ?? 0,
    })),
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    count: totalCount,
  };
}

function CategoryCard({ category }: { category: CategoryCard }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="aspect-[16/9] bg-gray-100 relative">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <FolderTree size={40} />
          </div>
        )}
        {category.featured && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {category.description}
          </p>
        )}
        <div className="mt-auto space-y-1.5">
          {category.parentName && (
            <p className="text-[11px] text-gray-400">
              Parent: <span className="text-gray-500">{category.parentName}</span>
            </p>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Package size={12} />
            <span>{category.productCount} products</span>
          </div>
        </div>
        <Link
          href={`/admin/categories/${category.id}`}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          <Edit3 size={12} />
          Edit
        </Link>
      </div>
    </div>
  );
}

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() || undefined;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const { categories, totalPages, count } = await getCategories(
    currentPage,
    search
  );

  function pageUrl(p: number) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/admin/categories${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </Link>
      </div>

      <form
        method="GET"
        action="/admin/categories"
        className="mb-6 flex gap-2"
      >
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            name="search"
            type="text"
            defaultValue={search ?? ""}
            placeholder="Search categories…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Search
        </button>
        {search && (
          <Link
            href="/admin/categories"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      {categories.length === 0 ? (
        <div className="text-center py-16">
          <FolderTree
            size={48}
            className="mx-auto text-gray-300 mb-4"
          />
          <p className="text-gray-500 text-sm">
            {search
              ? "No categories match your search."
              : "No categories yet."}
          </p>
          {!search && (
            <Link
              href="/admin/categories/new"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus size={14} />
              Add your first category
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {count} categor{count === 1 ? "y" : "ies"}
            {search && <> matching &ldquo;{search}&rdquo;</>}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
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
