import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rajan Sharma | Full-Stack Developer",
  description:
    "Portfolio of Rajan Sharma, a Full-Stack Developer specializing in the MERN stack, Next.js, TypeScript, and modern web applications.",
  icons: {
    icon: "/uploads/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} antialiased bg-[#0d0f14] text-gray-200`}
      >
        {children}
      </body>
    </html>
  );
}
