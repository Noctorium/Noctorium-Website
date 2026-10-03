import type { NextConfig } from 'next';

/** The one-line installers, kept beside the releases they install from. */
const SCRIPTS = 'https://raw.githubusercontent.com/Noctorium/Noctorium-Installer/main/scripts';

/** The web player, which is a Vite page and a function of its own rather than part of this site. */
const PLAYER = 'https://noctorium-music.vercel.app';

const nextConfig: NextConfig = {
  // The download links point at whatever the latest release is, which is asked for at request time.
  // Nothing else here needs a server, so the rest of the page is static.
  images: { unoptimized: true },

  async redirects() {
    return [
      // /install in a browser is somebody reading the address, not running it: show them the page.
      {
        source: '/install',
        has: [{ type: 'header', key: 'accept', value: '.*text/html.*' }],
        destination: '/#install',
        permanent: false,
      },
      { source: '/music', destination: PLAYER, permanent: false },
      { source: '/music/:path*', destination: `${PLAYER}/:path*`, permanent: false },
    ];
  },

  async rewrites() {
    return [
      // One address for both one-liners: PowerShell is given the PowerShell script, anything else the
      // POSIX one. `irm https://noctorium.vercel.app/install | iex`, `curl -fsSL … | sh`.
      {
        source: '/install',
        has: [{ type: 'header', key: 'user-agent', value: '.*PowerShell.*' }],
        destination: `${SCRIPTS}/install.ps1`,
      },
      { source: '/install', destination: `${SCRIPTS}/install.sh` },
      { source: '/install.ps1', destination: `${SCRIPTS}/install.ps1` },
      { source: '/install.sh', destination: `${SCRIPTS}/install.sh` },
    ];
  },
};

export default nextConfig;
