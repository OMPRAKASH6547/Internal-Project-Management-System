import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Internal Project Management System",
  description: "Full-stack IPMS built with Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader
          color="#ed1c24"
          initialPosition={0.08}
          crawlSpeed={120}
          height={3}
          crawl
          showSpinner={false}
          easing="ease"
          speed={220}
          shadow="0 0 10px #ed1c24,0 0 5px #ed1c24"
        />
        {children}
      </body>
    </html>
  );
}
