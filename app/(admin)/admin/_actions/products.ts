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
			.from("products")
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


type VideoInput = { video_url: string; thumbnail_url?: string | null };
type OptionInput = { value: string; value_ar?: string | null };
type VariationInput = {
	name: string;
	name_ar?: string | null;
	options: OptionInput[];
};

function parseJsonArray<T>(formData: FormData, key: string): T[] {
	const raw = formData.get(key);
	if (typeof raw !== "string" || !raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as T[]) : [];
	} catch {
		return [];
	}
}

// Delete all videos for a product and re-insert the submitted list in order.
async function replaceVideos(productId: number, videos: VideoInput[]) {
	await adminDb.from("product_videos").delete().eq("product_id", productId);
	const rows = videos
		.filter((v) => v.video_url?.trim())
		.map((v, i) => ({
			product_id: productId,
			video_url: v.video_url.trim(),
			thumbnail_url: v.thumbnail_url?.trim() || null,
			sort_order: i,
		}));
	if (rows.length > 0) {
		const { error } = await adminDb.from("product_videos").insert(rows);
		if (error) throw new Error(`Failed to save videos: ${error.message}`);
	}
}

// Delete all variations (cascades to variation_options) and re-insert.
// Also clears variation_combinations, since stale option ids would be invalid.
async function replaceVariations(
	productId: number,
	variations: VariationInput[]
) {
	await adminDb
		.from("variation_combinations")
		.delete()
		.eq("product_id", productId);
	await adminDb.from("variations").delete().eq("product_id", productId);

	for (const v of variations) {
		if (!v.name?.trim()) continue;
		const { data: varRow, error: varErr } = await adminDb
			.from("variations")
			.insert({
				product_id: productId,
				name: v.name.trim(),
				name_ar: v.name_ar?.trim() || null,
			})
			.select("id")
			.single();
		if (varErr) throw new Error(`Failed to save variation: ${varErr.message}`);

		const optionRows = (v.options ?? [])
			.filter((o) => o.value?.trim())
			.map((o) => ({
				variation_id: (varRow as { id: number }).id,
				value: o.value.trim(),
				value_ar: o.value_ar?.trim() || null,
			}));
		if (optionRows.length > 0) {
			const { error: optErr } = await adminDb
				.from("variation_options")
				.insert(optionRows);
			if (optErr)
				throw new Error(`Failed to save variation options: ${optErr.message}`);
		}
	}
}

export async function createProduct(
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();

		const name = (formData.get("name") as string)?.trim();
		if (!name) return { error: "Name is required" };

		const baseSlug = generateSlug(name);
		if (!baseSlug)
			return {
				error: "Name must contain valid characters for slug generation",
			};
		const slug = await ensureUniqueSlug(baseSlug);

		const name_ar = (formData.get("name_ar") as string)?.trim() || null;
		const description =
			(formData.get("description") as string)?.trim() || null;
		const description_ar =
			(formData.get("description_ar") as string)?.trim() || null;
		const price = parseFloat(formData.get("price") as string);
		if (isNaN(price)) return { error: "Price is required and must be a number" };

		const salePriceRaw = formData.get("sale_price") as string;
		const sale_price = salePriceRaw ? parseFloat(salePriceRaw) : null;

		const categoryIdRaw = formData.get("category_id") as string;
		const category_id = categoryIdRaw ? Number(categoryIdRaw) : null;

		const stock = parseInt(formData.get("stock") as string) || 0;
		const is_featured = formData.get("is_featured") === "on";
		const is_active = formData.get("is_active") === "on";

		const imageUrlsRaw = formData.get("image_urls") as string;
		const imageUrls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

		const { data: product, error: insertError } = await adminDb
			.from("products")
			.insert({
				slug,
				name,
				name_ar,
				description,
				description_ar,
				price,
				sale_price,
				category_id,
				stock: Number.isNaN(stock) ? 0 : stock,
				is_featured,
				is_active,
			})
			.select("id")
			.single();

		if (insertError) return { error: insertError.message };
		if (!product) return { error: "Failed to create product" };

		const productId = (product as { id: number }).id;

		if (imageUrls.length > 0) {
			const imageRows = imageUrls.map((url, i) => ({
				product_id: productId,
				image_url: url,
				is_primary: i === 0,
				sort_order: i,
			}));

			const { error: imgError } = await adminDb
				.from("product_images")
				.insert(imageRows);

			if (imgError) {
				// Roll back the product so we don't leave a half-saved row behind.
				await adminDb.from("products").delete().eq("id", productId);
				return { error: `Failed to attach images: ${imgError.message}` };
			}
		}


		// Save videos + variations. If any fail, roll back the whole product
		// (cascades delete its images/videos/variations) to avoid half-saved data.
		try {
			await replaceVideos(productId, parseJsonArray<VideoInput>(formData, "videos"));
			await replaceVariations(
				productId,
				parseJsonArray<VariationInput>(formData, "variations")
			);
		} catch (childErr) {
			await adminDb.from("products").delete().eq("id", productId);
			return {
				error:
					childErr instanceof Error
						? childErr.message
						: "Failed to save product details",
			};
		}

		revalidatePath("/admin/products");
		revalidatePath(`/products/${slug}`);
		revalidatePath("/products");
		revalidatePath("/categories");
		return {};
	} catch (err) {
		return {
			error:
				err instanceof Error ? err.message : "An unexpected error occurred",
		};
	}
}

export async function updateProduct(
	id: number,
	formData: FormData
): Promise<{ error?: string }> {
	try {
		await requireAdmin();

		const name = (formData.get("name") as string)?.trim();
		if (!name) return { error: "Name is required" };

		const baseSlug = generateSlug(name);
		if (!baseSlug)
			return {
				error: "Name must contain valid characters for slug generation",
			};
		const slug = await ensureUniqueSlug(baseSlug, id);

		const name_ar = (formData.get("name_ar") as string)?.trim() || null;
		const description =
			(formData.get("description") as string)?.trim() || null;
		const description_ar =
			(formData.get("description_ar") as string)?.trim() || null;
		const price = parseFloat(formData.get("price") as string);
		if (isNaN(price))
			return { error: "Price is required and must be a number" };

		const salePriceRaw = formData.get("sale_price") as string;
		const sale_price = salePriceRaw ? parseFloat(salePriceRaw) : null;

		const categoryIdRaw = formData.get("category_id") as string;
		const category_id = categoryIdRaw ? Number(categoryIdRaw) : null;

		const stock = parseInt(formData.get("stock") as string) || 0;
		const is_featured = formData.get("is_featured") === "on";
		const is_active = formData.get("is_active") === "on";

		const { error: updateError } = await adminDb
			.from("products")
			.update({
				slug,
				name,
				name_ar,
				description,
				description_ar,
				price,
				sale_price,
				category_id,
				stock: Number.isNaN(stock) ? 0 : stock,
				is_featured,
				is_active,
			})
			.eq("id", id);

		if (updateError) return { error: updateError.message };

		const imageUrlsRaw = formData.get("image_urls") as string;
		const imageUrls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

		const { data: existingImages } = await adminDb
			.from("product_images")
			.select("id, image_url, is_primary, sort_order")
			.eq("product_id", id)
			.order("sort_order", { ascending: true });

		const existingList = (existingImages ?? []) as Array<{
			id: number;
			image_url: string;
			is_primary: boolean;
			sort_order: number;
		}>;
		const existingUrlSet = new Set(existingList.map((img) => img.image_url));
		const submittedUrlSet = new Set(imageUrls);

		const toRemove = existingList.filter(
			(img) => !submittedUrlSet.has(img.image_url)
		);
		const toAdd = imageUrls.filter((url) => !existingUrlSet.has(url));

		if (toRemove.length > 0) {
			const idsToRemove = toRemove.map((img) => img.id);
			const { error: delError } = await adminDb
				.from("product_images")
				.delete()
				.in("id", idsToRemove);

			if (delError) return { error: delError.message };

			for (const img of toRemove) {
				try {
					const path = img.image_url.split("/").pop();
					if (path) {
						await adminDb.storage.from("image").remove([path]);
					}
				} catch {
					// Best-effort
				}
			}
		}

		if (toAdd.length > 0) {
			const imageRows = toAdd.map((url, i) => ({
				product_id: id,
				image_url: url,
				is_primary: false,
				sort_order: imageUrls.indexOf(url),
			}));

			const { error: imgInsertError } = await adminDb
				.from("product_images")
				.insert(imageRows);

			if (imgInsertError) return { error: imgInsertError.message };
		}

		const { error: reorderError } = await adminDb
			.from("product_images")
			.update({ is_primary: false })
			.eq("product_id", id);

		if (reorderError) return { error: reorderError.message };

		for (let i = 0; i < imageUrls.length; i++) {
			const { error: imgUpdateError } = await adminDb
				.from("product_images")
				.update({ sort_order: i, is_primary: i === 0 })
				.eq("product_id", id)
				.eq("image_url", imageUrls[i]);

			if (imgUpdateError) return { error: imgUpdateError.message };
		}


		// Full-replace child rows (videos + variations) from the submitted form.
		try {
			await replaceVideos(id, parseJsonArray<VideoInput>(formData, "videos"));
			await replaceVariations(
				id,
				parseJsonArray<VariationInput>(formData, "variations")
			);
		} catch (childErr) {
			return {
				error:
					childErr instanceof Error
						? childErr.message
						: "Failed to save product details",
			};
		}

		revalidatePath("/admin/products");
		revalidatePath(`/admin/products/${id}`);
		revalidatePath(`/products/${slug}`);
		revalidatePath("/products");
		revalidatePath("/categories");
		return {};
	} catch (err) {
		return {
			error:
				err instanceof Error ? err.message : "An unexpected error occurred",
		};
	}
}

export async function deleteProduct(
	id: number
): Promise<{ error?: string }> {
	try {
		await requireAdmin();

		const { data: images } = await adminDb
			.from("product_images")
			.select("image_url")
			.eq("product_id", id);

		if (images) {
			for (const img of images as { image_url: string }[]) {
				try {
					const path = img.image_url.split("/").pop();
					if (path) {
						await adminDb.storage.from("image").remove([path]);
					}
				} catch {
					// Best-effort
				}
			}
		}

		const { error } = await adminDb.from("products").delete().eq("id", id);

		if (error) return { error: error.message };

		revalidatePath("/admin/products");
		revalidatePath("/products");
		revalidatePath("/categories");
		return {};
	} catch (err) {
		return {
			error:
				err instanceof Error ? err.message : "An unexpected error occurred",
		};
	}
}

export async function getProductAction(id: number) {
	try {
		const { data: product, error } = await adminDb
			.from("products")
			.select("*")
			.eq("id", id)
			.single();

		if (error) return { error: error.message };
		if (!product) return { error: "Product not found" };

		const raw = product as Record<string, unknown>;

		const { data: category } = await adminDb
			.from("categories")
			.select("name")
			.eq("id", raw.category_id as number)
			.single();

		const { data: images } = await adminDb
			.from("product_images")
			.select("*")
			.eq("product_id", id)
			.order("sort_order", { ascending: true });

		const { data: videos } = await adminDb
			.from("product_videos")
			.select("*")
			.eq("product_id", id)
			.order("sort_order", { ascending: true });

		const { data: variations } = await adminDb
			.from("variations")
			.select("*, options:variation_options(*)")
			.eq("product_id", id);


		return {
			product: {
				...raw,
				category_name: category
					? (category as { name: string }).name
					: null,
				images: (images ?? []) as Array<{
					id: number;
					product_id: number;
					image_url: string;
					is_primary: boolean;
					sort_order: number;
				}>,
				videos: (videos ?? []).map((v) => ({
					video_url: (v as { video_url: string }).video_url,
					thumbnail_url: (v as { thumbnail_url: string | null }).thumbnail_url,
				})),
				variations: (variations ?? []).map((vr) => {
					const v = vr as {
						name: string;
						name_ar: string | null;
						options?: Array<{ value: string; value_ar: string | null }>;
					};
					return {
						name: v.name,
						name_ar: v.name_ar,
						options: (v.options ?? []).map((o) => ({
							value: o.value,
							value_ar: o.value_ar,
						})),
					};
				}),
			},
		};
	} catch (err) {
		return {
			error:
				err instanceof Error ? err.message : "An unexpected error occurred",
		};
	}
}

export async function getCategoryOptions() {
	const { data } = await adminDb
		.from("categories")
		.select("id, name")
		.order("name", { ascending: true });

	return (data ?? []) as Array<{ id: number; name: string }>;
}
