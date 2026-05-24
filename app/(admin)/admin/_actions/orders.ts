"use server";

import { adminDb } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) throw new Error("Unauthorized");
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET!)
    );
    if (payload.role !== "admin") throw new Error("Unauthorized");
  } catch {
    throw new Error("Unauthorized");
  }
}

const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export async function updateOrderStatus(
  id: number,
  newStatus: string
): Promise<{ error?: string }> {
  try {
    await requireAdmin();

    if (!ORDER_STATUSES.includes(newStatus as typeof ORDER_STATUSES[number])) {
      return { error: "Invalid status" };
    }

    const { error } = await adminDb
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return {};
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function deleteOrder(
  id: number
): Promise<{ error?: string }> {
  try {
    await requireAdmin();

    const { error } = await adminDb.from("orders").delete().eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/orders");
    return {};
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function getOrderAction(id: number) {
  try {
    const { data: order, error } = await adminDb
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return { error: error.message };
    if (!order) return { error: "Order not found" };

    const raw = order as Record<string, unknown>;

    const { data: items } = await adminDb
      .from("order_items")
      .select("*")
      .eq("order_id", id)
      .order("id", { ascending: true });

    let shippingOptionName: string | null = null;
    if (raw.shipping_option_id) {
      const { data: option } = await adminDb
        .from("shipping_options")
        .select("name")
        .eq("id", raw.shipping_option_id as number)
        .single();
      if (option) {
        shippingOptionName = (option as { name: string }).name;
      }
    }

    return {
      order: {
        ...raw,
        items: (items ?? []) as Array<{
          id: number;
          order_id: number;
          product_id: number | null;
          product_name: string;
          variation_label: string | null;
          unit_price: number;
          quantity: number;
          subtotal: number;
        }>,
        shipping_option_name: shippingOptionName,
      },
    };
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}
