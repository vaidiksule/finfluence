import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finfluence — Autonomous Financial Event Market Impact Graph",
  description:
    "AI-powered financial intelligence platform that detects macro events and traces how their effects propagate across companies, industries, sectors, and financial assets through dynamic knowledge graphs.",
  keywords: [
    "financial intelligence",
    "event impact graph",
    "market intelligence",
    "autonomous finance",
    "knowledge graph",
    "macro shocks",
    "event study",
    "cumulative abnormal returns",
  ],
  authors: [{ name: "Finfluence Team" }],
  icons: {
    icon: "/logo-no-bg.png",
    shortcut: "/logo-no-bg.png",
    apple: "/logo-no-bg.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#05070D] text-[#F5F7FA] font-sans selection:bg-[#25D9F2]/20 selection:text-[#25D9F2]">
        {children}
      </body>
    </html>
  );
}
