"use client";

import { useState } from "react";
import { useActionState } from "react";
import uploadImage from "../../_actions/upload";
import { X } from "lucide-react";

interface ProductImage {
	id?: number;
	image_url: string;
	is_primary: boolean;
	sort_order: number;
}

type ProductFormProps = {
	initialData?: Record<string, unknown>;
	categoryOptions: Array<{ id: number; name: string }>;
	onSubmit: (formData: FormData) => Promise<{ error?: string }>;
	submitLabel: string;
};

export default function ProductForm({
	initialData,
	categoryOptions,
	onSubmit,
	submitLabel,
}: ProductFormProps) {
	const [images, setImages] = useState<ProductImage[]>(
		(initialData?.images as ProductImage[]) || []
	);

	const [videos, setVideos] = useState<
		{ video_url: string; thumbnail_url: string | null }[]
	>((initialData?.videos as { video_url: string; thumbnail_url: string | null }[]) || []);

	type OptionRow = { value: string; value_ar: string | null };
	type VariationRow = { name: string; name_ar: string | null; options: OptionRow[] };
	const [variations, setVariations] = useState<VariationRow[]>(
		(initialData?.variations as VariationRow[]) || []
	);

	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [featured, setFeatured] = useState(
		Boolean(initialData?.is_featured ?? false)
	);
	const [active, setActive] = useState(
		Boolean(initialData?.is_active ?? true)
	);

	const [state, formAction, pending] = useActionState(
		async (_prev: { error?: string } | null, formData: FormData) => {
			formData.set(
				"image_urls",
				JSON.stringify(images.map((img) => img.image_url))
			);
			formData.set("videos", JSON.stringify(videos));
			formData.set("variations", JSON.stringify(variations));
			return await onSubmit(formData);
		},
		null
	);

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		setUploadError(null);
		try {
			const result = await uploadImage(file, "products");
			if ("url" in result) {
				setImages((prev) => [
					...prev,
					{
						image_url: result.url,
						is_primary: prev.length === 0,
						sort_order: prev.length,
					},
				]);
			} else {
				setUploadError(result.error);
			}
		} catch (err) {
			setUploadError(
				err instanceof Error ? err.message : "Upload failed. Try a smaller image."
			);
		} finally {
			setUploading(false);
		}
	};

	const removeImage = (index: number) => {
		setImages((prev) => {
			const updated = prev.filter((_, i) => i !== index);
			return updated.map((img, i) => ({
				...img,
				is_primary: i === 0,
				sort_order: i,
			}));
		});
	};

	const setPrimary = (index: number) => {
		setImages((prev) =>
			prev.map((img, i) => ({
				...img,
				is_primary: i === index,
			}))
		);
	};

	const addVariation = () =>
		setVariations((prev) => [...prev, { name: "", name_ar: null, options: [] }]);
	const removeVariation = (vi: number) =>
		setVariations((prev) => prev.filter((_, i) => i !== vi));
	const setVariationField = (vi: number, field: "name" | "name_ar", val: string) =>
		setVariations((prev) =>
			prev.map((v, i) => (i === vi ? { ...v, [field]: val || null } : v))
		);
	const addOption = (vi: number) =>
		setVariations((prev) =>
			prev.map((v, i) =>
				i === vi ? { ...v, options: [...v.options, { value: "", value_ar: null }] } : v
			)
		);
	const removeOption = (vi: number, oi: number) =>
		setVariations((prev) =>
			prev.map((v, i) =>
				i === vi ? { ...v, options: v.options.filter((_, j) => j !== oi) } : v
			)
		);
	const setOptionField = (
		vi: number,
		oi: number,
		field: "value" | "value_ar",
		val: string
	) =>
		setVariations((prev) =>
			prev.map((v, i) =>
				i === vi
					? {
						...v,
						options: v.options.map((o, j) =>
							j === oi ? { ...o, [field]: val || null } : o
						),
					}
					: v
			)
		);

	return (
		<form action={formAction} className="space-y-6 max-w-2xl">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Name <span className="text-red-500">*</span>
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						defaultValue={(initialData?.name as string) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label
						htmlFor="name_ar"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Name (Arabic)
					</label>
					<input
						id="name_ar"
						name="name_ar"
						type="text"
						dir="rtl"
						defaultValue={(initialData?.name_ar as string) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows={3}
						defaultValue={(initialData?.description as string) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
					/>
				</div>
				<div>
					<label
						htmlFor="description_ar"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Description (Arabic)
					</label>
					<textarea
						id="description_ar"
						name="description_ar"
						rows={3}
						dir="rtl"
						defaultValue={(initialData?.description_ar as string) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div>
					<label
						htmlFor="price"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Price <span className="text-red-500">*</span>
					</label>
					<input
						id="price"
						name="price"
						type="number"
						step="0.01"
						min={0}
						required
						defaultValue={(initialData?.price as number) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label
						htmlFor="sale_price"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Sale Price
					</label>
					<input
						id="sale_price"
						name="sale_price"
						type="number"
						step="0.01"
						min={0}
						defaultValue={(initialData?.sale_price as number) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label
						htmlFor="stock"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Stock
					</label>
					<input
						id="stock"
						name="stock"
						type="number"
						min={0}
						defaultValue={(initialData?.stock as number) ?? 0}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div>
				<label
					htmlFor="category_id"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Category
				</label>
				<select
					id="category_id"
					name="category_id"
					defaultValue={
						initialData?.category_id
							? String(initialData.category_id)
							: ""
					}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
				>
					<option value="">No category</option>
					{categoryOptions.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.name}
						</option>
					))}
				</select>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Featured
					</label>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							name="is_featured"
							checked={featured}
							onChange={(e) => setFeatured(e.target.checked)}
							className="sr-only peer"
						/>
						<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
						<span className="ml-3 text-sm text-gray-600">
							{featured ? "Yes" : "No"}
						</span>
					</label>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Active
					</label>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							name="is_active"
							checked={active}
							onChange={(e) => setActive(e.target.checked)}
							className="sr-only peer"
						/>
						<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
						<span className="ml-3 text-sm text-gray-600">
							{active ? "Yes" : "No"}
						</span>
					</label>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Images
				</label>
				<div className="flex items-start gap-4 mb-3">
					<div className="flex-1">
						<input
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
						/>
						{uploading && (
							<p className="text-xs text-gray-500 mt-1">Uploading...</p>
						)}
						{uploadError && (
							<p className="text-xs text-red-600 mt-1">{uploadError}</p>
						)}
					</div>
				</div>
				{images.length > 0 && (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{images.map((img, i) => (
							<div
								key={i}
								className="relative group border border-gray-200 rounded-lg overflow-hidden"
							>
								<img
									src={img.image_url}
									alt={`Product image ${i + 1}`}
									className="w-full aspect-square object-cover"
								/>
								{img.is_primary && (
									<span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
										Primary
									</span>
								)}
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
									{!img.is_primary && (
										<button
											type="button"
											onClick={() => setPrimary(i)}
											className="p-1 bg-white rounded text-xs text-gray-700 hover:bg-gray-100"
											title="Set as primary"
										>
											★
										</button>
									)}
									<button
										type="button"
										onClick={() => removeImage(i)}
										className="p-1 bg-white rounded text-xs text-red-600 hover:bg-red-50"
										title="Remove image"
									>
										<X size={14} />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
				<p className="text-xs text-gray-400 mt-1">
					First image is set as primary. Hover to change primary or remove.
				</p>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Videos</label>
				{videos.map((v, i) => (
					<div key={i} className="flex items-center gap-2 mb-2">
						<input
							type="url"
							value={v.video_url}
							onChange={(e) =>
								setVideos((prev) =>
									prev.map((x, j) =>
										j === i ? { ...x, video_url: e.target.value } : x
									)
								)
							}
							placeholder="https://… (mp4 or hosted video URL)"
							className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<input
							type="url"
							value={v.thumbnail_url ?? ""}
							onChange={(e) =>
								setVideos((prev) =>
									prev.map((x, j) =>
										j === i
											? { ...x, thumbnail_url: e.target.value || null }
											: x
									)
								)
							}
							placeholder="thumbnail URL (optional)"
							className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<button
							type="button"
							onClick={() => setVideos((prev) => prev.filter((_, j) => j !== i))}
							className="p-2 text-red-500 hover:text-red-700"
							title="Remove video"
						>
							<X size={16} />
						</button>
					</div>
				))}
				<button
					type="button"
					onClick={() =>
						setVideos((prev) => [...prev, { video_url: "", thumbnail_url: null }])
					}
					className="text-sm font-medium text-blue-600 hover:text-blue-700"
				>
					+ Add video
				</button>
				<p className="text-xs text-gray-400 mt-1">
					Paste a direct video URL (e.g. an .mp4 you uploaded somewhere, or a hosted link). Empty rows are ignored on save.
				</p>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Variations</label>
				{variations.map((v, vi) => (
					<div key={vi} className="border border-gray-200 rounded-lg p-3 mb-3 space-y-3">
						<div className="flex items-center gap-2">
							<input
								type="text"
								value={v.name}
								onChange={(e) => setVariationField(vi, "name", e.target.value)}
								placeholder="Variation name (e.g. Size)"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<input
								type="text"
								dir="rtl"
								value={v.name_ar ?? ""}
								onChange={(e) => setVariationField(vi, "name_ar", e.target.value)}
								placeholder="الاسم بالعربية"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<button
								type="button"
								onClick={() => removeVariation(vi)}
								className="p-2 text-red-500 hover:text-red-700"
								title="Remove variation"
							>
								<X size={16} />
							</button>
						</div>

						<div className="pl-3 border-l-2 border-gray-100 space-y-2">
							{v.options.map((o, oi) => (
								<div key={oi} className="flex items-center gap-2">
									<input
										type="text"
										value={o.value}
										onChange={(e) => setOptionField(vi, oi, "value", e.target.value)}
										placeholder="Option (e.g. Small)"
										className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
									<input
										type="text"
										dir="rtl"
										value={o.value_ar ?? ""}
										onChange={(e) => setOptionField(vi, oi, "value_ar", e.target.value)}
										placeholder="القيمة بالعربية"
										className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
									<button
										type="button"
										onClick={() => removeOption(vi, oi)}
										className="p-1.5 text-red-500 hover:text-red-700"
										title="Remove option"
									>
										<X size={14} />
									</button>
								</div>
							))}
							<button
								type="button"
								onClick={() => addOption(vi)}
								className="text-xs font-medium text-blue-600 hover:text-blue-700"
							>
								+ Add option
							</button>
						</div>
					</div>
				))}
				<button
					type="button"
					onClick={addVariation}
					className="text-sm font-medium text-blue-600 hover:text-blue-700"
				>
					+ Add variation
				</button>
				<p className="text-xs text-gray-400 mt-1">
					Example: a "Size" variation with options Small / Medium / Large. Empty names/options are ignored on save.
				</p>
			</div>

			{state?.error && (
				<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
					{state.error}
				</p>
			)}

			<div className="flex items-center gap-3 pt-2">
				<button
					type="submit"
					disabled={pending || uploading}
					className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{pending ? "Saving..." : submitLabel}
				</button>
			</div>
		</form>
	);
}
