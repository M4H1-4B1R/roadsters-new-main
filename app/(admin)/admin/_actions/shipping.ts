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
	const name = (formData.get("name") as string)?.trim();
	const name_ar = (formData.get("name_ar") as string)?.trim() || null;
	const delivery_time = (formData.get("delivery_time") as string)?.trim() || null;
	const priceRaw = formData.get("price");
	const price = priceRaw !== null && priceRaw !== "" ? Number(priceRaw) : NaN;
	const is_active = formData.get("is_active") === "on";
	return { name, name_ar, delivery_time, price, is_active };
}

export async function createShipping(
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const f = readFields(formData);
		if (!f.name) return { error: "Name is required" };
		if (Number.isNaN(f.price)) return { error: "Price is required" };

		const { error } = await adminDb.from("shipping_options").insert({
			name: f.name,
			name_ar: f.name_ar,
			delivery_time: f.delivery_time,
			price: f.price,
			is_active: f.is_active,
		});
		if (error) return { error: error.message };

		revalidatePath("/admin/shipping");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function updateShipping(
	id: number,
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const f = readFields(formData);
		if (!f.name) return { error: "Name is required" };
		if (Number.isNaN(f.price)) return { error: "Price is required" };

		const { error } = await adminDb
			.from("shipping_options")
			.update({
				name: f.name,
				name_ar: f.name_ar,
				delivery_time: f.delivery_time,
				price: f.price,
				is_active: f.is_active
			})
			.eq("id", id);
		if (error) return { error: error.message };

		revalidatePath("/admin/shipping");
		revalidatePath(`/admin/shipping/${id}`);
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}


export async function deleteShipping(
	id: number
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const { error } = await adminDb
			.from("shipping_options")
			.delete()
			.eq("id", id);
		if (error) return { error: error.message };
		revalidatePath("/admin/shipping");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function getShippingAction(id: number) {
	try {
		const { data, error } = await adminDb
			.from("shipping_options")
			.select("*")
			.eq("id", id)
			.single();
		if (error) return { error: error.message };
		if (!data) return { error: "Shipping option not found" };
		return { item: { ...data, is_active: Boolean((data as { is_active: boolean }).is_active) } };
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

