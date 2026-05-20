"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LuShoppingBag } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useTranslations } from "next-intl";
import useFavoritesStore from "@/hooks/useFavoritesStore";
import useCartStore from "@/hooks/useCartStore";
import { useApplicationState } from "@/hooks/useApplicationState";
import { SearchIcon, X, ChevronRight } from "lucide-react";
import { getProducts, getCategories } from "@/lib/utils/api-client";
import { Product, Category } from "@/types";
import Image from "next/image";
import { Sheet, SheetHeader, SheetContent } from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const scrolled = useScrollTop();
  const { cart } = useCartStore();
  const t = useTranslations("Navbar");
  const { isNavSolid } = useApplicationState();
  const { favoriteSlugs } = useFavoritesStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hydration-safe favorites count
  const [favCount, setFavCount] = useState(0);
  useEffect(() => {
    setFavCount(favoriteSlugs.length);
  }, [favoriteSlugs]);

  // Fetch featured categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        if (data?.results) {
          const featured = data.results.filter((cat: Category) => cat.featured);
          setFeaturedCategories(featured.length > 0 ? featured.slice(0, 6) : data.results.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const data = await getProducts();
          if (data && data.results) {
            const filtered = data.results.filter((p: Product) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.name_ar && p.name_ar.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setSearchResults(filtered);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const isHomePage = pathname === "/";
  const isWhiteBg = scrolled || showMobileMenu || isNavSolid;
  const isDarkText = !isHomePage || isWhiteBg;

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/categories/${slug}`);
    setShowMenuSheet(false);
    setShowMobileMenu(false);
  };

  return (
    <header
      className={`
        fixed z-50 transition-all w-full md:px-11 px-4 py-2
        ${isWhiteBg ? "bg-white shadow-sm" : "bg-transparent"}
      `}
    >
      <nav className={`flex justify-between items-center py-2 md:py-3 ${isDarkText ? "text-[#1E1E1E]" : "text-white"}`}>
        {/* Left: Logo and Brand */}
        <div className="flex items-center gap-2 md:gap-4">
          <img src="/min-logo.svg" alt="Min Logo" className="w-8 md:w-10 h-auto" />
          <Link href="/">
            <h1 className="text-xl md:text-4xl font-bold tracking-tight">Roadsters</h1>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <ul className="hidden md:flex items-center justify-center font-normal text-[15px] gap-8">
          {featuredCategories.slice(0, 4).map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="hover:opacity-70 transition-opacity font-display tracking-wide"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-center hover:opacity-70 transition-opacity p-1"
          >
            <SearchIcon size={20} />
          </button>

          <Link href="/cart" className="relative flex items-center justify-center hover:opacity-70 transition-opacity p-1">
            <LuShoppingBag size={20} />
            {cart.length !== 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setShowMenuSheet(true)}
            className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity p-1"
          >
            <RxHamburgerMenu size={22} />
          </button>
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-0 left-0 w-full bg-white shadow-lg z-[60] p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
              <SearchIcon className="text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg outline-none text-[#1E1E1E] placeholder-gray-400 bg-transparent"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-gray-500 hover:text-black p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {searchQuery.length > 0 && (
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {isSearching ? (
                  <p className="text-gray-500 text-center py-4">Searching...</p>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.slug)}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded relative overflow-hidden shrink-0">
                          {(product.image || product.primary_media) && (
                            <Image
                              src={product.image || (product.primary_media as any)?.url || (product.primary_media as any)}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1E1E1E] line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">${product.final_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No products found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Sheet */}
      <Sheet open={showMenuSheet} onClose={() => setShowMenuSheet(false)} side="right">
        <SheetHeader onClose={() => setShowMenuSheet(false)}>Menu</SheetHeader>
        <SheetContent>
          <div className="mb-8">
            <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-1">
              {[
                { name: t("Home"), href: "/" },
                { name: t("Categories"), href: "/categories" },
                { name: t("Products"), href: "/products" },
                { name: t("Contact"), href: "#footer" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setShowMenuSheet(false)}
                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <span className="font-medium">{link.name}</span>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {featuredCategories.length > 0 && (
            <div>
              <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-4">
                Featured Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {featuredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className="group relative overflow-hidden rounded-xl aspect-square bg-gray-100"
                  >
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 text-white text-xs font-display tracking-wide text-left">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}