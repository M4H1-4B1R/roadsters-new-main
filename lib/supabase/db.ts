import { createClient } from "@supabase/supabase-js";

/**
 * Universal anon Supabase client for public storefront reads.
 *
 * Why a third client (not ./client.ts or ./server.ts):
 * `lib/utils/api-client.ts` is imported by BOTH Server Components (pages) and
 * "use client" components (NavBar, ProductsPageLayout, FiltersSheet, …). The
 * cookie-based `./server.ts` imports `next/headers`, which cannot be bundled
 * into a Client Component — it breaks the build. All storefront reads are
 * anonymous (RLS "public read" policies), so we don't need a user session at
 * all. A plain isomorphic supabase-js client works identically on the server
 * and in the browser, with no cookies/session to manage.
 */
export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
