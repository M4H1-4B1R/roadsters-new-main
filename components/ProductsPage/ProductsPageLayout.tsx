"use client";
import ProductCard from "../ProductCard";
import FiltersSheet from "../FiltersSheet";
import { useTranslations } from "next-intl";
import { CategoriesResponse, ProductsResponse, Product } from "@/types";
import { getProducts } from "@/lib/utils/api-client";
import ApplicationState from "../ApplicationState";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

interface ProductsPageLayoutProps {
  categoriesResponse: CategoriesResponse;
}

// Helper function to check if a product has a specific variation option
// variationName: e.g., "Size", "Color"
// optionValue: e.g., "M", "#FF0000"
function productHasVariationOption(product: Product, variationName: string, optionValue: string): boolean {
  if (!product.variations || !Array.isArray(product.variations)) return false;

  for (const variation of product.variations) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variationObj = variation as any;

    // Check if this is the variation we're looking for
    if (variationObj.name === variationName) {
      // Check options array
      if (variationObj.options && Array.isArray(variationObj.options)) {
        for (const option of variationObj.options) {
          if (option.name === optionValue) {
            return true;
          }
        }
      }

      // Also check values array (alternative structure)
      if (variationObj.values && Array.isArray(variationObj.values)) {
        if (variationObj.values.includes(optionValue)) {
          return true;
        }
      }
    }
  }

  return false;
}

export default function ProductsPageLayout({
  categoriesResponse,
}: ProductsPageLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("ProductsPage");
  const [loading, setLoading] = useState(true);
  const buttonTranslations = useTranslations("Button");
  const [openFilters, setOpenFilters] = useState(false);
  const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
  const [searchQuery, setSearchQuery] = useState("");

  // Read query params
  const category = searchParams.get("category") || undefined;
  const min_price = searchParams.get("min_price") || undefined;
  const max_price = searchParams.get("max_price") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const in_stock = searchParams.get("in_stock") === "true";
  const page = Number(searchParams.get("page") || 1);

  // Extract variation filters from URL (var_VariationName=optionValue)
  const variationFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("var_")) {
        const variationName = key.replace("var_", "");
        filters[variationName] = value;
      }
    });
    return filters;
  }, [searchParams]);

  // Total pages (backend PAGE_SIZE is 20)
  const totalPages = productsResponse
    ? Math.ceil(productsResponse.count / 20)
    : 1;

  // Fetch products when any filter or page changes
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const filters: Record<string, string | number | boolean | undefined> = {
          category,
          min_price,
          max_price,
          sort,
          page,
        };

        // Only add in_stock if it's explicitly true
        if (in_stock) {
          filters.in_stock = true;
        }

        // Remove undefined keys
        const cleanedFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined)
        );

        console.log("Filters params:", cleanedFilters);
        const data = await getProducts(cleanedFilters);
        setProductsResponse(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, min_price, max_price, sort, in_stock, page]);

  // Filter products by search query and variation filters (client-side)
  const filteredProducts = useMemo(() => {
    if (!productsResponse?.results) return [];

    let results = productsResponse.results;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.name_ar?.toLowerCase().includes(query)
      );
    }

    // Filter by variation filters
    Object.entries(variationFilters).forEach(([variationName, optionValue]) => {
      if (optionValue) {
        results = results.filter((product) =>
          productHasVariationOption(product, variationName, optionValue)
        );
      }
    });

    return results;
  }, [productsResponse?.results, searchQuery, variationFilters]);

  // Helper to update query params
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set(key, value);
    router.push(`/products?${params.toString()}`);
  };

  if (loading) return <ApplicationState state="loading" />;

  return (
    <div>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-12 mb-12 pt-30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1E1E1E] mb-4">
            Products
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover pieces defined by craftsmanship and character—each product a reflection of heritage, purpose, and timeless appeal.
          </p>
        </div>

        {/* Search Bar with Filter Button */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search For Anything..."
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 text-sm focus:outline-none"
            />
            <button
              onClick={() => setOpenFilters(true)}
              className="ml-3 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.keys(variationFilters).length > 0 && (
          <div className="max-w-xl mx-auto mb-6 flex flex-wrap gap-2 justify-center">
            {Object.entries(variationFilters).map(([name, value]) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                <span className="text-gray-500">{name}:</span>
                <span className="font-medium">{value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Product Grid - 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.length === 0 && (
            <div className="col-span-full">
              <ApplicationState state="noResults" />
            </div>
          )}
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={categoriesResponse.results.find(
                (cat) => cat.id === product.categories[0]
              )}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16 gap-2">
            {/* Previous */}
            {page > 1 && (
              <button
                onClick={() => updateQueryParam("page", (page - 1).toString())}
                className="px-4 py-2 rounded border hover:bg-black hover:text-white transition"
              >
                {buttonTranslations("Previous")}
              </button>
            )}

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => updateQueryParam("page", num.toString())}
                className={`px-4 py-2 rounded border ${num === page
                  ? "bg-black text-white"
                  : "hover:bg-black hover:text-white transition"
                  }`}
              >
                {num}
              </button>
            ))}

            {/* Next */}
            {page < totalPages && (
              <button
                onClick={() => updateQueryParam("page", (page + 1).toString())}
                className="px-4 py-2 rounded border hover:bg-black hover:text-white transition"
              >
                {buttonTranslations("Next")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filters Sheet */}
      <FiltersSheet
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        categories={categoriesResponse.results ?? []}
      />
    </div>
  );
}
