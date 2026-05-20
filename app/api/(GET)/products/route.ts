import axios from "axios";

// Helper: parse boolean-like query values
function parseBoolean(value: string | null): string | null {
  if (!value) return null;

  const truthy = ["true", "1", "yes"];
  const falsy = ["false", "0", "no"];

  if (truthy.includes(value.toLowerCase())) return "true";
  if (falsy.includes(value.toLowerCase())) return "false";

  return null;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const backendParams = new URLSearchParams();

    // -------------------------------
    // 1. Search
    // -------------------------------
    const search = searchParams.get("search");
    if (search) backendParams.set("search", search);

    // -------------------------------
    // 2. Category (comma-separated)
    // -------------------------------
    const category = searchParams.get("category");
    if (category) backendParams.set("category", category);

    // -------------------------------
    // 3. Price range: price=min-max
    // -------------------------------
    const price = searchParams.get("price");
    if (price) backendParams.set("price", price);

    // -------------------------------
    // 4–6. Boolean filters
    // available, best_seller, in_stock
    // -------------------------------
    const booleanFilters = ["available", "best_seller", "in_stock"];

    booleanFilters.forEach((field) => {
      const raw = searchParams.get(field);
      const parsed = parseBoolean(raw);
      if (parsed !== null) backendParams.set(field, parsed);
    });

    // -------------------------------
    // 7. Date range
    // date_from, date_to
    // -------------------------------
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    if (dateFrom) backendParams.set("date_from", dateFrom);
    if (dateTo) backendParams.set("date_to", dateTo);

    // -------------------------------
    // 8. Variation filters (dynamic)
    // e.g., color=red,blue & size=large
    //
    // Any key NOT in the known list gets forwarded as-is
    // -------------------------------
    const reservedKeys = [
      "search",
      "category",
      "price",
      "available",
      "best_seller",
      "in_stock",
      "date_from",
      "date_to",
      "sort",
      "page",
      "page_size",
    ];

    searchParams.forEach((value, key) => {
      if (!reservedKeys.includes(key)) {
        backendParams.set(key, value);
      }
    });

    // -------------------------------
    // 9. Sorting
    // -------------------------------
    const sort = searchParams.get("sort");
    if (sort) backendParams.set("sort", sort);

    // -------------------------------
    // Pagination
    // -------------------------------
    const page = searchParams.get("page");
    const pageSize = searchParams.get("page_size");

    if (page) backendParams.set("page", page);
    if (pageSize) backendParams.set("page_size", pageSize);

    // -------------------------------
    // Forward the request to backend
    // -------------------------------
    const { data } = await axios.get(
      `${process.env.BASE_API_URL}/api/products/?${backendParams.toString()}`
    );

    return Response.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const details = error.response?.data || { error: "Unknown error" };
      return Response.json(details, {
        status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    return Response.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}
