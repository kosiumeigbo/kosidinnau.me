/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { dirs: ["src"] },
  images: { unoptimized: true },
  async redirects() {
    return [{ source: "/", destination: "/about", permanent: true }];
  },
};

export default nextConfig;
