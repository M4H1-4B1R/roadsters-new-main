"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import CategoryForm from "../_components/CategoryForm";
import {
  getCategoryAction,
  updateCategory,
  deleteCategory,
  getParentOptions,
} from "../../_actions/categories";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [category, setCategory] = useState<Record<string, unknown> | null>(
    null
  );
  const [parentOptions, setParentOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const [catResult, options] = await Promise.all([
        getCategoryAction(Number(id)),
        getParentOptions(Number(id)),
      ]);
      if ("error" in catResult) {
        setError(catResult.error ?? "An unknown error occurred");
      } else {
        setCategory(catResult.category as Record<string, unknown>);
      }
      setParentOptions(options);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSubmit = async (formData: FormData) => {
    const result = await updateCategory(Number(id), formData);
    if (!result.error) router.push("/admin/categories");
    return result;
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    setDeleting(true);
    const result = await deleteCategory(Number(id));
    if (result.error) {
      setError(result.error);
      setDeleting(false);
    } else {
      router.push("/admin/categories");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/categories"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
          <Link
            href="/admin/categories"
            className="text-sm text-red-600 hover:text-red-800 font-medium mt-2 inline-block"
          >
            Back to categories
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/categories"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        </div>
        <p className="text-sm text-gray-500">Category not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit: {(category.name as string) ?? ""}
          </h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 size={16} />
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <CategoryForm
        initialData={category as Record<string, unknown>}
        parentOptions={parentOptions}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
