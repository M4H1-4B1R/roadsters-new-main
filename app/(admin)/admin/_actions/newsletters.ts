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

export async function deleteSubscriber(
	id: number
): Promise<{ error?: string }> {
	try {
		await requireAdmin();
		const { error } = await adminDb
			.from("newsletter_subscribers")
			.delete()
			.eq("id", id);
		if (error) return { error: error.message };
		revalidatePath("/admin/newsletters");
		return {};
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Unexpected error" };
	}
}
