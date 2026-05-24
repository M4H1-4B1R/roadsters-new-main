"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import SwiperForm from "../_components/SwiperForm";
import { createSwiper } from "../../_actions/swipers";

export default function NewSwiperPage() {
	const router = useRouter();

	const handleSubmit = async (formData: FormData) => {
		const result = await createSwiper(formData);
		if (!result.error) router.push("/admin/swipers");
		return result;
	};

	return (
		<div>
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/swipers"
					className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
				>
					<ChevronLeft size={20} />
				</Link>
				<h1 className="text-2xl font-bold text-gray-900">New Slide</h1>
			</div>
			<SwiperForm onSubmit={handleSubmit} submitLabel="Create Slide" />
		</div>
	);
}
