import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false,
  }, 
  reactStrictMode: false,
  async headers() {
    return [
      { 
        // source: "/:path*", // Match all routes
        // headers: [
        //   {
        //     key: "Access-Control-Allow-Origin",
        //     value: "*", // Allow all origins, or specify a domain
        //   },
        //   {
        //     key: "Access-Control-Allow-Methods",
        //     value: "GET, POST, PUT, PATCH, DELETE, OPTIONS", // Include PATCH
        //   },
        //   {
        //     key: "Access-Control-Allow-Headers",
        //     value: "X-Requested-With, Content-Type, Authorization",
        //   },

        //   {
        //     key: "Cross-Origin-Opener-Policy",
        //     value: "same-origin",
        //   },
        //   {
        //     key: "Cross-Origin-Embedder-Policy",
        //     value: "require-corp",
        //   },
        //   {
        //     key: "Cross-Origin-Resource-Policy",
        //     value: "same-origin",
        //   }

        // ],

        //For Development only
        source: "/:path*", // apply to all routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // allow any origin (development only!)
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin", // disables COOP (not secure for prod)
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", // disables COEP (not secure for prod)
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = "source-map";
    }
    return config;
  },
};

export default withPayload(nextConfig);