"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import CouponForm from "../_components/CouponForm";
import {
	getCouponAction,
	updateCoupon,
	deleteCoupon,
} from "../../_actions/coupons";

export default function EditCouponPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();
	const [item, setItem] = useState<Record<string, unknown> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		getCouponAction(Number(id)).then((result) => {
			if ("error" in result) setError(result.error ?? "Unknown error");
			else setItem(result.item as Record<string, unknown>);
			setLoading(false);
		});
	}, [id]);

	const handleSubmit = async (formData: FormData) => {
		const result = await updateCoupon(Number(id), formData);
		if (!result.error) router.push("/admin/coupons");
		return result;
	};

	const handleDelete = async () => {
		if (!window.confirm("Delete this Coupon?")) return;
		setDeleting(true);
		const result = await deleteCoupon(Number(id));
		if (result.error) {
			setError(result.error);
			setDeleting(false);
		} else {
			router.push("/admin/coupons");
		}
	};

	if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

	if (error || !item) {
		return (
			<div>
				<div className="flex items-center gap-3 mb-6">
					<Link href="/admin/coupons" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
						<ChevronLeft size={20} />
					</Link>
					<h1 className="text-2xl font-bold text-gray-900">Edit Coupon</h1>
				</div>
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-sm text-red-700">{error ?? "Not found."}</p>
					<Link href="/admin/coupons" className="text-sm text-red-600 hover:text-red-800 font-medium mt-2 inline-block">
						Back
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<Link href="/admin/coupons" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
						<ChevronLeft size={20} />
					</Link>
					<h1 className="text-2xl font-bold text-gray-900">Edit Coupon</h1>
				</div>
				<button
					onClick={handleDelete}
					disabled={deleting}
					className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<Trash2 size={16} />
					{deleting ? "Deleting..." : "Delete"}
				</button>
			</div>

			{error && (
				<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
					{error}
				</p>
			)}

			<CouponForm
				initialData={item}
				onSubmit={handleSubmit}
				submitLabel="Save Changes"
			/>
		</div>
	);
}
