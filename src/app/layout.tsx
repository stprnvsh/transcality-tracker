import "@/styles/globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Transcality Tracker",
  description: "Full-stack ticket management for engineering teams"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-950">
      <body className={`${inter.className} min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>
        <Providers>
          <div className="min-h-screen bg-slate-100/60 dark:bg-slate-900/80">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
