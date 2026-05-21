"use server";

import { adminDb } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) throw new Error("Unauthorized");
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET!)
    );
    if (payload.role !== "admin") throw new Error("Unauthorized");
  } catch {
    throw new Error("Unauthorized");
  }
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: number
): Promise<string> {
  let slug = baseSlug;
  let counter = 0;
  while (counter < 100) {
    const baseQuery = adminDb
      .from("categories")
      .select("id")
      .eq("slug", slug);
    const refinedQuery =
      excludeId !== undefined
        ? baseQuery.neq("id", excludeId).maybeSingle()
        : baseQuery.maybeSingle();
    const { data } = await refinedQuery;
    if (!data) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  throw new Error("Unable to generate unique slug");
}

function readCategoryFields(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const name_ar = (formData.get("name_ar") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const description_ar =
    (formData.get("description_ar") as string)?.trim() || null;
  const parentIdRaw = formData.get("parent_id");
  const parent_id =
    parentIdRaw && parentIdRaw !== "" ? Number(parentIdRaw) : null;
  const featured = formData.get("featured") === "on";
  const is_active = formData.get("is_active") === "on";
  const image_url = (formData.get("image_url") as string) || null;
  const sort_order = Number(formData.get("sort_order")) || 0;

  return {
    name,
    name_ar,
    description,
    description_ar,
    parent_id,
    featured,
    is_active,
    image_url,
    sort_order,
  };
}

export async function createCategory(
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
    const fields = readCategoryFields(formData);

    if (!fields.name) return { error: "Name is required" };

    const baseSlug = generateSlug(fields.name);
    if (!baseSlug) return { error: "Name must contain valid characters for slug generation" };

    const slug = await ensureUniqueSlug(baseSlug);

    const { error } = await adminDb
      .from("categories")
      .insert({
        slug,
        name: fields.name,
        name_ar: fields.name_ar,
        description: fields.description,
        description_ar: fields.description_ar,
        parent_id: fields.parent_id,
        featured: fields.featured,
        is_active: fields.is_active,
        image_url: fields.image_url,
        sort_order: fields.sort_order,
      })
      .select()
      .single();

    if (error) return { error: error.message };

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return {};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function updateCategory(
  id: number,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
    const fields = readCategoryFields(formData);

    if (!fields.name) return { error: "Name is required" };

    const baseSlug = generateSlug(fields.name);
    if (!baseSlug) return { error: "Name must contain valid characters for slug generation" };

    const slug = await ensureUniqueSlug(baseSlug, id);

    const { error } = await adminDb
      .from("categories")
      .update({
        slug,
        name: fields.name,
        name_ar: fields.name_ar,
        description: fields.description,
        description_ar: fields.description_ar,
        parent_id: fields.parent_id,
        featured: fields.featured,
        is_active: fields.is_active,
        image_url: fields.image_url,
        sort_order: fields.sort_order,
      })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    revalidatePath("/categories");
    return {};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function deleteCategory(
  id: number
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
    const { count: subCount } = await adminDb
      .from("categories")
      .select("id", { count: "exact", head: true })
      .eq("parent_id", id);

    if (subCount && subCount > 0) {
      return {
        error: `Cannot delete: ${subCount} subcategor${subCount === 1 ? "y" : "ies"} reference${subCount === 1 ? "s" : ""} this category`,
      };
    }

    const { count: prodCount } = await adminDb
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (prodCount && prodCount > 0) {
      return {
        error: `Cannot delete: ${prodCount} product${prodCount === 1 ? "" : "s"} ${prodCount === 1 ? "is" : "are"} in this category`,
      };
    }

    const { error } = await adminDb
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return {};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function getCategoryAction(id: number) {
  try {
    const { data: category, error } = await adminDb
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return { error: error.message };
    if (!category) return { error: "Category not found" };

    const raw = category as Record<string, unknown>;

    let parentName: string | null = null;
    if (raw.parent_id) {
      const { data: parent } = await adminDb
        .from("categories")
        .select("name")
        .eq("id", raw.parent_id)
        .single();
      if (parent) {
        parentName = (parent as { name: string }).name;
      }
    }

    return {
      category: {
        ...raw,
        parentName,
        featured: Boolean(raw.featured),
        is_active: Boolean(raw.is_active),
      },
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function getParentOptions(excludeId?: number) {
  let query = adminDb
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (excludeId !== undefined) {
    query = query.neq("id", excludeId);
  }

  const { data } = await query;
  return (data ?? []) as Array<{ id: number; name: string }>;
}
