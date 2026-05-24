"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeNewsletter(email: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });
  if (error?.code === "23505") {
    return { ok: false, message: "Already subscribed" };
  }
  if (error) {
    console.error("subscribeNewsletter error:", error);
    return { ok: false, message: "Something went wrong" };
  }
  return { ok: true };
}
