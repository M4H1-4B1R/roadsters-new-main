"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import SectionForm from "../_components/SectionForm";
import { createSection, getProductOptions } from "../../_actions/sections";

export default function NewSectionPage() {
	const router = useRouter();
	const [productOptions, setProductOptions] = useState<
		Array<{ id: number; name: string }>
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getProductOptions().then((options) => {
			setProductOptions(options);
			setLoading(false);
		});
	}, []);

	const handleSubmit = async (formData: FormData) => {
		const result = await createSection(formData);
		if (!result.error) router.push("/admin/sections");
		return result;
	};

	return (
		<div>
			<div className="flex items-center gap-3 mb-6">
				<Link href="/admin/sections" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
					<ChevronLeft size={20} />
				</Link>
				<h1 className="text-2xl font-bold text-gray-900">New Section</h1>
			</div>

			{loading ? (
				<div className="text-sm text-gray-500">Loading...</div>
			) : (
				<SectionForm
					productOptions={productOptions}
					onSubmit={handleSubmit}
					submitLabel="Create Section"
				/>
			)}
		</div>
	);
}
