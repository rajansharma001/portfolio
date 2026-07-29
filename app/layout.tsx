import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rajan Sharma | Backend-Focused Full Stack Developer',
  description:
    'Backend-Focused Full Stack Developer building secure, scalable web applications with Node.js, TypeScript, PostgreSQL, Next.js, and React. Open to international opportunities.',
  keywords: [
    'Rajan Sharma',
    'Backend Developer',
    'Full Stack Engineer',
    'Node.js',
    'TypeScript',
    'Next.js',
    'PostgreSQL',
    'Europe Software Engineer',
    'React',
  ],
  authors: [{ name: 'Rajan Sharma' }],
  openGraph: {
    title: 'Rajan Sharma | Backend-Focused Full Stack Developer',
    description:
      'Backend-Focused Full Stack Developer building secure, scalable web applications with Node.js, TypeScript, PostgreSQL, Next.js, and React.',
    type: 'website',
    url: 'https://rajansharma.dev',
    siteName: 'Rajan Sharma Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rajan Sharma | Backend-Focused Full Stack Developer',
    description:
      'Backend-Focused Full Stack Developer building secure, scalable web applications with Node.js, TypeScript, PostgreSQL, Next.js, and React.',
  },
  icons: {
    icon: '/siteicon.png',
    shortcut: '/siteicon.png',
    apple: '/siteicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rajan Sharma',
    jobTitle: 'Backend-Focused Full Stack Developer',
    description:
      'Backend-Focused Full Stack Developer building secure, scalable web applications with Node.js, TypeScript, PostgreSQL, Next.js, and React.',
    email: 'sharmarajan4560@gmail.com',
    sameAs: [
      'https://github.com/rajansharma001',
      'https://linkedin.com/in/rajansharma001',
    ],
    knowsAbout: [
      'Node.js',
      'TypeScript',
      'Next.js',
      'PostgreSQL',
      'React',
      'REST APIs',
      'System Architecture',
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
