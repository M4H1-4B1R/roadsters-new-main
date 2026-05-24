import { adminDb } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus, Images, Edit3 } from "lucide-react";

interface SwiperRow {
	id: number;
	image_url: string | null;
	link_url: string | null;
	sort_order: number;
	is_active: boolean;
}

async function getSwipers(): Promise<SwiperRow[]> {
	const { data } = await adminDb
		.from("swipers")
		.select("*")
		.order("sort_order", { ascending: true });
	return (data ?? []) as SwiperRow[];
}

export default async function AdminSwipersPage() {
	const rows = await getSwipers();

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Gallery Swiper</h1>
				<Link
					href="/admin/swipers/new"
					className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={16} />
					Add Slide
				</Link>
			</div>

			{rows.length === 0 ? (
				<div className="text-center py-16">
					<Images size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-gray-500 text-sm">No slides yet.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{rows.map((s) => (
						<div key={s.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
							<div className="aspect-[16/9] bg-gray-100">
								{s.image_url ? (
									<img src={s.image_url} alt="Slide" className="w-full h-full object-cover" />
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-300">
										<Images size={40} />
									</div>
								)}
							</div>
							<div className="p-4 flex-1 flex flex-col">
								<div className="text-xs text-gray-400">
									Order: {s.sort_order} · {s.is_active ? "Active" : "Hidden"}
								</div>
								{s.link_url && (
									<div className="text-xs text-gray-500 truncate mt-1">{s.link_url}</div>
								)}
								<Link
									href={`/admin/swipers/${s.id}`}
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
