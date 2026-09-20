import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Init App | Python project scaffolding",
  description: "Plan a production-ready Python project with Init App.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
