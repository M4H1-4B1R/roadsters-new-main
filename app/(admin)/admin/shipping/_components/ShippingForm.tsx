"use client";

import { useActionState } from "react";

type ShippingFormProps = {
	initialData?: Record<string, unknown>;
	onSubmit: (formData: FormData) => Promise<{ error?: string }>;
	submitLabel: string;
};

export default function ShippingForm({
	initialData,
	onSubmit,
	submitLabel,
}: ShippingFormProps) {
	const [state, formAction, pending] = useActionState(
		async (_prev: { error?: string } | null, formData: FormData) => {
			return await onSubmit(formData);
		},
		null
	);

	return (
		<form action={formAction} className="space-y-6 max-w-2xl">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
					<label htmlFor="name_ar" className="block text-sm font-medium text-gray-700 mb-1">
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
					<label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
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
					<label htmlFor="delivery_time" className="block text-sm font-medium text-gray-700 mb-1">
						Delivery Time
					</label>
					<input
						id="delivery_time"
						name="delivery_time"
						type="text"
						placeholder="e.g. 3-5 business days"
						defaultValue={(initialData?.delivery_time as string) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
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
					<span className="ml-3 text-sm text-gray-600">Show at checkout</span>
				</label>
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
