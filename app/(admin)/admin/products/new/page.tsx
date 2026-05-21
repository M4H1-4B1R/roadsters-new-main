"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProductForm from "../_components/ProductForm";
import {
  createProduct,
  getCategoryOptions,
} from "../../_actions/products";

export default function NewProductPage() {
  const router = useRouter();
  const [categoryOptions, setCategoryOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryOptions().then((options) => {
      setCategoryOptions(options);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const result = await createProduct(formData);
    if (!result.error) router.push("/admin/products");
    return result;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <ProductForm
          categoryOptions={categoryOptions}
          onSubmit={handleSubmit}
          submitLabel="Create Product"
        />
      )}
    </div>
  );
}
