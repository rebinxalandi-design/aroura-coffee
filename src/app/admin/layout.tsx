import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin — Aroura Coffee",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
