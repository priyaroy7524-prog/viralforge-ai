import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AppProvider from "@/components/AppProvider";
import AppShell from "@/components/AppShell";
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  return <AppProvider><AppShell user={user}>{children}</AppShell></AppProvider>;
}
