import { adminDb } from "@/lib/supabase/admin";
import Link from "next/link";
import { Plus, Percent, Edit3 } from "lucide-react";

interface CouponRow {
	id: number;
	code: string;
	discount_type: string;
	discount_value: number;
	usage_limit: number | null;
	used_count: number;
	expires_at: string | null;
	is_active: boolean;
}

async function getCoupons(): Promise<CouponRow[]> {
	const { data } = await adminDb
		.from("coupons")
		.select("*")
		.order("id", { ascending: false });
	return (data ?? []) as CouponRow[];
}

export default async function AdminCouponsPage() {
	const rows = await getCoupons();

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
				<Link
					href="/admin/coupons/new"
					className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={16} />
					Add Coupon
				</Link>
			</div>

			{rows.length === 0 ? (
				<div className="text-center py-16">
					<Percent size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-gray-500 text-sm">No coupons yet.</p>
				</div>
			) : (
				<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-500 text-left">
							<tr>
								<th className="px-4 py-3 font-medium">Code</th>
								<th className="px-4 py-3 font-medium">Discount</th>
								<th className="px-4 py-3 font-medium">Used</th>
								<th className="px-4 py-3 font-medium">Expires</th>
								<th className="px-4 py-3 font-medium">Active</th>
								<th className="px-4 py-3" />
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{rows.map((c) => (
								<tr key={c.id}>
									<td className="px-4 py-3 font-mono text-gray-900">{c.code}</td>
									<td className="px-4 py-3 text-gray-700">
										{c.discount_type === "percentage"
											? `${c.discount_value}%`
											: c.discount_value}
									</td>
									<td className="px-4 py-3 text-gray-500">
										{c.used_count}
										{c.usage_limit ? ` / ${c.usage_limit}` : ""}
									</td>
									<td className="px-4 py-3 text-gray-500">
										{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "—"}
									</td>
									<td className="px-4 py-3">
										{c.is_active ? (
											<span className="text-green-600">Active</span>
										) : (
											<span className="text-gray-400">Off</span>
										)}
									</td>
									<td className="px-4 py-3 text-right">
										<Link
											href={`/admin/coupons/${c.id}`}
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
