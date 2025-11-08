import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "as1.ftcdn.net",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
