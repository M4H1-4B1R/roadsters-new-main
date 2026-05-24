"use client";

import { useState, useActionState } from "react";
import { X, ArrowUp, ArrowDown } from "lucide-react";

type ProductOption = { id: number; name: string };

type SectionFormProps = {
	initialData?: Record<string, unknown>;
	productOptions: ProductOption[];
	onSubmit: (formData: FormData) => Promise<{ error?: string }>;
	submitLabel: string;
};

export default function SectionForm({
	initialData,
	productOptions,
	onSubmit,
	submitLabel,
}: SectionFormProps) {
	const [selectedIds, setSelectedIds] = useState<number[]>(
		(initialData?.product_ids as number[]) ?? []
	);

	const [state, formAction, pending] = useActionState(
		async (_prev: { error?: string } | null, formData: FormData) => {
			formData.set("product_ids", JSON.stringify(selectedIds));
			return await onSubmit(formData);
		},
		null
	);

	const nameById = new Map(productOptions.map((p) => [p.id, p.name]));

	const addProduct = (id: number) => {
		if (!id || selectedIds.includes(id)) return;
		setSelectedIds((prev) => [...prev, id]);
	};
	const removeProduct = (id: number) =>
		setSelectedIds((prev) => prev.filter((x) => x !== id));
	const move = (index: number, dir: -1 | 1) =>
		setSelectedIds((prev) => {
			const next = [...prev];
			const target = index + dir;
			if (target < 0 || target >= next.length) return prev;
			[next[index], next[target]] = [next[target], next[index]];
			return next;
		});

	return (
		<form action={formAction} className="space-y-6 max-w-2xl">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
						Title <span className="text-red-500">*</span>
					</label>
					<input
						id="title"
						name="title"
						type="text"
						required
						defaultValue={(initialData?.title as string) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label htmlFor="title_ar" className="block text-sm font-medium text-gray-700 mb-1">
						Title (Arabic)
					</label>
					<input
						id="title_ar"
						name="title_ar"
						type="text"
						dir="rtl"
						defaultValue={(initialData?.title_ar as string) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Products</label>
				<input type="hidden" name="product_ids" value={JSON.stringify(selectedIds)} />
				<select
					value=""
					onChange={(e) => {
						addProduct(Number(e.target.value));
						e.target.value = "";
					}}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
				>
					<option value="">+ Add a product…</option>
					{productOptions
						.filter((p) => !selectedIds.includes(p.id))
						.map((p) => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
				</select>

				{selectedIds.length === 0 ? (
					<p className="text-xs text-gray-400">No products selected yet.</p>
				) : (
					<ul className="space-y-2">
						{selectedIds.map((id, index) => (
							<li
								key={id}
								className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
							>
								<span className="text-gray-800">
									{index + 1}. {nameById.get(id) ?? `Product #${id}`}
								</span>
								<span className="flex items-center gap-1">
									<button type="button" onClick={() => move(index, -1)} className="p-1 text-gray-400 hover:text-gray-700" title="Move up">
										<ArrowUp size={14} />
									</button>
									<button type="button" onClick={() => move(index, 1)} className="p-1 text-gray-400 hover:text-gray-700" title="Move down">
										<ArrowDown size={14} />
									</button>
									<button type="button" onClick={() => removeProduct(id)} className="p-1 text-red-500 hover:text-red-700" title="Remove">
										<X size={14} />
									</button>
								</span>
							</li>
						))}
					</ul>
				)}
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
					disabled={pending}
					className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{pending ? "Saving..." : submitLabel}
				</button>
			</div>
		</form>
	);
}
