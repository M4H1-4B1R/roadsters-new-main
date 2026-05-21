import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ],
    },
    experimental: {
        // Image uploads go through Server Actions; the default 1MB cap rejects
        // ordinary phone photos and makes the upload hang. Allow larger files.
        serverActions: {
            bodySizeLimit: "15mb",
        },
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
