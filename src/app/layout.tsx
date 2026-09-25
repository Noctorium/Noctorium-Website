import type { Metadata } from 'next';
import './globals.css';

/*
 * Where this is served from, which the social preview needs spelled out.
 *
 * Without it Next resolves the card image against localhost and the link unfurls blank everywhere it is
 * pasted. Vercel sets the variable on a deployment; the fallback is only for a build on somebody's laptop.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, '')}`
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://noctorium.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Noctorium — one player for YouTube Music and SoundCloud',
  description:
    'A music player for YouTube Music and SoundCloud together. Your own accounts, your own likes and ' +
    'playlists, on the desktop and on your phone.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Noctorium',
    description: 'One player for YouTube Music and SoundCloud.',
    images: ['/noctorium.png'],
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`:root { --font-sans: 'Inter'; }`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
