import { Product } from "@/types";
import axios from "axios";

// Client for Next.js API routes (SSR data fetching)
const apiClient = axios.create({
  baseURL: process.env.BASE_API_URL,
});

// Client for direct backend API calls (client-side POST requests)
const backendClient = axios.create({
  baseURL: process.env.BASE_API_URL,
});

// Fetch banners
export async function getBanners() {
  try {
    const response = await apiClient.get("/api/banners");
    return response.data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    // Return empty array to match BannerResponse type (BannerItem[])
    return [];
  }
}

// filters is optional → { search, category, price, sort, page, ... }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProducts(filters: Record<string, any> = {}) {
  try {
    const query = new URLSearchParams(filters).toString();

    const response = await apiClient.get(`/api/products?${query}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Re-throw so caller can handle it
      throw {
        status: error.response?.status || 500,
        details: error.response?.data || { error: "Unknown error" },
      };
    }

    throw {
      status: 500,
      details: { error: "Internal server error" },
    };
  }
}

// Fetch product by id
export async function getProductByID({ slug }: { slug: string }) {
  try {
    const response = await apiClient.get(`/api/products/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

// Fetch some products by slug
export async function getSomeProductBySlugs({ favoriteSlugs }: { favoriteSlugs: string[] }) {
  try {
    const products: Product[] = [];
    for (let i = 0; i < favoriteSlugs.length; i++) {
      const slug = favoriteSlugs[i];
      const response = await apiClient.get(`/api/products/${slug}`);
      products.push(response.data);
    }

    return products;
  } catch (error) {
    console.error("Error fetching products by slugs:", error);
    return [];
  }
}

// Fetch categories
export async function getCategories() {
  try {
    const response = await apiClient.get("/api/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return matching CategoriesResponse structure
    return { count: 0, next: null, previous: null, results: [] };
  }
}

// Fetch all Category by id
export async function getCategoryByID({ slug }: { slug: string }) {
  try {
    const response = await apiClient.get(`/api/categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return null;
  }
}

// Fetch sections
export async function getSections() {
  try {
    const response = await apiClient.get("/api/sections");
    return response.data;
  } catch (error) {
    console.error("Error fetching sections:", error);
    // Return empty array to match HomeSectionsResponse (HomeSection[])
    return [];
  }
}

// Fetch swipers
export async function getSwipers() {
  try {
    const response = await apiClient.get("/api/swipers");
    return response.data;
  } catch (error) {
    console.error("Error fetching swipers:", error);
    return [];
  }
}

// Fetch countries
export async function getCountries() {
  try {
    const response = await apiClient.get("/api/countries/");
    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

// Fetch shipping options
export async function getShippingOptions() {
  try {
    const response = await apiClient.get("/api/shipping-options/");
    return response.data;
  } catch (error) {
    console.error("Error fetching shipping options:", error);
    return [];
  }
}

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
