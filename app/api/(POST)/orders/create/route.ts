import axios from "axios";

export async function POST(request: Request) {
    try {
        const orderData = await request.json();
        const paymentMethod = orderData.payment_method;

        // Determine endpoint based on payment method
        // CASH -> /api/orders/create/ (direct order creation)
        // CARD -> /api/payments/create/ (payment processing)
        const endpoint = paymentMethod === "CARD"
            ? `${process.env.BASE_API_URL}/api/payments/create/`
            : `${process.env.BASE_API_URL}/api/orders/create/`;

        const { data } = await axios.post(
            endpoint,
            orderData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return Response.json(data, {
            status: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const details = error.response?.data || { error: "Unknown error" };

            // Forward the backend error as-is
            return Response.json(details, {
                status,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        // Unknown error
        return Response.json(
            { error: "Internal server error" },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            }
        );
    }
}

