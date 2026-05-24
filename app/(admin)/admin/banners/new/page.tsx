"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BannerForm from "../_components/BannerForm";
import { createBanner } from "../../_actions/banners";

export default function NewBannerPage() {
	const router = useRouter();

	const handleSubmit = async (formData: FormData) => {
		const result = await createBanner(formData);
		if (!result.error) router.push("/admin/banners");
		return result;
	};

	return (
		<div>
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/banners"
					className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
				>
					<ChevronLeft size={20} />
				</Link>
				<h1 className="text-2xl font-bold text-gray-900">New Banner</h1>
			</div>
			<BannerForm onSubmit={handleSubmit} submitLabel="Create Banner" />
		</div>
	);
}
