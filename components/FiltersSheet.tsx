"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Product } from "@/types";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { getProducts } from "@/lib/utils/api-client";

interface FiltersSheetProps {
  categories: Category[];
  open: boolean;
  onClose: () => void;
  redirectPath?: string;
  hideCategoryFilter?: boolean;
}

// Structure for storing variation types and their unique options
interface VariationFilter {
  name: string; // e.g., "Size", "Color"
  options: string[]; // unique options e.g., ["S", "M", "L"] or ["#FF0000", "#00FF00"]
}

export default function FiltersSheet({
  categories,
  open,
  onClose,
  redirectPath = "/products",
  hideCategoryFilter = false,
}: FiltersSheetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [inStock, setInStock] = useState(
    searchParams.get("in_stock") === "true"
  );

  // Dynamic variation filters - key is variation name, value is selected option
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  // All available variation types and their options
  const [availableVariations, setAvailableVariations] = useState<VariationFilter[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(true);

  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    sort: true,
  });

  // Initialize selected variations from URL params
  useEffect(() => {
    const variations: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      // Check if this key is a variation filter (starts with "var_")
      if (key.startsWith("var_")) {
        const variationName = key.replace("var_", "");
        variations[variationName] = value;
      }
    });
    setSelectedVariations(variations);
  }, [searchParams]);

  // Fetch all products to extract unique variations and options
  useEffect(() => {
    async function fetchVariations() {
      setLoadingVariations(true);
      try {
        const data = await getProducts({ page_size: 1000 });
        if (data?.results) {
          // Map to store variation name -> Set of unique options
          const variationsMap = new Map<string, Set<string>>();

          data.results.forEach((product: Product) => {
            if (product.variations && Array.isArray(product.variations)) {
              product.variations.forEach((variation: unknown) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const variationObj = variation as any;
                const variationName = variationObj.name;

                if (!variationName) return;

                // Initialize set for this variation if not exists
                if (!variationsMap.has(variationName)) {
                  variationsMap.set(variationName, new Set());
                }

                const optionsSet = variationsMap.get(variationName)!;

                // Extract options from the options array
                if (variationObj.options && Array.isArray(variationObj.options)) {
                  variationObj.options.forEach((option: { name?: string }) => {
                    if (option.name && option.name.trim()) {
                      optionsSet.add(option.name.trim());
                    }
                  });
                }

                // Also check values array (alternative structure)
                if (variationObj.values && Array.isArray(variationObj.values)) {
                  variationObj.values.forEach((value: string) => {
                    if (value && typeof value === 'string' && value.trim()) {
                      optionsSet.add(value.trim());
                    }
                  });
                }
              });
            }
          });

          // Convert map to array and sort options
          const variationsArray: VariationFilter[] = [];
          variationsMap.forEach((optionsSet, name) => {
            const options = Array.from(optionsSet);

            // Sort options - sizes get special treatment
            if (name.toLowerCase().includes('size')) {
              const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2XL', '3XL', '4XL'];
              options.sort((a, b) => {
                const aUpper = a.toUpperCase();
                const bUpper = b.toUpperCase();
                const aIndex = sizeOrder.indexOf(aUpper);
                const bIndex = sizeOrder.indexOf(bUpper);

                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                if (aIndex !== -1) return -1;
                if (bIndex !== -1) return 1;

                const aNum = parseFloat(a);
                const bNum = parseFloat(b);
                if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;

                return a.localeCompare(b);
              });
            } else {
              options.sort((a, b) => a.localeCompare(b));
            }

            if (options.length > 0) {
              variationsArray.push({ name, options });

              // Initialize expanded state for this variation
              setExpandedSections(prev => ({
                ...prev,
                [name]: true
              }));
            }
          });

          setAvailableVariations(variationsArray);
        }
      } catch (error) {
        console.error("Error fetching variations:", error);
      } finally {
        setLoadingVariations(false);
      }
    }

    if (open) {
      fetchVariations();
    }
  }, [open]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleVariationSelect = (variationName: string, option: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationName]: prev[variationName] === option ? "" : option
    }));
  };

  // Check if option looks like a hex color
  const isHexColor = (value: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);

  function applyFilters() {
    const params = new URLSearchParams();

    if (selectedCategory && !hideCategoryFilter)
      params.set("category", selectedCategory);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (sort) params.set("sort", sort);
    if (inStock) params.set("in_stock", "true");

    // Add variation filters
    Object.entries(selectedVariations).forEach(([name, value]) => {
      if (value) {
        params.set(`var_${name}`, value);
      }
    });

    params.set("page", "1"); // Always reset pagination

    router.push(`${redirectPath}?${params.toString()}`);
    onClose();
  }

  function clearFilters() {
    router.push(redirectPath);
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setInStock(false);
    setSelectedVariations({});
  }

  return (
    <div
      className={`
        fixed inset-0 bg-black/40 z-50 transition-opacity 
        ${open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
        }
      `}
    >
      <div
        className={`
          absolute right-0 top-0 h-full w-[340px] bg-white shadow-xl 
          transition-transform duration-300 flex flex-col
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-display tracking-wide">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Category */}
          {!hideCategoryFilter && (
            <div className="border-b border-gray-100 pb-4">
              <button
                onClick={() => toggleSection('category')}
                className="flex justify-between items-center w-full py-2"
              >
                <span className="font-medium text-[15px]">Category</span>
                {expandedSections.category ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </button>
              {expandedSections.category && (
                <div className="mt-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-200 p-3 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Variation Filters */}
          {loadingVariations ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
          ) : (
            availableVariations.map((variation) => (
              <div key={variation.name} className="border-b border-gray-100 pb-4">
                <button
                  onClick={() => toggleSection(variation.name)}
                  className="flex justify-between items-center w-full py-2"
                >
                  <span className="font-medium text-[15px]">{variation.name}</span>
                  {expandedSections[variation.name] ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>
                {expandedSections[variation.name] && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {variation.options.map((option) => {
                      const isSelected = selectedVariations[variation.name] === option;
                      const isColor = isHexColor(option);

                      return isColor ? (
                        // Color swatch button
                        <button
                          key={option}
                          onClick={() => handleVariationSelect(variation.name, option)}
                          className={`
                            w-8 h-8 rounded-lg transition-all
                            ${isSelected
                              ? "ring-2 ring-offset-2 ring-black"
                              : "ring-1 ring-gray-200 hover:ring-gray-400"
                            }
                          `}
                          style={{ backgroundColor: option }}
                          title={option}
                        />
                      ) : (
                        // Text button
                        <button
                          key={option}
                          onClick={() => handleVariationSelect(variation.name, option)}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all
                            ${isSelected
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }
                          `}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Price */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex justify-between items-center w-full py-2"
            >
              <span className="font-medium text-[15px]">Price Range</span>
              {expandedSections.price ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
            {expandedSections.price && (
              <div className="mt-3 flex gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    className="border border-gray-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="flex items-center text-gray-400">—</div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    className="border border-gray-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('sort')}
              className="flex justify-between items-center w-full py-2"
            >
              <span className="font-medium text-[15px]">Sort By</span>
              {expandedSections.sort ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>
            {expandedSections.sort && (
              <div className="mt-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-200 p-3 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            )}
          </div>

          {/* In stock */}
          <div className="flex items-center gap-3 py-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black peer-focus:ring-2 peer-focus:ring-black/20 transition-all after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
            <span className="text-[15px]">In Stock Only</span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <button
              onClick={clearFilters}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
