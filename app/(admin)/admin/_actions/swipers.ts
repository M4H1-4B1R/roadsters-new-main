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
	return {
		image_url: (formData.get("image_url") as string) || null,
		link_url: (formData.get("link_url") as string)?.trim() || null,
		sort_order: Number(formData.get("sort_order")) || 0,
		is_active: formData.get("is_active") === "on",
	};
}

export async function createSwiper(
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const f = readFields(formData);
		if (!f.image_url) return { error: "An image is required" };
		const { error } = await adminDb.from("swipers").insert(f);
		if (error) return { error: error.message };
		revalidatePath("/admin/swipers");
		revalidatePath("/");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function updateSwiper(
	id: number,
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const f = readFields(formData);
		if (!f.image_url) return { error: "An image is required" };
		const { error } = await adminDb.from("swipers").update(f).eq("id", id);
		if (error) return { error: error.message };
		revalidatePath("/admin/swipers");
		revalidatePath(`/admin/swipers/${id}`);
		revalidatePath("/");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function deleteSwiper(
	id: number
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const { error } = await adminDb.from("swipers").delete().eq("id", id);
		if (error) return { error: error.message };
		revalidatePath("/admin/swipers");
		revalidatePath("/");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function getSwiperAction(id: number) {
	try {
		const { data, error } = await adminDb
			.from("swipers")
			.select("*")
			.eq("id", id)
			.single();
		if (error) return { error: error.message };
		if (!data) return { error: "Slide not found" };
		return { item: { ...data, is_active: Boolean((data as { is_active: boolean }).is_active) } };
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}
