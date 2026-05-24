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
	const code = (formData.get("code") as string)?.trim().toUpperCase();
	const discount_type = formData.get("discount_type") as string;
	const discountValueRaw = formData.get("discount_value");
	const discount_value =
		discountValueRaw !== null && discountValueRaw !== ""
			? Number(discountValueRaw)
			: NaN;
	const min_order_amount = Number(formData.get("min_order_amount")) || 0;
	const usageLimitRaw = formData.get("usage_limit");
	const usage_limit =
		usageLimitRaw && usageLimitRaw !== "" ? Number(usageLimitRaw) : null;
	const expiresRaw = (formData.get("expires_at") as string)?.trim();
	// datetime-local gives "2026-05-23T14:00"; store as ISO timestamp or null.
	const expires_at = expiresRaw ? new Date(expiresRaw).toISOString() : null;
	const is_active = formData.get("is_active") === "on";

	return {
		code,
		discount_type,
		discount_value,
		min_order_amount,
		usage_limit,
		expires_at,
		is_active,
	};
}

function validate(f: ReturnType<typeof readFields>): string | null {
	if (!f.code) return "Code is required";
	if (f.discount_type !== "percentage" && f.discount_type !== "fixed")
		return "Discount type must be percentage or fixed";
	if (Number.isNaN(f.discount_value)) return "Discount value is required";
	if (f.discount_type === "percentage" && (f.discount_value <= 0 || f.discount_value > 100))
		return "Percentage must be between 1 and 100";
	return null;
}

export async function createCoupon(
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const f = readFields(formData);
		const err = validate(f);
		if (err) return { error: err };

		const { error } = await adminDb.from("coupons").insert(f);
		if (error) {
			if (error.message.includes("duplicate") || error.code === "23505")
				return { error: `Coupon code "${f.code}" already exists` };
			return { error: error.message };
		}
		revalidatePath("/admin/coupons");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function updateCoupon(
	id: number,
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const f = readFields(formData);
		const err = validate(f);
		if (err) return { error: err };

		// Note: used_count is intentionally NOT updated here.
		const { error } = await adminDb.from("coupons").update(f).eq("id", id);
		if (error) {
			if (error.message.includes("duplicate") || error.code === "23505")
				return { error: `Coupon code "${f.code}" already exists` };
			return { error: error.message };
		}
		revalidatePath("/admin/coupons");
		revalidatePath(`/admin/coupons/${id}`);
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function deleteCoupon(
	id: number
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const { error } = await adminDb.from("coupons").delete().eq("id", id);
		if (error) return { error: error.message };
		revalidatePath("/admin/coupons");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}

export async function getCouponAction(id: number) {
	try {
		const { data, error } = await adminDb
			.from("coupons")
			.select("*")
			.eq("id", id)
			.single();
		if (error) return { error: error.message };
		if (!data) return { error: "Coupon not found" };
		const raw = data as Record<string, unknown>;
		// datetime-local needs "YYYY-MM-DDTHH:mm"; trim the stored ISO string.
		const expiresLocal = raw.expires_at
			? String(raw.expires_at).slice(0, 16)
			: "";
		return {
			item: { ...raw, is_active: Boolean(raw.is_active), expires_local: expiresLocal },
		};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}
