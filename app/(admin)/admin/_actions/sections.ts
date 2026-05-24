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

function readFields(formData: FormData) {
	const title = (formData.get("title") as string)?.trim();
	const title_ar = (formData.get("title_ar") as string)?.trim() || null;
	const sort_order = Number(formData.get("sort_order")) || 0;
	const is_active = formData.get("is_active") === "on";

	// The picker sends the chosen product ids as a JSON array string.
	let product_ids: number[] = [];
	const raw = formData.get("product_ids");
	if (typeof raw === "string" && raw) {
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) {
				product_ids = parsed.map((n) => Number(n)).filter((n) => !Number.isNaN(n));
			}
		} catch {
			/* leave empty on malformed input */
		}
	}

	return { title, title_ar, sort_order, is_active, product_ids };
}

export async function createSection(
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const f = readFields(formData);
		if (!f.title) return { error: "Title is required" };

		const { error } = await adminDb.from("sections").insert(f);
		if (error) return { error: error.message };

		revalidatePath("/admin/sections");
		revalidatePath("/");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function updateSection(
	id: number,
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const f = readFields(formData);
		if (!f.title) return { error: "Title is required" };

		const { error } = await adminDb.from("sections").update(f).eq("id", id);
		if (error) return { error: error.message };

		revalidatePath("/admin/sections");
		revalidatePath(`/admin/sections/${id}`);
		revalidatePath("/");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function deleteSection(
	id: number
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const { error } = await adminDb.from("sections").delete().eq("id", id);
		if (error) return { error: error.message };
		revalidatePath("/admin/sections");
		revalidatePath("/");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function getSectionAction(id: number) {
	try {
		const { data, error } = await adminDb
			.from("sections")
			.select("*")
			.eq("id", id)
			.single();
		if (error) return { error: error.message };
		if (!data) return { error: "Section not found" };
		const raw = data as Record<string, unknown>;
		return {
			item: {
				...raw,
				is_active: Boolean(raw.is_active),
				product_ids: Array.isArray(raw.product_ids) ? raw.product_ids : [],
			},
		};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

// Options for the product picker: all products, id + name.
export async function getProductOptions() {
	const { data } = await adminDb
		.from("products")
		.select("id, name")
		.order("name", { ascending: true });
	return (data ?? []) as Array<{ id: number; name: string }>;
}
