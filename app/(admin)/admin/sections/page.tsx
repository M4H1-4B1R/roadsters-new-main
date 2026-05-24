import { adminDb } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus, Layout, Edit3 } from "lucide-react";

interface SectionRow {
	id: number;
	title: string;
	product_ids: number[] | null;
	sort_order: number;
	is_active: boolean;
}

async function getSections(): Promise<SectionRow[]> {
	const { data } = await adminDb
		.from("sections")
		.select("*")
		.order("sort_order", { ascending: true });
	return (data ?? []) as SectionRow[];
}

export default async function AdminSectionsPage() {
	const rows = await getSections();

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Website Sections</h1>
				<Link
					href="/admin/sections/new"
					className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={16} />
					Add Section
				</Link>
			</div>

			{rows.length === 0 ? (
				<div className="text-center py-16">
					<Layout size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-gray-500 text-sm">No sections yet.</p>
				</div>
			) : (
				<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-500 text-left">
							<tr>
								<th className="px-4 py-3 font-medium">Title</th>
								<th className="px-4 py-3 font-medium">Products</th>
								<th className="px-4 py-3 font-medium">Order</th>
								<th className="px-4 py-3 font-medium">Active</th>
								<th className="px-4 py-3" />
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{rows.map((s) => (
								<tr key={s.id}>
									<td className="px-4 py-3 text-gray-900">{s.title}</td>
									<td className="px-4 py-3 text-gray-500">
										{(s.product_ids ?? []).length} products
									</td>
									<td className="px-4 py-3 text-gray-500">{s.sort_order}</td>
									<td className="px-4 py-3">
										{s.is_active ? (
											<span className="text-green-600">Active</span>
										) : (
											<span className="text-gray-400">Hidden</span>
										)}
									</td>
									<td className="px-4 py-3 text-right">
										<Link
											href={`/admin/sections/${s.id}`}
											className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
										>
											<Edit3 size={12} />
											Edit
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
