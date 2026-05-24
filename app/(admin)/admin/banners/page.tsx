import { adminDb } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus, Image as ImageIcon, Edit3 } from "lucide-react";

interface BannerRow {
	id: number;
	title: string | null;
	image_url: string | null;
	sort_order: number;
	is_active: boolean;
}

async function getBanners(): Promise<BannerRow[]> {
	const { data } = await adminDb
		.from("banners")
		.select("*")
		.order("sort_order", { ascending: true });
	return (data ?? []) as BannerRow[];
}

export default async function AdminBannersPage() {
	const rows = await getBanners();

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Banners</h1>
				<Link
					href="/admin/banners/new"
					className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={16} />
					Add Banner
				</Link>
			</div>

			{rows.length === 0 ? (
				<div className="text-center py-16">
					<ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-gray-500 text-sm">No banners yet.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{rows.map((b) => (
						<div key={b.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
							<div className="aspect-[16/9] bg-gray-100">
								{b.image_url ? (
									<img src={b.image_url} alt={b.title ?? "Banner"} className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-300">
										<ImageIcon size={40} />
									</div>
								)}
							</div>
							<div className="p-4 flex-1 flex flex-col">
								<h3 className="font-semibold text-gray-900 text-sm">{b.title ?? "(no title)"}</h3>
								<div className="mt-1 text-xs text-gray-400">
									Order: {b.sort_order} · {b.is_active ? "Active" : "Hidden"}
								</div>
								<Link
									href={`/admin/banners/${b.id}`}
									className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
								>
									<Edit3 size={12} />
									Edit
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
