import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
export const metadata: Metadata = {
  title: { default: "ViralForge AI — Your content command center", template: "%s | ViralForge AI" },
  description: "Plan, create and manage content from one beautifully simple workspace.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Toaster position="top-right" richColors closeButton/>{children}</body></html>;
}
