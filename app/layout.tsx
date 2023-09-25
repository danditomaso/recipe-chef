import { cn } from "@/lib/utils";
import "./styles/global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recipe AI",
  description: "An AI-powered receipe scraper built with Next.js and Vercel.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-[100dvh] w-full")}>
        <main className="flex flex-col items-center justify-between p-24">{children}</main>
      </body>
    </html>
  );
}
