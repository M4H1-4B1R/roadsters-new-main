import { adminDb } from "@/lib/supabase/admin";
import Link from "next/link";
import { Mail, Download, Search } from "lucide-react";
import DeleteSubscriberButton from "./_components/DeleteSubscriberButton";

interface SubscriberRow {
	id: number;
	email: string;
	created_at: string;
}

const PAGE_SIZE = 50;

async function getSubscribers(
	page: number,
	search?: string
): Promise<{ rows: SubscriberRow[]; count: number; totalPages: number }> {
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	let query = adminDb
		.from("newsletter_subscribers")
		.select("*", { count: "exact" });

	if (search) query = query.ilike("email", `%${search}%`);

	const { data, count } = await query
		.order("created_at", { ascending: false })
		.range(from, to);

	const total = count ?? 0;
	return {
		rows: (data ?? []) as SubscriberRow[],
		count: total,
		totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
	};
}

export default async function AdminNewslettersPage({
	searchParams,
}: {
	searchParams: Promise<{ search?: string; page?: string }>;
}) {
	const params = await searchParams;
	const search = params.search?.trim() || undefined;
	const currentPage = Math.max(1, Number(params.page) || 1);
	const { rows, count, totalPages } = await getSubscribers(currentPage, search);

	function pageUrl(p: number) {
		const sp = new URLSearchParams();
		if (search) sp.set("search", search);
		if (p > 1) sp.set("page", String(p));
		const qs = sp.toString();
		return `/admin/newsletters${qs ? `?${qs}` : ""}`;
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
				<a
					href="/admin/newsletters/export"
					className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Download size={16} />
					Export CSV
				</a>
			</div>

			<form method="GET" action="/admin/newsletters" className="mb-6 flex gap-2">
				<div className="relative flex-1 max-w-xs">
					<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						name="search"
						type="text"
						defaultValue={search ?? ""}
						placeholder="Search email…"
						className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
					/>
				</div>
				<button type="submit" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
					Search
				</button>
			</form>

			{rows.length === 0 ? (
				<div className="text-center py-16">
					<Mail size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-gray-500 text-sm">
						{search ? "No subscribers match your search." : "No subscribers yet."}
					</p>
				</div>
			) : (
				<>
					<p className="text-sm text-gray-500 mb-4">{count} subscriber(s)</p>
					<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 text-gray-500 text-left">
								<tr>
									<th className="px-4 py-3 font-medium">Email</th>
									<th className="px-4 py-3 font-medium">Subscribed</th>
									<th className="px-4 py-3" />
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{rows.map((s) => (
									<tr key={s.id}>
										<td className="px-4 py-3 text-gray-900">{s.email}</td>
										<td className="px-4 py-3 text-gray-500">
											{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
										</td>
										<td className="px-4 py-3 text-right">
											<DeleteSubscriberButton id={s.id} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-8">
					{currentPage > 1 && (
						<Link href={pageUrl(currentPage - 1)} className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
							Previous
						</Link>
					)}
					<span className="px-3 py-1.5 text-sm text-gray-500">
						Page {currentPage} of {totalPages}
					</span>
					{currentPage < totalPages && (
						<Link href={pageUrl(currentPage + 1)} className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
							Next
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
