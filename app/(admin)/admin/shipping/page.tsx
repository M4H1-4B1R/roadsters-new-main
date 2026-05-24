import { adminDb } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus, Truck, Edit3 } from "lucide-react";

interface ShippingRow {
	id: number;
	name: string;
	name_ar: string | null;
	price: number;
	delivery_time: string | null;
	is_active: boolean;
}

async function getShippingOptions(): Promise<ShippingRow[]> {
	const { data } = await adminDb
		.from("shipping_options")
		.select("*")
		.order("id", { ascending: true });
	return (data ?? []) as ShippingRow[];
}

export default async function AdminShippingPage() {
	const rows = await getShippingOptions();

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Shipping Options</h1>
				<Link
					href="/admin/shipping/new"
					className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={16} />
					Add Shipping Option
				</Link>
			</div>

			{rows.length === 0 ? (
				<div className="text-center py-16">
					<Truck size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-gray-500 text-sm">No shipping options yet.</p>
				</div>
			) : (
				<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-500 text-left">
							<tr>
								<th className="px-4 py-3 font-medium">Name</th>
								<th className="px-4 py-3 font-medium">Price</th>
								<th className="px-4 py-3 font-medium">Delivery Time</th>
								<th className="px-4 py-3 font-medium">Active</th>
								<th className="px-4 py-3" />
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{rows.map((r) => (
								<tr key={r.id}>
									<td className="px-4 py-3 text-gray-900">{r.name}</td>
									<td className="px-4 py-3 text-gray-700">{r.price}</td>
									<td className="px-4 py-3 text-gray-500">{r.delivery_time ?? "—"}</td>
									<td className="px-4 py-3">
										{r.is_active ? (
											<span className="text-green-600">Active</span>
										) : (
											<span className="text-gray-400">Hidden</span>
										)}
									</td>
									<td className="px-4 py-3 text-right">
										<Link
											href={`/admin/shipping/${r.id}`}
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
