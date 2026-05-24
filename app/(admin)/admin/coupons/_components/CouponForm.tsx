"use client";

import { useActionState } from "react";

type CouponFormProps = {
	initialData?: Record<string, unknown>;
	onSubmit: (formData: FormData) => Promise<{ error?: string }>;
	submitLabel: string;
};

export default function CouponForm({
	initialData,
	onSubmit,
	submitLabel,
}: CouponFormProps) {
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
					<label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
						Code <span className="text-red-500">*</span>
					</label>
					<input
						id="code"
						name="code"
						type="text"
						required
						placeholder="e.g. SAVE10"
						defaultValue={(initialData?.code as string) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-1">
						Discount Type <span className="text-red-500">*</span>
					</label>
					<select
						id="discount_type"
						name="discount_type"
						defaultValue={(initialData?.discount_type as string) ?? "percentage"}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="percentage">Percentage (%)</option>
						<option value="fixed">Fixed amount</option>
					</select>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div>
					<label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 mb-1">
						Discount Value <span className="text-red-500">*</span>
					</label>
					<input
						id="discount_value"
						name="discount_value"
						type="number"
						step="0.01"
						min={0}
						required
						defaultValue={(initialData?.discount_value as number) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label htmlFor="min_order_amount" className="block text-sm font-medium text-gray-700 mb-1">
						Min Order Amount
					</label>
					<input
						id="min_order_amount"
						name="min_order_amount"
						type="number"
						step="0.01"
						min={0}
						defaultValue={(initialData?.min_order_amount as number) ?? 0}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
				<div>
					<label htmlFor="usage_limit" className="block text-sm font-medium text-gray-700 mb-1">
						Usage Limit
					</label>
					<input
						id="usage_limit"
						name="usage_limit"
						type="number"
						min={0}
						placeholder="blank = unlimited"
						defaultValue={(initialData?.usage_limit as number) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-1">
						Expires At
					</label>
					<input
						id="expires_at"
						name="expires_at"
						type="datetime-local"
						defaultValue={(initialData?.expires_local as string) ?? ""}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					<p className="text-xs text-gray-400 mt-1">Leave blank to never expire.</p>
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
					</label>
				</div>
			</div>

			{initialData?.used_count !== undefined && (
				<p className="text-xs text-gray-500">
					Used {String(initialData.used_count)} time(s) so far.
				</p>
			)}

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
