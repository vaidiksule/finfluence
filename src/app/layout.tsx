import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RippleGraph — Autonomous Financial Event Impact Graph",
  description:
    "Self-auditing financial knowledge graph linking macro shocks to equities through empirical backtesting and explainable LLM reasoning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
