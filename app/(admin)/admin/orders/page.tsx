import { adminDb } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Eye,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";

const PAGE_SIZE = 15;

interface OrderRow {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  item_count: number;
}

interface Stat {
  title: string;
  value: number;
  icon: React.ElementType;
  format?: (v: number) => string;
}

function StatCard({ title, value, icon: Icon, format }: Stat) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4">
      <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {format ? format(value) : value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        STATUS_COLORS[status] ?? "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}

async function getStats() {
  const [totalResult, pendingResult, deliveredResult, revenueResult] =
    await Promise.all([
      adminDb.from("orders").select("id", { count: "exact", head: true }),
      adminDb
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      adminDb
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "delivered"),
      adminDb.from("orders").select("total").neq("status", "cancelled"),
    ]);

  const totalRevenue =
    revenueResult.data?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  return {
    totalOrders: totalResult.count ?? 0,
    pendingOrders: pendingResult.count ?? 0,
    deliveredOrders: deliveredResult.count ?? 0,
    totalRevenue,
  };
}

async function getOrders(params: {
  page: number;
  search?: string;
  status?: string;
  date_range?: string;
  sort?: string;
}): Promise<{ orders: OrderRow[]; totalPages: number; count: number }> {
  const { page, search, status, date_range, sort } = params;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = adminDb.from("orders").select("*", { count: "exact" });

  if (status) {
    query = query.eq("status", status);
  }

  if (date_range === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    query = query.gte("created_at", start.toISOString());
  } else if (date_range === "week") {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    query = query.gte("created_at", start.toISOString());
  } else if (date_range === "month") {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    query = query.gte("created_at", start.toISOString());
  }

  if (search) {
    const searchTerm = search.trim();
    const conditions = [
      `customer_name.ilike.%${searchTerm}%`,
      `customer_phone.ilike.%${searchTerm}%`,
      `customer_email.ilike.%${searchTerm}%`,
    ];
    if (/^\d+$/.test(searchTerm)) {
      conditions.push(`id.eq.${Number(searchTerm)}`);
    }
    query = query.or(conditions.join(","));
  }

  let orderColumn = "created_at";
  let orderDir: "asc" | "desc" = "desc";

  if (sort === "oldest") {
    orderDir = "asc";
  } else if (sort === "amount_desc") {
    orderColumn = "total";
    orderDir = "desc";
  } else if (sort === "amount_asc") {
    orderColumn = "total";
    orderDir = "asc";
  }

  const { data: orders, count } = await query
    .order(orderColumn, { ascending: orderDir === "asc" })
    .range(from, to);

  if (!orders) return { orders: [], totalPages: 0, count: 0 };

  const raw = orders as Array<{
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    shipping_address: string;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
  }>;

  const orderIds = raw.map((o) => o.id);

  const itemCountMap: Record<number, number> = {};
  if (orderIds.length > 0) {
    const { data: items } = await adminDb
      .from("order_items")
      .select("order_id, id")
      .in("order_id", orderIds);

    if (items) {
      for (const item of items as Array<{
        order_id: number;
        id: number;
      }>) {
        itemCountMap[item.order_id] = (itemCountMap[item.order_id] ?? 0) + 1;
      }
    }
  }

  const totalCount = count ?? 0;

  return {
    orders: raw.map((o) => ({
      id: o.id,
      customer_name: o.customer_name,
      customer_phone: o.customer_phone,
      customer_email: o.customer_email,
      shipping_address: o.shipping_address,
      total: o.total,
      status: o.status,
      payment_method: o.payment_method,
      created_at: o.created_at,
      item_count: itemCountMap[o.id] ?? 0,
    })),
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    count: totalCount,
  };
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() || undefined;
  const status = params.status || undefined;
  const date_range = params.date_range || undefined;
  const sort = params.sort || undefined;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const [stats, result] = await Promise.all([
    getStats(),
    getOrders({
      page: currentPage,
      search,
      status,
      date_range,
      sort,
    }),
  ]);

  const { orders, totalPages, count } = result;

  function pageUrl(p: number) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (status) sp.set("status", status);
    if (date_range) sp.set("date_range", date_range);
    if (sort) sp.set("sort", sort);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
        />
        <StatCard
          title="Delivered Orders"
          value={stats.deliveredOrders}
          icon={CheckCircle}
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={DollarSign}
          format={(v) => `$${v.toFixed(2)}`}
        />
      </div>

      <form
        method="GET"
        action="/admin/orders"
        className="mb-6 flex flex-wrap gap-2 items-end"
      >
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            name="search"
            type="text"
            defaultValue={search ?? ""}
            placeholder="Search by name, phone, email, or ID…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? ""}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          name="date_range"
          defaultValue={date_range ?? ""}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <select
          name="sort"
          defaultValue={sort ?? ""}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="amount_desc">Highest amount</option>
          <option value="amount_asc">Lowest amount</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Filter
        </button>
        {(search || status || date_range || sort) && (
          <Link
            href="/admin/orders"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">
            {search ? "No orders match your search." : "No orders yet."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {count} order{count === 1 ? "" : "s"}
            {search && <> matching &ldquo;{search}&rdquo;</>}
          </p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900 font-medium">
                        {order.customer_name}
                      </div>
                      {order.customer_email && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {order.customer_email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {order.item_count}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View details"
                      >
                        <Eye size={14} />
                      </Link>
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
            <Link
              href={pageUrl(currentPage - 1)}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageUrl(p)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                p === currentPage
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link
              href={pageUrl(currentPage + 1)}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
