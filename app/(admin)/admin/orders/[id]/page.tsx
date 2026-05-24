"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Trash2,
  MapPin,
  Phone,
  Package,
  FileText,
} from "lucide-react";
import {
  getOrderAction,
  updateOrderStatus,
  deleteOrder,
} from "../../_actions/orders";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

function DetailsCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 text-gray-700">
        <Icon size={18} />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await getOrderAction(Number(id));
      if ("error" in result) {
        setError(result.error ?? "An unknown error occurred");
      } else {
        setOrder(result.order as Record<string, unknown>);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setStatusUpdating(true);
    const result = await updateOrderStatus(Number(id), newStatus);
    if (result.error) {
      setError(result.error);
    } else {
      const reloadResult = await getOrderAction(Number(id));
      if ("error" in reloadResult) {
        setError(reloadResult.error ?? null);
      } else {
        setOrder(reloadResult.order as Record<string, unknown>);
      }
    }
    setStatusUpdating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this order?"))
      return;
    setDeleting(true);
    const result = await deleteOrder(Number(id));
    if (result.error) {
      setError(result.error);
      setDeleting(false);
    } else {
      router.push("/admin/orders");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/orders"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{id}
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
          <Link
            href="/admin/orders"
            className="text-sm text-red-600 hover:text-red-800 font-medium mt-2 inline-block"
          >
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/orders"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{id}
          </h1>
        </div>
        <p className="text-sm text-gray-500">Order not found.</p>
      </div>
    );
  }

  const status = (order.status as string) ?? "pending";
  const statusColor = STATUS_COLORS[status] ?? "bg-gray-100 text-gray-500";
  const transitions = STATUS_TRANSITIONS[status] ?? [];
  const items = (order.items ?? []) as Array<{
    id: number;
    order_id: number;
    product_id: number | null;
    product_name: string;
    variation_label: string | null;
    unit_price: number;
    quantity: number;
    subtotal: number;
  }>;
  const subtotal = Number(order.subtotal ?? 0);
  const shippingFee = Number(order.shipping_fee ?? 0);
  const discount = Number(order.discount ?? 0);
  const total = Number(order.total ?? 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{id}
          </h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 size={16} />
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DetailsCard title="Customer Information" icon={Phone}>
            <InfoRow label="Name" value={order.customer_name as string} />
            <InfoRow label="Phone" value={order.customer_phone as string} />
            <InfoRow label="Email" value={order.customer_email as string | null} />
          </DetailsCard>

          <DetailsCard title="Shipping Information" icon={MapPin}>
            <InfoRow label="Address" value={order.shipping_address as string} />
            <InfoRow
              label="Shipping Option"
              value={order.shipping_option_name as string | null}
            />
            <InfoRow
              label="Shipping Fee"
              value={`$${shippingFee.toFixed(2)}`}
            />
          </DetailsCard>

          <DetailsCard title="Order Items" icon={Package}>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-left px-5 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Variation
                    </th>
                    <th className="text-right px-5 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-right px-5 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="text-right px-5 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-2.5 text-gray-900">
                        {item.product_name}
                      </td>
                      <td className="px-5 py-2.5 text-gray-500">
                        {item.variation_label ?? "—"}
                      </td>
                      <td className="px-5 py-2.5 text-gray-700 text-right">
                        ${Number(item.unit_price).toFixed(2)}
                      </td>
                      <td className="px-5 py-2.5 text-gray-700 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-5 py-2.5 text-gray-900 text-right font-medium">
                        ${Number(item.subtotal).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-100 mt-2 pt-3 space-y-1.5">
              <InfoRow
                label="Subtotal"
                value={`$${subtotal.toFixed(2)}`}
              />
              {discount > 0 && (
                <InfoRow
                  label={`Discount${order.coupon_code ? ` (${order.coupon_code})` : ""}`}
                  value={`-$${discount.toFixed(2)}`}
                />
              )}
              <InfoRow
                label="Shipping"
                value={`$${shippingFee.toFixed(2)}`}
              />
              <div className="flex justify-between py-1.5 text-sm font-bold border-t border-gray-100 pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </DetailsCard>

          <DetailsCard title="Additional Info" icon={FileText}>
            <InfoRow
              label="Payment Method"
              value={
                order.payment_method === "cod"
                  ? "Cash on Delivery"
                  : (order.payment_method as string)
              }
            />
            <InfoRow
              label="Coupon Code"
              value={order.coupon_code as string | null}
            />
            <InfoRow
              label="Notes"
              value={order.notes as string | null}
            />
            <InfoRow
              label="Order Date"
              value={
                order.created_at
                  ? new Date(order.created_at as string).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : null
              }
            />
          </DetailsCard>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">
                Order Status
              </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="flex justify-center">
                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${statusColor}`}
                >
                  {status}
                </span>
              </div>
              {transitions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Change Status
                  </p>
                  {transitions.map((nextStatus) => (
                    <button
                      key={nextStatus}
                      onClick={() => handleStatusChange(nextStatus)}
                      disabled={statusUpdating}
                      className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors capitalize"
                    >
                      {statusUpdating
                        ? "Updating..."
                        : `Mark as ${nextStatus}`}
                    </button>
                  ))}
                </div>
              )}
              {transitions.length === 0 && (
                <p className="text-xs text-gray-400 text-center">
                  No further status changes available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
