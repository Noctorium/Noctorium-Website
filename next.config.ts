import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The download links point at whatever the latest release is, which is asked for at request time.
  // Nothing else here needs a server, so the rest of the page is static.
  images: { unoptimized: true },
};

export default nextConfig;
