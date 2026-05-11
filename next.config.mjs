/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xppvrhxnozekgckjbiwp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "api.clustivo.com",
      },
      {
        // Allow any https image (catch-all for admin-entered URLs)
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
