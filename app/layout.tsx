import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Ecofact — Regulatory Intelligence",
  description: "Real-time monitoring of sustainability and ESG regulation across global jurisdictions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-white antialiased flex flex-col h-screen overflow-hidden">
        <Nav />
        <div className="flex-1 overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
