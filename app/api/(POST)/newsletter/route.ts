import axios from "axios";

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const response = await axios.post(
            `${process.env.BASE_API_URL}/api/newsletter/`,
            data
        );

        return Response.json(response.data, {
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
            return Response.json(details, {
                status,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
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
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            }
        );
    }
}
