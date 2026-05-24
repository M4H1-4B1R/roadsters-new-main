"use client";

import { useState, useActionState } from "react";
import uploadImage from "../../_actions/upload";

type SwiperFormProps = {
	initialData?: Record<string, unknown>;
	onSubmit: (formData: FormData) => Promise<{ error?: string }>;
	submitLabel: string;
};

export default function SwiperForm({
	initialData,
	onSubmit,
	submitLabel,
}: SwiperFormProps) {
	const [imageUrl, setImageUrl] = useState<string>(
		(initialData?.image_url as string) ?? ""
	);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const [state, formAction, pending] = useActionState(
		async (_prev: { error?: string } | null, formData: FormData) => {
			return await onSubmit(formData);
		},
		null
	);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		setUploadError(null);
		try {
			const result = await uploadImage(file, "swipers");
			if ("url" in result) setImageUrl(result.url);
			else setUploadError(result.error);
		} catch (err) {
			setUploadError(
				err instanceof Error ? err.message : "Upload failed. Try a smaller image."
			);
		} finally {
			setUploading(false);
		}
	};

	return (
		<form action={formAction} className="space-y-6 max-w-2xl">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Image <span className="text-red-500">*</span>
				</label>
				<input type="hidden" name="image_url" value={imageUrl} />
				<div className="flex items-start gap-4">
					<div className="flex-1">
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
						/>
						{uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
						{uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
					</div>
					{imageUrl && (
						<div className="shrink-0">
							<img src={imageUrl} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-gray-200" />
						</div>
					)}
				</div>
			</div>

			<div>
				<label htmlFor="link_url" className="block text-sm font-medium text-gray-700 mb-1">
					Link URL
				</label>
				<input
					id="link_url"
					name="link_url"
					type="text"
					defaultValue={(initialData?.link_url as string) ?? ""}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-1">
						Sort Order
					</label>
					<input
						id="sort_order"
						name="sort_order"
						type="number"
						min={0}
						defaultValue={(initialData?.sort_order as number) ?? 0}
						className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Active</label>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							name="is_active"
							defaultChecked={initialData ? Boolean(initialData.is_active) : true}
							className="sr-only peer"
						/>
						<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
						<span className="ml-3 text-sm text-gray-600">Show on homepage</span>
					</label>
				</div>
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
