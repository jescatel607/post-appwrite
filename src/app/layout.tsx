import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "My Todo App",
  description: "A Todo App built with Next.js and Appwrite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navigation Bar */}
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">My Todo App</h1>

          <div className="flex gap-6">
            <Link href="/">Home</Link>
            <Link href="/todo">Tasks</Link>
            <Link href="/login">Login</Link>
          </div>
        </nav>

        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}
