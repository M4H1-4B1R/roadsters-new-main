import { adminDb } from "@/lib/supabase/admin";

export async function GET() {
	const { data } = await adminDb
		.from("newsletter_subscribers")
		.select("email, created_at")
		.order("created_at", { ascending: false });

	const rows = data ?? [];
	const header = "email,subscribed_at\n";
	const body = rows
		.map((r) => {
			const email = String(r.email).replace(/"/g, '""');
			return `"${email}","${r.created_at ?? ""}"`;
		})
		.join("\n");

	return new Response(header + body, {
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": 'attachment; filename="subscribers.csv"',
		},
	});
}
