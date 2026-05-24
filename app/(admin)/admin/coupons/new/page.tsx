"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CouponForm from "../_components/CouponForm";
import { createCoupon } from "../../_actions/coupons";

export default function NewCouponPage() {
	const router = useRouter();

	const handleSubmit = async (formData: FormData) => {
		const result = await createCoupon(formData);
		if (!result.error) router.push("/admin/coupons");
		return result;
	};

	return (
		<div>
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/coupons"
					className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
				>
					<ChevronLeft size={20} />
				</Link>
				<h1 className="text-2xl font-bold text-gray-900">New Coupon</h1>
			</div>
			<CouponForm onSubmit={handleSubmit} submitLabel="Create Coupon" />
		</div>
	);
}
