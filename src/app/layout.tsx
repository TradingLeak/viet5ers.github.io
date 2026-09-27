import type { Metadata, Viewport } from 'next';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

const SITE_URL = process.env.SITE_URL ?? 'https://viet5ers.github.io';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'VIET5ERS — Trade Beyond Limits',
    template: '%s — VIET5ERS',
  },
  description:
    'A collective of traders engineering financial freedom from Vietnam. Institutional-grade education, real capital and a community that never sleeps.',
  keywords: [
    'viet5ers',
    'trading',
    'prop firm',
    'funded trader',
    'trading education',
    'việt nam',
  ],
  authors: [{ name: 'VIET5ERS' }],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'VIET5ERS',
    title: 'VIET5ERS — Trade Beyond Limits',
    description:
      'Institutional-grade trading education, real capital and a community that never sleeps.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'VIET5ERS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIET5ERS — Trade Beyond Limits',
    description:
      'Institutional-grade trading education, real capital and a community that never sleeps.',
    images: ['/og.jpg'],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=JetBrains+Mono:wght@300..700&family=Syne:wght@400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-space-950 text-white">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
