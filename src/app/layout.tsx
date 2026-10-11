import type { Metadata } from "next";
import "./compiled-tailwind.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinFluence — Autonomous Financial Event Impact Graph",
  description:
    "Self-auditing financial knowledge graph linking macro shocks to equities through empirical backtesting and explainable LLM reasoning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased bg-black">
      <body className="min-h-full flex flex-col bg-black text-zinc-100 font-sans selection:bg-white/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
