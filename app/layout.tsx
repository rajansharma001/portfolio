import type { Metadata } from 'next';
import './globals.css';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajansharma.dev';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Rajan Sharma | Full-Stack Software Engineer',
    template: '%s | Rajan Sharma',
  },
  description:
    'Full-Stack Software Engineer building production-grade web systems with Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB. 16 shipped projects. Open to engineering roles worldwide.',
  keywords: [
    'Rajan Sharma',
    'Full Stack Engineer',
    'Software Engineer',
    'Backend Developer',
    'Node.js Developer',
    'TypeScript',
    'Next.js',
    'PostgreSQL',
    'MongoDB',
    'React Developer',
    'Nepal Software Engineer',
    'Remote Software Engineer',
    'REST API',
    'LMS Developer',
    'POS System Developer',
  ],
  authors: [{ name: 'Rajan Sharma', url: baseUrl }],
  creator: 'Rajan Sharma',
  publisher: 'Rajan Sharma',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Rajan Sharma | Full-Stack Software Engineer',
    description:
      'Full-Stack Software Engineer building production-grade web systems with Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB. 16 shipped projects.',
    type: 'website',
    url: baseUrl,
    siteName: 'Rajan Sharma Portfolio',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rajan Sharma | Full-Stack Software Engineer',
    description:
      'Full-Stack Software Engineer — Next.js, TypeScript, Node.js, PostgreSQL, MongoDB. 16 shipped projects. Open to roles worldwide.',
    creator: '@rajansharma001',
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: '/siteicon.png',
    shortcut: '/siteicon.png',
    apple: '/siteicon.png',
  },
  manifest: '/manifest.json',
  other: {
    'geo.region': 'NP-BA',
    'geo.placename': 'Kathmandu',
    'geo.position': '27.7172;85.3240',
    'ICBM': '27.7172, 85.3240',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rajan Sharma',
    jobTitle: 'Full-Stack Software Engineer',
    description:
      'Full-Stack Software Engineer building production-grade web systems with Next.js, TypeScript, Node.js, Express, PostgreSQL, and MongoDB.',
    email: 'email.rajan001@gmail.com',
    url: baseUrl,
    sameAs: [
      'https://github.com/rajansharma001',
      'https://linkedin.com/in/rajansharma001',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressRegion: 'Bagmati',
      addressCountry: 'NP',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Council for Technical Education and Vocational Training (CTEVT)',
    },
    knowsAbout: [
      'Next.js', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB',
      'React', 'REST APIs', 'JWT Authentication', 'System Architecture',
      'OpenStreetMap', 'Prisma ORM', 'Cloudinary',
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rajan Sharma Portfolio',
    url: baseUrl,
    description: 'Portfolio of Rajan Sharma — Full-Stack Software Engineer based in Kathmandu, Nepal.',
    author: { '@type': 'Person', name: 'Rajan Sharma' },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/siteicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/siteicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
