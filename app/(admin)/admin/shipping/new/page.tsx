"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ShippingForm from "../_components/ShippingForm";
import { createShipping } from "../../_actions/shipping";

export default function NewShippingPage() {
	const router = useRouter();

	const handleSubmit = async (formData: FormData) => {
		const result = await createShipping(formData);
		if (!result.error) router.push("/admin/shipping");
		return result;
	};

	return (
		<div>
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/shipping"
					className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
				>
					<ChevronLeft size={20} />
				</Link>
				<h1 className="text-2xl font-bold text-gray-900">New Shipping Option</h1>
			</div>
			<ShippingForm onSubmit={handleSubmit} submitLabel="Create Shipping Option" />
		</div>
	);
}
