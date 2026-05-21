"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CategoryForm from "../_components/CategoryForm";
import {
  createCategory,
  getParentOptions,
} from "../../_actions/categories";

export default function NewCategoryPage() {
  const router = useRouter();
  const [parentOptions, setParentOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParentOptions().then((options) => {
      setParentOptions(options);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const result = await createCategory(formData);
    if (!result.error) router.push("/admin/categories");
    return result;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/categories"
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Category</h1>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <CategoryForm
          parentOptions={parentOptions}
          onSubmit={handleSubmit}
          submitLabel="Create Category"
        />
      )}
    </div>
  );
}
